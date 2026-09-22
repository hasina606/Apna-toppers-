import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy Gemini client helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Admin & Student Store Integration
import {
  loadAllStudents,
  upsertStudent,
  recordStudentActivity,
  deleteStudentById,
  resetDemoStudents,
  StudentRecord,
} from './server/studentsStore';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nzali789987$&';

function verifyAdminToken(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  const expectedToken = 'admin_auth_' + Buffer.from(ADMIN_PASSWORD).toString('base64');
  if (authHeader && authHeader.replace('Bearer ', '').trim() === expectedToken) {
    return true;
  }
  const queryToken = req.query.token as string;
  if (queryToken && queryToken === expectedToken) {
    return true;
  }
  return false;
}

// Admin: Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password === ADMIN_PASSWORD) {
    const token = 'admin_auth_' + Buffer.from(ADMIN_PASSWORD).toString('base64');
    return res.json({ success: true, token, message: 'Admin login successful' });
  } else {
    return res.status(401).json({ error: 'Incorrect password! Kripya sahi password dalein.' });
  }
});

// Admin: Overview & analytics
app.get('/api/admin/overview', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Admin login required.' });
  }

  const students = loadAllStudents();

  // Aggregate stats
  let totalGamesPlayed = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalXp = 0;
  const classCounts: Record<string, number> = {};

  students.forEach((s) => {
    totalGamesPlayed += s.totalGamesPlayed || (s.activities ? s.activities.length : 0);
    totalCorrect += s.totalCorrectAnswers || 0;
    totalQuestions += s.totalQuestionsSolved || 0;
    totalXp += s.xp || 0;

    const clsKey = String(s.class);
    classCounts[clsKey] = (classCounts[clsKey] || 0) + 1;
  });

  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Format student summaries with latest activities
  const studentSummaries = students.map((s) => {
    const questions = s.totalQuestionsSolved || 0;
    const correct = s.totalCorrectAnswers || 0;
    const acc = questions > 0 ? Math.round((correct / questions) * 100) : 0;
    return {
      id: s.id,
      username: s.username,
      class: s.class,
      avatarId: s.avatarId,
      currentSubject: s.currentSubject,
      language: s.language,
      xp: s.xp,
      coins: s.coins,
      currentLevel: s.currentLevel,
      totalGamesPlayed: s.totalGamesPlayed || (s.activities ? s.activities.length : 0),
      accuracy: acc,
      totalQuestionsSolved: s.totalQuestionsSolved,
      totalCorrectAnswers: s.totalCorrectAnswers,
      streak: s.streak,
      joinDate: s.joinDate,
      lastActive: s.lastActive,
      recentActivities: (s.activities || []).slice(0, 5),
    };
  });

  res.json({
    totalStudents: students.length,
    totalGamesPlayed,
    overallAccuracy,
    totalXp,
    classCounts,
    students: studentSummaries,
  });
});

// Admin: Single student detailed history
app.get('/api/admin/student/:studentId', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { studentId } = req.params;
  const students = loadAllStudents();
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json({ student });
});

// Admin: Delete student
app.delete('/api/admin/student/:studentId', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { studentId } = req.params;
  const ok = deleteStudentById(studentId);
  res.json({ success: ok });
});

// Admin: Reset / re-seed demo data
app.post('/api/admin/reset-demo', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const sample = resetDemoStudents();
  res.json({ success: true, count: sample.length });
});

// Public / Student: Sync Profile (when entering, logging in, or changing class/profile)
app.post('/api/students/sync', (req, res) => {
  try {
    const {
      studentId,
      username,
      class: studentClass,
      avatarId,
      currentSubject,
      language,
      xp,
      coins,
      currentLevel,
      unlockedLevels,
      streak,
      totalQuestionsSolved,
      totalCorrectAnswers,
    } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const saved = upsertStudent({
      id: studentId,
      username,
      class: studentClass,
      avatarId,
      currentSubject,
      language,
      xp,
      coins,
      currentLevel,
      unlockedLevels,
      streak,
      totalQuestionsSolved,
      totalCorrectAnswers,
    });

    res.json({ success: true, student: saved });
  } catch (err: any) {
    console.error('Error syncing student:', err);
    res.status(500).json({ error: 'Failed to sync student' });
  }
});

// Public / Student: Record game session activity
app.post('/api/students/activity', (req, res) => {
  try {
    const { studentId, activity } = req.body;
    if (!studentId || !activity) {
      return res.status(400).json({ error: 'studentId and activity are required' });
    }

    recordStudentActivity(studentId, activity);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error logging student activity:', err);
    res.status(500).json({ error: 'Failed to record activity' });
  }
});

// Endpoint: Parse Receipt Image
app.post('/api/parse-receipt', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required.' });
    }

    const ai = getGeminiClient();

    // Strip data url prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');

    const prompt = `Analyze this receipt image thoroughly and extract all structured data.
Extract:
1. Store/merchant name.
2. Date and time if visible (or empty string).
3. Currency symbol (e.g. $, €, £, ¥).
4. Every line item purchased with exact item name, individual item unit price, quantity, and category (e.g. Appetizer, Main, Drink, Dessert, Side, Other).
5. Subtotal (before tax and tip).
6. Tax amount (if shown or 0).
7. Tip amount (if shown on receipt or 0).
8. Grand total.

Make sure prices are numbers (e.g. 14.50, not "$14.50"). Do not miss any line items.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchantName: { type: Type.STRING, description: 'Name of the business or restaurant' },
            date: { type: Type.STRING, description: 'Date and time of purchase' },
            currency: { type: Type.STRING, description: 'Currency symbol like $' },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: 'Name of the item' },
                  price: { type: Type.NUMBER, description: 'Unit price of the item' },
                  quantity: { type: Type.INTEGER, description: 'Quantity purchased' },
                  category: { type: Type.STRING, description: 'Category of item' },
                },
                required: ['name', 'price', 'quantity'],
              },
            },
            subtotal: { type: Type.NUMBER, description: 'Subtotal before tax & tip' },
            tax: { type: Type.NUMBER, description: 'Tax amount' },
            tip: { type: Type.NUMBER, description: 'Tip amount if listed' },
            grandTotal: { type: Type.NUMBER, description: 'Final total' },
          },
          required: ['merchantName', 'items', 'subtotal', 'tax', 'grandTotal'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    
    // Add unique IDs to parsed items
    const itemsWithIds = (parsedData.items || []).map((item: any, idx: number) => ({
      id: `item-${Date.now()}-${idx + 1}`,
      name: item.name || `Item ${idx + 1}`,
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
      quantity: typeof item.quantity === 'number' ? item.quantity : 1,
      category: item.category || 'General',
      assignedTo: [],
    }));

    const calculatedSubtotal = itemsWithIds.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0);
    const subtotal = parsedData.subtotal || calculatedSubtotal;
    const tax = parsedData.tax || 0;
    const tip = parsedData.tip || 0;
    const grandTotal = parsedData.grandTotal || (subtotal + tax + tip);

    return res.json({
      merchantName: parsedData.merchantName || 'Receipt',
      date: parsedData.date || new Date().toLocaleDateString(),
      currency: parsedData.currency || '$',
      items: itemsWithIds,
      subtotal,
      tax,
      tip,
      tipPercentage: subtotal > 0 && tip > 0 ? Math.round((tip / subtotal) * 100) : 0,
      grandTotal,
    });
  } catch (err: any) {
    console.error('Error parsing receipt:', err);
    res.status(500).json({ error: err.message || 'Failed to parse receipt.' });
  }
});

// Endpoint: Natural Language Split Command Processor
app.post('/api/split-command', async (req, res) => {
  try {
    const {
      command,
      currentItems,
      currentPeople,
      currentTax,
      currentTip,
      conversationHistory = []
    } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command text is required.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert, precise assistant for splitting restaurant bills and receipts.
Your job is to parse natural language user commands (such as "Dhruv had the nachos", "Sarah and Sue shared the pizza", "Alex only had 1 drink and paid $5 for apps", "Remove Dhruv from the pizza", "Set tip to 20%", "Split the remaining items evenly between everyone").

You will inspect:
1. Current list of receipt items (with their names, prices, quantities, and current assigned person IDs).
2. Current list of known people (names and IDs).
3. Current tax and tip.
4. User's command.

Rules for updating assignments:
- Match item names intelligently even if partial or colloquial (e.g. "nachos" -> "Loaded Queso Nachos", "pizza" -> "Wood-Fired Margherita Pizza", "the drinks" / "the beer" -> all drinks or beer items).
- If a person is mentioned who isn't yet in currentPeople, add them with a new ID (e.g. "person-" + lowercase name) and the person's name.
- If the command says "[Person] had [Item]" or "[A] and [B] shared [Item]", assign the item to those people.
- If the command says "remove [Person] from [Item]", remove their ID from that item's assignedTo.
- If the command says "split [Item] among all" or "split everything remaining evenly", assign accordingly.
- If the user asks to change tip (e.g. "set tip to 20%" or "change tip to $15"), calculate or set the new tip.
- If the user asks a general question (e.g. "Who owes what?" or "What's unassigned?"), explain clearly in the reply without mutating items unnecessarily.
- Your reply should be warm, friendly, concise, and clearly confirm which items were assigned to whom and the cost breakdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          text: `Current State:
Items: ${JSON.stringify(currentItems, null, 2)}
People: ${JSON.stringify(currentPeople, null, 2)}
Current Tax: ${currentTax}
Current Tip: ${currentTip}

Recent Conversation History:
${conversationHistory.slice(-4).map((m: any) => `${m.sender}: ${m.text}`).join('\n')}

User Command: "${command}"

Process this command and return the updated state.`
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Conversational response to display in chat confirming what was done or answering question.',
            },
            actionsApplied: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Short summaries of actions applied, e.g., ["Assigned Nachos to Dhruv", "Added Sue to Pizza"]',
            },
            updatedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  quantity: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                  assignedTo: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'List of person IDs assigned to this item',
                  },
                },
                required: ['id', 'name', 'price', 'quantity', 'assignedTo'],
              },
              description: 'The complete updated list of all receipt items with their assignedTo arrays.',
            },
            addedPeople: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                },
                required: ['id', 'name'],
              },
              description: 'Any new people discovered in the command who were not in currentPeople.',
            },
            updatedTip: {
              type: Type.NUMBER,
              description: 'Updated tip amount if command requested tip change, otherwise omit or return current tip.',
            },
            updatedTax: {
              type: Type.NUMBER,
              description: 'Updated tax amount if command requested tax change, otherwise omit or return current tax.',
            },
          },
          required: ['reply', 'actionsApplied', 'updatedItems'],
        },
      },
    });

    const parsedResult = JSON.parse(response.text || '{}');
    return res.json(parsedResult);
  } catch (err: any) {
    console.error('Error handling split command:', err);
    res.status(500).json({ error: err.message || 'Failed to process command.' });
  }
});

// Setup Vite development middleware or static production serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SplitReceipt AI Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
