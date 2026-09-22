var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");

// server/studentsStore.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var DB_FILE = import_path.default.join(DATA_DIR, "students_db.json");
function ensureDataDir() {
  try {
    if (!import_fs.default.existsSync(DATA_DIR)) {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}
function generateSampleStudents() {
  const now = Date.now();
  const dayMs = 24 * 3600 * 1e3;
  return [
    {
      id: "student_aarav_01",
      username: "Aarav Sharma",
      class: 6,
      avatarId: "hero_1",
      currentSubject: "social_science",
      language: "as",
      xp: 450,
      coins: 95,
      currentLevel: 7,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7],
      streak: 4,
      totalQuestionsSolved: 50,
      totalCorrectAnswers: 46,
      totalGamesPlayed: 5,
      joinDate: new Date(now - 4 * dayMs).toISOString(),
      lastActive: new Date(now - 12 * 60 * 1e3).toISOString(),
      activities: [
        {
          id: "act_101",
          levelName: "\u09B8\u09CC\u09F0\u099C\u0997\u09A4\u09A4 \u0986\u09AE\u09BE\u09F0 \u09AA\u09C3\u09A5\u09BF\u09F1\u09C0 (Ch 1 Quiz)",
          subject: "social_science",
          difficulty: "medium",
          totalQuestions: 10,
          correctAnswers: 10,
          accuracy: 100,
          xpEarned: 100,
          coinsEarned: 20,
          starsEarned: 3,
          timeSpentSeconds: 48,
          timestamp: now - 15 * 60 * 1e3
        },
        {
          id: "act_102",
          levelName: "Level 6 - Speed Multiplication",
          subject: "maths",
          difficulty: "medium",
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 85,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 62,
          timestamp: now - 2 * dayMs
        },
        {
          id: "act_103",
          levelName: "\u09AD\u09BE\u09F0\u09A4\u09F0 \u099C\u09B2\u09AC\u09BE\u09AF\u09BC\u09C1 (Ch 8 Q&A)",
          subject: "social_science",
          difficulty: "easy",
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 80,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 55,
          timestamp: now - 3 * dayMs
        }
      ]
    },
    {
      id: "student_priya_02",
      username: "Priya Das",
      class: 3,
      avatarId: "hero_2",
      currentSubject: "maths",
      language: "hi",
      xp: 320,
      coins: 60,
      currentLevel: 5,
      unlockedLevels: [1, 2, 3, 4, 5],
      streak: 3,
      totalQuestionsSolved: 35,
      totalCorrectAnswers: 31,
      totalGamesPlayed: 4,
      joinDate: new Date(now - 3 * dayMs).toISOString(),
      lastActive: new Date(now - 45 * 60 * 1e3).toISOString(),
      activities: [
        {
          id: "act_201",
          levelName: "Level 4 - Subtraction Wonder",
          subject: "maths",
          difficulty: "easy",
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 75,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 65,
          timestamp: now - 50 * 60 * 1e3
        },
        {
          id: "act_202",
          levelName: "Daily Math Challenge",
          subject: "maths",
          difficulty: "medium",
          totalQuestions: 10,
          correctAnswers: 8,
          accuracy: 80,
          xpEarned: 90,
          coinsEarned: 20,
          starsEarned: 2,
          timeSpentSeconds: 78,
          isDailyChallenge: true,
          timestamp: now - 1 * dayMs
        }
      ]
    },
    {
      id: "student_rohan_03",
      username: "Rohan Borah",
      class: 6,
      avatarId: "hero_3",
      currentSubject: "social_science",
      language: "as",
      xp: 290,
      coins: 55,
      currentLevel: 4,
      unlockedLevels: [1, 2, 3, 4],
      streak: 2,
      totalQuestionsSolved: 30,
      totalCorrectAnswers: 28,
      totalGamesPlayed: 3,
      joinDate: new Date(now - 2 * dayMs).toISOString(),
      lastActive: new Date(now - 2 * 3600 * 1e3).toISOString(),
      activities: [
        {
          id: "act_301",
          levelName: "\u09AA\u09C3\u09A5\u09BF\u09F1\u09C0\u09F0 \u0997\u09A4\u09BF \u0986\u09F0\u09C1 \u098B\u09A4\u09C1 \u09AA\u09F0\u09BF\u09AC\u09F0\u09CD\u09A4\u09A8 (Ch 3)",
          subject: "social_science",
          difficulty: "medium",
          totalQuestions: 10,
          correctAnswers: 10,
          accuracy: 100,
          xpEarned: 100,
          coinsEarned: 20,
          starsEarned: 3,
          timeSpentSeconds: 52,
          timestamp: now - 2 * 3600 * 1e3
        }
      ]
    },
    {
      id: "student_ananya_04",
      username: "Ananya Sen",
      class: 10,
      avatarId: "hero_4",
      currentSubject: "science",
      language: "en",
      xp: 580,
      coins: 130,
      currentLevel: 12,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      streak: 5,
      totalQuestionsSolved: 70,
      totalCorrectAnswers: 66,
      totalGamesPlayed: 7,
      joinDate: new Date(now - 5 * dayMs).toISOString(),
      lastActive: new Date(now - 5 * 3600 * 1e3).toISOString(),
      activities: [
        {
          id: "act_401",
          levelName: "Science - Electricity & Energy",
          subject: "science",
          difficulty: "hard",
          totalQuestions: 10,
          correctAnswers: 10,
          accuracy: 100,
          xpEarned: 120,
          coinsEarned: 25,
          starsEarned: 3,
          timeSpentSeconds: 70,
          timestamp: now - 6 * 3600 * 1e3
        },
        {
          id: "act_402",
          levelName: "Level 11 - Quadratic Equations",
          subject: "maths",
          difficulty: "hard",
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 110,
          coinsEarned: 20,
          starsEarned: 3,
          timeSpentSeconds: 85,
          timestamp: now - 1 * dayMs
        }
      ]
    },
    {
      id: "student_kabir_05",
      username: "Kabir Khan",
      class: "Nursery",
      avatarId: "hero_5",
      currentSubject: "maths",
      language: "en",
      xp: 140,
      coins: 30,
      currentLevel: 2,
      unlockedLevels: [1, 2],
      streak: 1,
      totalQuestionsSolved: 20,
      totalCorrectAnswers: 18,
      totalGamesPlayed: 2,
      joinDate: new Date(now - 1 * dayMs).toISOString(),
      lastActive: new Date(now - 8 * 3600 * 1e3).toISOString(),
      activities: [
        {
          id: "act_501",
          levelName: "Fun Counting Apples & Stars",
          subject: "maths",
          difficulty: "easy",
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 70,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 58,
          timestamp: now - 8 * 3600 * 1e3
        }
      ]
    },
    {
      id: "student_sneha_06",
      username: "Sneha Gogoi",
      class: 5,
      avatarId: "hero_6",
      currentSubject: "english_speaking",
      language: "as",
      xp: 360,
      coins: 75,
      currentLevel: 6,
      unlockedLevels: [1, 2, 3, 4, 5, 6],
      streak: 3,
      totalQuestionsSolved: 40,
      totalCorrectAnswers: 36,
      totalGamesPlayed: 4,
      joinDate: new Date(now - 3 * dayMs).toISOString(),
      lastActive: new Date(now - 22 * 3600 * 1e3).toISOString(),
      activities: [
        {
          id: "act_601",
          levelName: "Everyday Manners & Polite Words",
          subject: "english_speaking",
          difficulty: "easy",
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 80,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 50,
          timestamp: now - 22 * 3600 * 1e3
        }
      ]
    }
  ];
}
var studentsCache = null;
function loadAllStudents() {
  ensureDataDir();
  if (studentsCache !== null) {
    return studentsCache;
  }
  try {
    if (import_fs.default.existsSync(DB_FILE)) {
      const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
      studentsCache = JSON.parse(raw);
      if (Array.isArray(studentsCache)) {
        return studentsCache;
      }
    }
  } catch (err) {
    console.error("Failed reading students db file:", err);
  }
  studentsCache = generateSampleStudents();
  saveAllStudents(studentsCache);
  return studentsCache;
}
function saveAllStudents(students) {
  ensureDataDir();
  studentsCache = students;
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(students, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed writing students db file:", err);
  }
}
function upsertStudent(data) {
  const students = loadAllStudents();
  const existingIdx = students.findIndex((s) => s.id === data.id || s.username.toLowerCase() === data.username.toLowerCase() && s.class === data.class);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (existingIdx >= 0) {
    const prev = students[existingIdx];
    const updated = {
      ...prev,
      ...data,
      // preserve activities
      activities: prev.activities || [],
      lastActive: now,
      totalGamesPlayed: Math.max(prev.totalGamesPlayed || 0, prev.activities ? prev.activities.length : 0)
    };
    students[existingIdx] = updated;
    saveAllStudents(students);
    return updated;
  } else {
    const newStudent = {
      id: data.id || `student_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      username: data.username,
      class: data.class || 5,
      avatarId: data.avatarId || "hero_1",
      currentSubject: data.currentSubject || "maths",
      language: data.language || "en",
      xp: data.xp || 0,
      coins: data.coins || 0,
      currentLevel: data.currentLevel || 1,
      unlockedLevels: data.unlockedLevels || [1],
      streak: data.streak || 1,
      totalQuestionsSolved: data.totalQuestionsSolved || 0,
      totalCorrectAnswers: data.totalCorrectAnswers || 0,
      totalGamesPlayed: 0,
      joinDate: now,
      lastActive: now,
      activities: []
    };
    students.unshift(newStudent);
    saveAllStudents(students);
    return newStudent;
  }
}
function recordStudentActivity(studentId, activity) {
  const students = loadAllStudents();
  let student = students.find((s) => s.id === studentId);
  const now = Date.now();
  const act = {
    ...activity,
    id: `act_${now}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: activity.timestamp || now
  };
  if (!student) {
    student = {
      id: studentId,
      username: "Student " + studentId.slice(-4),
      class: 5,
      avatarId: "hero_1",
      currentSubject: activity.subject || "maths",
      language: "en",
      xp: activity.xpEarned || 0,
      coins: activity.coinsEarned || 0,
      currentLevel: activity.levelId || 1,
      unlockedLevels: [1],
      streak: 1,
      totalQuestionsSolved: activity.totalQuestions || 0,
      totalCorrectAnswers: activity.correctAnswers || 0,
      totalGamesPlayed: 1,
      joinDate: (/* @__PURE__ */ new Date()).toISOString(),
      lastActive: (/* @__PURE__ */ new Date()).toISOString(),
      activities: [act]
    };
    students.unshift(student);
  } else {
    student.activities = student.activities || [];
    student.activities.unshift(act);
    student.totalGamesPlayed = student.activities.length;
    student.totalQuestionsSolved = (student.totalQuestionsSolved || 0) + activity.totalQuestions;
    student.totalCorrectAnswers = (student.totalCorrectAnswers || 0) + activity.correctAnswers;
    student.xp = (student.xp || 0) + (activity.xpEarned || 0);
    if (activity.coinsEarned) {
      student.coins = (student.coins || 0) + activity.coinsEarned;
    }
    student.lastActive = (/* @__PURE__ */ new Date()).toISOString();
  }
  saveAllStudents(students);
  return true;
}
function deleteStudentById(studentId) {
  const students = loadAllStudents();
  const initialLen = students.length;
  const filtered = students.filter((s) => s.id !== studentId);
  if (filtered.length !== initialLen) {
    saveAllStudents(filtered);
    return true;
  }
  return false;
}
function resetDemoStudents() {
  const sample = generateSampleStudents();
  saveAllStudents(sample);
  return sample;
}

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "50mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment.");
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nzali789987$&";
function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;
  const expectedToken = "admin_auth_" + Buffer.from(ADMIN_PASSWORD).toString("base64");
  if (authHeader && authHeader.replace("Bearer ", "").trim() === expectedToken) {
    return true;
  }
  const queryToken = req.query.token;
  if (queryToken && queryToken === expectedToken) {
    return true;
  }
  return false;
}
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }
  if (password === ADMIN_PASSWORD) {
    const token = "admin_auth_" + Buffer.from(ADMIN_PASSWORD).toString("base64");
    return res.json({ success: true, token, message: "Admin login successful" });
  } else {
    return res.status(401).json({ error: "Incorrect password! Kripya sahi password dalein." });
  }
});
app.get("/api/admin/overview", (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized. Admin login required." });
  }
  const students = loadAllStudents();
  let totalGamesPlayed = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalXp = 0;
  const classCounts = {};
  students.forEach((s) => {
    totalGamesPlayed += s.totalGamesPlayed || (s.activities ? s.activities.length : 0);
    totalCorrect += s.totalCorrectAnswers || 0;
    totalQuestions += s.totalQuestionsSolved || 0;
    totalXp += s.xp || 0;
    const clsKey = String(s.class);
    classCounts[clsKey] = (classCounts[clsKey] || 0) + 1;
  });
  const overallAccuracy = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
  const studentSummaries = students.map((s) => {
    const questions = s.totalQuestionsSolved || 0;
    const correct = s.totalCorrectAnswers || 0;
    const acc = questions > 0 ? Math.round(correct / questions * 100) : 0;
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
      recentActivities: (s.activities || []).slice(0, 5)
    };
  });
  res.json({
    totalStudents: students.length,
    totalGamesPlayed,
    overallAccuracy,
    totalXp,
    classCounts,
    students: studentSummaries
  });
});
app.get("/api/admin/student/:studentId", (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  const { studentId } = req.params;
  const students = loadAllStudents();
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json({ student });
});
app.delete("/api/admin/student/:studentId", (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  const { studentId } = req.params;
  const ok = deleteStudentById(studentId);
  res.json({ success: ok });
});
app.post("/api/admin/reset-demo", (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  const sample = resetDemoStudents();
  res.json({ success: true, count: sample.length });
});
app.post("/api/students/sync", (req, res) => {
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
      totalCorrectAnswers
    } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username required" });
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
      totalCorrectAnswers
    });
    res.json({ success: true, student: saved });
  } catch (err) {
    console.error("Error syncing student:", err);
    res.status(500).json({ error: "Failed to sync student" });
  }
});
app.post("/api/students/activity", (req, res) => {
  try {
    const { studentId, activity } = req.body;
    if (!studentId || !activity) {
      return res.status(400).json({ error: "studentId and activity are required" });
    }
    recordStudentActivity(studentId, activity);
    res.json({ success: true });
  } catch (err) {
    console.error("Error logging student activity:", err);
    res.status(500).json({ error: "Failed to record activity" });
  }
});
app.post("/api/parse-receipt", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required." });
    }
    const ai = getGeminiClient();
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
    const prompt = `Analyze this receipt image thoroughly and extract all structured data.
Extract:
1. Store/merchant name.
2. Date and time if visible (or empty string).
3. Currency symbol (e.g. $, \u20AC, \xA3, \xA5).
4. Every line item purchased with exact item name, individual item unit price, quantity, and category (e.g. Appetizer, Main, Drink, Dessert, Side, Other).
5. Subtotal (before tax and tip).
6. Tax amount (if shown or 0).
7. Tip amount (if shown on receipt or 0).
8. Grand total.

Make sure prices are numbers (e.g. 14.50, not "$14.50"). Do not miss any line items.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            merchantName: { type: import_genai.Type.STRING, description: "Name of the business or restaurant" },
            date: { type: import_genai.Type.STRING, description: "Date and time of purchase" },
            currency: { type: import_genai.Type.STRING, description: "Currency symbol like $" },
            items: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  name: { type: import_genai.Type.STRING, description: "Name of the item" },
                  price: { type: import_genai.Type.NUMBER, description: "Unit price of the item" },
                  quantity: { type: import_genai.Type.INTEGER, description: "Quantity purchased" },
                  category: { type: import_genai.Type.STRING, description: "Category of item" }
                },
                required: ["name", "price", "quantity"]
              }
            },
            subtotal: { type: import_genai.Type.NUMBER, description: "Subtotal before tax & tip" },
            tax: { type: import_genai.Type.NUMBER, description: "Tax amount" },
            tip: { type: import_genai.Type.NUMBER, description: "Tip amount if listed" },
            grandTotal: { type: import_genai.Type.NUMBER, description: "Final total" }
          },
          required: ["merchantName", "items", "subtotal", "tax", "grandTotal"]
        }
      }
    });
    const parsedData = JSON.parse(response.text || "{}");
    const itemsWithIds = (parsedData.items || []).map((item, idx) => ({
      id: `item-${Date.now()}-${idx + 1}`,
      name: item.name || `Item ${idx + 1}`,
      price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
      quantity: typeof item.quantity === "number" ? item.quantity : 1,
      category: item.category || "General",
      assignedTo: []
    }));
    const calculatedSubtotal = itemsWithIds.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const subtotal = parsedData.subtotal || calculatedSubtotal;
    const tax = parsedData.tax || 0;
    const tip = parsedData.tip || 0;
    const grandTotal = parsedData.grandTotal || subtotal + tax + tip;
    return res.json({
      merchantName: parsedData.merchantName || "Receipt",
      date: parsedData.date || (/* @__PURE__ */ new Date()).toLocaleDateString(),
      currency: parsedData.currency || "$",
      items: itemsWithIds,
      subtotal,
      tax,
      tip,
      tipPercentage: subtotal > 0 && tip > 0 ? Math.round(tip / subtotal * 100) : 0,
      grandTotal
    });
  } catch (err) {
    console.error("Error parsing receipt:", err);
    res.status(500).json({ error: err.message || "Failed to parse receipt." });
  }
});
app.post("/api/split-command", async (req, res) => {
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
      return res.status(400).json({ error: "Command text is required." });
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
      model: "gemini-3.8-flash",
      contents: [
        {
          text: `Current State:
Items: ${JSON.stringify(currentItems, null, 2)}
People: ${JSON.stringify(currentPeople, null, 2)}
Current Tax: ${currentTax}
Current Tip: ${currentTip}

Recent Conversation History:
${conversationHistory.slice(-4).map((m) => `${m.sender}: ${m.text}`).join("\n")}

User Command: "${command}"

Process this command and return the updated state.`
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            reply: {
              type: import_genai.Type.STRING,
              description: "Conversational response to display in chat confirming what was done or answering question."
            },
            actionsApplied: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: 'Short summaries of actions applied, e.g., ["Assigned Nachos to Dhruv", "Added Sue to Pizza"]'
            },
            updatedItems: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  id: { type: import_genai.Type.STRING },
                  name: { type: import_genai.Type.STRING },
                  price: { type: import_genai.Type.NUMBER },
                  quantity: { type: import_genai.Type.INTEGER },
                  category: { type: import_genai.Type.STRING },
                  assignedTo: {
                    type: import_genai.Type.ARRAY,
                    items: { type: import_genai.Type.STRING },
                    description: "List of person IDs assigned to this item"
                  }
                },
                required: ["id", "name", "price", "quantity", "assignedTo"]
              },
              description: "The complete updated list of all receipt items with their assignedTo arrays."
            },
            addedPeople: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  id: { type: import_genai.Type.STRING },
                  name: { type: import_genai.Type.STRING }
                },
                required: ["id", "name"]
              },
              description: "Any new people discovered in the command who were not in currentPeople."
            },
            updatedTip: {
              type: import_genai.Type.NUMBER,
              description: "Updated tip amount if command requested tip change, otherwise omit or return current tip."
            },
            updatedTax: {
              type: import_genai.Type.NUMBER,
              description: "Updated tax amount if command requested tax change, otherwise omit or return current tax."
            }
          },
          required: ["reply", "actionsApplied", "updatedItems"]
        }
      }
    });
    const parsedResult = JSON.parse(response.text || "{}");
    return res.json(parsedResult);
  } catch (err) {
    console.error("Error handling split command:", err);
    res.status(500).json({ error: err.message || "Failed to process command." });
  }
});
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SplitReceipt AI Server running on http://0.0.0.0:${PORT}`);
  });
}
setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
