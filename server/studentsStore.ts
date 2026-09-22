import fs from 'fs';
import path from 'path';

export interface StudentActivityLog {
  id: string;
  levelId?: number;
  levelName: string;
  subject: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  coinsEarned?: number;
  starsEarned?: number;
  timeSpentSeconds: number;
  isDailyChallenge?: boolean;
  timestamp: number;
}

export interface StudentRecord {
  id: string;
  username: string;
  class: string | number;
  avatarId: string;
  currentSubject: string;
  language: string;
  xp: number;
  coins: number;
  currentLevel: number;
  unlockedLevels: number[];
  streak: number;
  totalQuestionsSolved: number;
  totalCorrectAnswers: number;
  totalGamesPlayed: number;
  joinDate: string;
  lastActive: string;
  activities: StudentActivityLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'students_db.json');

// Ensure data folder exists
function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// Generate realistic initial student records
function generateSampleStudents(): StudentRecord[] {
  const now = Date.now();
  const dayMs = 24 * 3600 * 1000;

  return [
    {
      id: 'student_aarav_01',
      username: 'Aarav Sharma',
      class: 6,
      avatarId: 'hero_1',
      currentSubject: 'social_science',
      language: 'as',
      xp: 450,
      coins: 95,
      currentLevel: 7,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7],
      streak: 4,
      totalQuestionsSolved: 50,
      totalCorrectAnswers: 46,
      totalGamesPlayed: 5,
      joinDate: new Date(now - 4 * dayMs).toISOString(),
      lastActive: new Date(now - 12 * 60 * 1000).toISOString(),
      activities: [
        {
          id: 'act_101',
          levelName: 'সৌৰজগতত আমাৰ পৃথিৱী (Ch 1 Quiz)',
          subject: 'social_science',
          difficulty: 'medium',
          totalQuestions: 10,
          correctAnswers: 10,
          accuracy: 100,
          xpEarned: 100,
          coinsEarned: 20,
          starsEarned: 3,
          timeSpentSeconds: 48,
          timestamp: now - 15 * 60 * 1000,
        },
        {
          id: 'act_102',
          levelName: 'Level 6 - Speed Multiplication',
          subject: 'maths',
          difficulty: 'medium',
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 85,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 62,
          timestamp: now - 2 * dayMs,
        },
        {
          id: 'act_103',
          levelName: 'ভাৰতৰ জলবায়ু (Ch 8 Q&A)',
          subject: 'social_science',
          difficulty: 'easy',
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 80,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 55,
          timestamp: now - 3 * dayMs,
        },
      ],
    },
    {
      id: 'student_priya_02',
      username: 'Priya Das',
      class: 3,
      avatarId: 'hero_2',
      currentSubject: 'maths',
      language: 'hi',
      xp: 320,
      coins: 60,
      currentLevel: 5,
      unlockedLevels: [1, 2, 3, 4, 5],
      streak: 3,
      totalQuestionsSolved: 35,
      totalCorrectAnswers: 31,
      totalGamesPlayed: 4,
      joinDate: new Date(now - 3 * dayMs).toISOString(),
      lastActive: new Date(now - 45 * 60 * 1000).toISOString(),
      activities: [
        {
          id: 'act_201',
          levelName: 'Level 4 - Subtraction Wonder',
          subject: 'maths',
          difficulty: 'easy',
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 75,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 65,
          timestamp: now - 50 * 60 * 1000,
        },
        {
          id: 'act_202',
          levelName: 'Daily Math Challenge',
          subject: 'maths',
          difficulty: 'medium',
          totalQuestions: 10,
          correctAnswers: 8,
          accuracy: 80,
          xpEarned: 90,
          coinsEarned: 20,
          starsEarned: 2,
          timeSpentSeconds: 78,
          isDailyChallenge: true,
          timestamp: now - 1 * dayMs,
        },
      ],
    },
    {
      id: 'student_rohan_03',
      username: 'Rohan Borah',
      class: 6,
      avatarId: 'hero_3',
      currentSubject: 'social_science',
      language: 'as',
      xp: 290,
      coins: 55,
      currentLevel: 4,
      unlockedLevels: [1, 2, 3, 4],
      streak: 2,
      totalQuestionsSolved: 30,
      totalCorrectAnswers: 28,
      totalGamesPlayed: 3,
      joinDate: new Date(now - 2 * dayMs).toISOString(),
      lastActive: new Date(now - 2 * 3600 * 1000).toISOString(),
      activities: [
        {
          id: 'act_301',
          levelName: 'পৃথিৱীৰ গতি আৰু ঋতু পৰিবৰ্তন (Ch 3)',
          subject: 'social_science',
          difficulty: 'medium',
          totalQuestions: 10,
          correctAnswers: 10,
          accuracy: 100,
          xpEarned: 100,
          coinsEarned: 20,
          starsEarned: 3,
          timeSpentSeconds: 52,
          timestamp: now - 2 * 3600 * 1000,
        },
      ],
    },
    {
      id: 'student_ananya_04',
      username: 'Ananya Sen',
      class: 10,
      avatarId: 'hero_4',
      currentSubject: 'science',
      language: 'en',
      xp: 580,
      coins: 130,
      currentLevel: 12,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      streak: 5,
      totalQuestionsSolved: 70,
      totalCorrectAnswers: 66,
      totalGamesPlayed: 7,
      joinDate: new Date(now - 5 * dayMs).toISOString(),
      lastActive: new Date(now - 5 * 3600 * 1000).toISOString(),
      activities: [
        {
          id: 'act_401',
          levelName: 'Science - Electricity & Energy',
          subject: 'science',
          difficulty: 'hard',
          totalQuestions: 10,
          correctAnswers: 10,
          accuracy: 100,
          xpEarned: 120,
          coinsEarned: 25,
          starsEarned: 3,
          timeSpentSeconds: 70,
          timestamp: now - 6 * 3600 * 1000,
        },
        {
          id: 'act_402',
          levelName: 'Level 11 - Quadratic Equations',
          subject: 'maths',
          difficulty: 'hard',
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 110,
          coinsEarned: 20,
          starsEarned: 3,
          timeSpentSeconds: 85,
          timestamp: now - 1 * dayMs,
        },
      ],
    },
    {
      id: 'student_kabir_05',
      username: 'Kabir Khan',
      class: 'Nursery',
      avatarId: 'hero_5',
      currentSubject: 'maths',
      language: 'en',
      xp: 140,
      coins: 30,
      currentLevel: 2,
      unlockedLevels: [1, 2],
      streak: 1,
      totalQuestionsSolved: 20,
      totalCorrectAnswers: 18,
      totalGamesPlayed: 2,
      joinDate: new Date(now - 1 * dayMs).toISOString(),
      lastActive: new Date(now - 8 * 3600 * 1000).toISOString(),
      activities: [
        {
          id: 'act_501',
          levelName: 'Fun Counting Apples & Stars',
          subject: 'maths',
          difficulty: 'easy',
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 70,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 58,
          timestamp: now - 8 * 3600 * 1000,
        },
      ],
    },
    {
      id: 'student_sneha_06',
      username: 'Sneha Gogoi',
      class: 5,
      avatarId: 'hero_6',
      currentSubject: 'english_speaking',
      language: 'as',
      xp: 360,
      coins: 75,
      currentLevel: 6,
      unlockedLevels: [1, 2, 3, 4, 5, 6],
      streak: 3,
      totalQuestionsSolved: 40,
      totalCorrectAnswers: 36,
      totalGamesPlayed: 4,
      joinDate: new Date(now - 3 * dayMs).toISOString(),
      lastActive: new Date(now - 22 * 3600 * 1000).toISOString(),
      activities: [
        {
          id: 'act_601',
          levelName: 'Everyday Manners & Polite Words',
          subject: 'english_speaking',
          difficulty: 'easy',
          totalQuestions: 10,
          correctAnswers: 9,
          accuracy: 90,
          xpEarned: 80,
          coinsEarned: 15,
          starsEarned: 3,
          timeSpentSeconds: 50,
          timestamp: now - 22 * 3600 * 1000,
        },
      ],
    },
  ];
}

// In-memory cache
let studentsCache: StudentRecord[] | null = null;

export function loadAllStudents(): StudentRecord[] {
  ensureDataDir();

  if (studentsCache !== null) {
    return studentsCache;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      studentsCache = JSON.parse(raw);
      if (Array.isArray(studentsCache)) {
        return studentsCache;
      }
    }
  } catch (err) {
    console.error('Failed reading students db file:', err);
  }

  // Fallback to sample students
  studentsCache = generateSampleStudents();
  saveAllStudents(studentsCache);
  return studentsCache;
}

export function saveAllStudents(students: StudentRecord[]): void {
  ensureDataDir();
  studentsCache = students;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(students, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing students db file:', err);
  }
}

// Upsert a student profile (called when user enters / updates profile)
export function upsertStudent(data: Partial<StudentRecord> & { id: string; username: string }): StudentRecord {
  const students = loadAllStudents();
  const existingIdx = students.findIndex((s) => s.id === data.id || (s.username.toLowerCase() === data.username.toLowerCase() && s.class === data.class));

  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const prev = students[existingIdx];
    const updated: StudentRecord = {
      ...prev,
      ...data,
      // preserve activities
      activities: prev.activities || [],
      lastActive: now,
      totalGamesPlayed: Math.max(prev.totalGamesPlayed || 0, prev.activities ? prev.activities.length : 0),
    };
    students[existingIdx] = updated;
    saveAllStudents(students);
    return updated;
  } else {
    const newStudent: StudentRecord = {
      id: data.id || `student_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      username: data.username,
      class: data.class || 5,
      avatarId: data.avatarId || 'hero_1',
      currentSubject: data.currentSubject || 'maths',
      language: data.language || 'en',
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
      activities: [],
    };
    students.unshift(newStudent);
    saveAllStudents(students);
    return newStudent;
  }
}

// Log game activity completed by a student
export function recordStudentActivity(studentId: string, activity: Omit<StudentActivityLog, 'id' | 'timestamp'> & { timestamp?: number }): boolean {
  const students = loadAllStudents();
  let student = students.find((s) => s.id === studentId);

  const now = Date.now();
  const act: StudentActivityLog = {
    ...activity,
    id: `act_${now}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: activity.timestamp || now,
  };

  if (!student) {
    // create placeholder
    student = {
      id: studentId,
      username: 'Student ' + studentId.slice(-4),
      class: 5,
      avatarId: 'hero_1',
      currentSubject: activity.subject || 'maths',
      language: 'en',
      xp: activity.xpEarned || 0,
      coins: activity.coinsEarned || 0,
      currentLevel: activity.levelId || 1,
      unlockedLevels: [1],
      streak: 1,
      totalQuestionsSolved: activity.totalQuestions || 0,
      totalCorrectAnswers: activity.correctAnswers || 0,
      totalGamesPlayed: 1,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      activities: [act],
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
    student.lastActive = new Date().toISOString();
  }

  saveAllStudents(students);
  return true;
}

// Delete student by ID
export function deleteStudentById(studentId: string): boolean {
  const students = loadAllStudents();
  const initialLen = students.length;
  const filtered = students.filter((s) => s.id !== studentId);
  if (filtered.length !== initialLen) {
    saveAllStudents(filtered);
    return true;
  }
  return false;
}

// Reset to seed demo
export function resetDemoStudents(): StudentRecord[] {
  const sample = generateSampleStudents();
  saveAllStudents(sample);
  return sample;
}
