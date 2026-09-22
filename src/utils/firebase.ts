import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  update,
  push,
  onValue,
  off,
  get,
  serverTimestamp,
} from 'firebase/database';
import { StudentProfile, GameResult, SubjectId, StudentClass } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyCS72IIA2DjSKMHLkuqUO38rMx-nMo8QVM",
  authDomain: "apna-toppers.firebaseapp.com",
  databaseURL: "https://apna-toppers-default-rtdb.firebaseio.com",
  projectId: "apna-toppers",
  storageBucket: "apna-toppers.firebasestorage.app",
  messagingSenderId: "624297712542",
  appId: "1:624297712542:web:029eac7f1845d0419b548f",
  measurementId: "G-8V73EH015P"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);

export interface FirebaseStudentActivity {
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

export interface FirebaseStudentRecord {
  id: string;
  username: string;
  class: StudentClass;
  avatarId: string;
  currentSubject: SubjectId;
  language: string;
  xp: number;
  coins: number;
  currentLevel: number;
  unlockedLevels: number[];
  streak: number;
  totalQuestionsSolved: number;
  totalCorrectAnswers: number;
  totalGamesPlayed: number;
  totalTimeSpentSeconds: number;
  joinDate: string;
  lastActive: string;
  lastActiveTimestamp: number;
  activities?: Record<string, FirebaseStudentActivity>;
}

// 1. Sync Student Profile to Firebase Realtime Database
export async function syncStudentToFirebase(
  studentId: string,
  profile: StudentProfile
): Promise<void> {
  if (!studentId || !profile.username) return;

  try {
    const studentRef = ref(rtdb, `students/${studentId}`);
    const snapshot = await get(studentRef);
    const existing = snapshot.val() as FirebaseStudentRecord | null;

    const nowIso = new Date().toISOString();
    const nowTs = Date.now();

    const dataToSave: Partial<FirebaseStudentRecord> = {
      id: studentId,
      username: profile.username,
      class: profile.class,
      avatarId: profile.avatarId,
      currentSubject: profile.currentSubject || 'maths',
      language: profile.language || 'en',
      xp: profile.xp || 0,
      coins: profile.coins || 0,
      currentLevel: profile.currentLevel || 1,
      unlockedLevels: profile.unlockedLevels || [1],
      streak: profile.streak || 1,
      totalQuestionsSolved: profile.totalQuestionsSolved || 0,
      totalCorrectAnswers: profile.totalCorrectAnswers || 0,
      totalGamesPlayed: existing?.totalGamesPlayed || 0,
      totalTimeSpentSeconds: existing?.totalTimeSpentSeconds || 0,
      joinDate: existing?.joinDate || nowIso,
      lastActive: nowIso,
      lastActiveTimestamp: nowTs,
    };

    if (existing) {
      await update(studentRef, dataToSave);
    } else {
      await set(studentRef, dataToSave);
    }
  } catch (err) {
    console.warn('Firebase RTDB student sync notice:', err);
  }
}

// 2. Log Game/Quiz Activity to Firebase Realtime Database
export async function logActivityToFirebase(
  studentId: string,
  profile: StudentProfile,
  result: GameResult,
  subject: SubjectId
): Promise<void> {
  if (!studentId) return;

  try {
    const studentRef = ref(rtdb, `students/${studentId}`);
    const snapshot = await get(studentRef);
    const existing = snapshot.val() as FirebaseStudentRecord | null;

    const nowTs = Date.now();
    const nowIso = new Date().toISOString();

    const activitiesRef = ref(rtdb, `students/${studentId}/activities`);
    const newActRef = push(activitiesRef);

    const activityPayload: FirebaseStudentActivity = {
      id: newActRef.key || `act_${nowTs}`,
      levelId: result.levelId,
      levelName: result.levelName,
      subject,
      difficulty: result.difficulty,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      accuracy: result.accuracy,
      xpEarned: result.xpEarned,
      coinsEarned: result.coinsEarned,
      starsEarned: result.starsEarned,
      timeSpentSeconds: result.timeSpentSeconds,
      isDailyChallenge: result.isDailyChallenge || false,
      timestamp: nowTs,
    };

    await set(newActRef, activityPayload);

    // Update cumulative student stats in RTDB
    const updatedGamesCount = (existing?.totalGamesPlayed || 0) + 1;
    const updatedTimeSpent = (existing?.totalTimeSpentSeconds || 0) + (result.timeSpentSeconds || 0);
    const updatedQuestions = (profile.totalQuestionsSolved || 0);
    const updatedCorrect = (profile.totalCorrectAnswers || 0);

    await update(studentRef, {
      username: profile.username,
      class: profile.class,
      avatarId: profile.avatarId,
      currentSubject: subject,
      xp: profile.xp,
      coins: profile.coins,
      currentLevel: profile.currentLevel,
      unlockedLevels: profile.unlockedLevels,
      totalGamesPlayed: updatedGamesCount,
      totalTimeSpentSeconds: updatedTimeSpent,
      totalQuestionsSolved: updatedQuestions,
      totalCorrectAnswers: updatedCorrect,
      lastActive: nowIso,
      lastActiveTimestamp: nowTs,
    });
  } catch (err) {
    console.warn('Firebase RTDB activity log notice:', err);
  }
}

// 3. Admin: Realtime Listener for All Students with Rank Calculation
export function subscribeToFirebaseStudents(
  callback: (students: (FirebaseStudentRecord & { rank: number; calculatedAccuracy: number })[]) => void,
  onError?: (err: Error) => void
): () => void {
  const studentsRef = ref(rtdb, 'students');

  const unsubscribe = onValue(
    studentsRef,
    (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }

      // Convert object dictionary to array
      const rawList: FirebaseStudentRecord[] = Object.keys(data).map((key) => {
        const item = data[key];
        return {
          ...item,
          id: key,
          activities: item.activities || {},
        };
      });

      // Sort by XP descending to compute dynamic Live Rank
      rawList.sort((a, b) => (b.xp || 0) - (a.xp || 0));

      const enriched = rawList.map((st, idx) => {
        const totalQ = st.totalQuestionsSolved || 0;
        const totalC = st.totalCorrectAnswers || 0;
        const acc = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;
        return {
          ...st,
          rank: idx + 1, // 1st, 2nd, 3rd...
          calculatedAccuracy: acc,
        };
      });

      callback(enriched);
    },
    (err) => {
      console.error('Firebase RTDB subscription error:', err);
      if (onError) onError(err);
    }
  );

  // Return unsubscribe function
  return () => {
    off(studentsRef);
  };
}

// 4. Admin: Seed Initial Sample Data into Firebase if database is empty
export async function seedFirebaseSampleDataIfEmpty(): Promise<boolean> {
  try {
    const studentsRef = ref(rtdb, 'students');
    const snapshot = await get(studentsRef);
    if (snapshot.exists()) {
      return false; // already has data
    }

    const now = Date.now();
    const dayMs = 24 * 3600 * 1000;

    const sampleData: Record<string, Partial<FirebaseStudentRecord>> = {
      student_aarav_01: {
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
        totalTimeSpentSeconds: 165,
        joinDate: new Date(now - 4 * dayMs).toISOString(),
        lastActive: new Date(now - 10 * 60 * 1000).toISOString(),
        lastActiveTimestamp: now - 10 * 60 * 1000,
      },
      student_ananya_02: {
        id: 'student_ananya_02',
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
        totalTimeSpentSeconds: 240,
        joinDate: new Date(now - 5 * dayMs).toISOString(),
        lastActive: new Date(now - 30 * 60 * 1000).toISOString(),
        lastActiveTimestamp: now - 30 * 60 * 1000,
      },
      student_priya_03: {
        id: 'student_priya_03',
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
        totalTimeSpentSeconds: 143,
        joinDate: new Date(now - 3 * dayMs).toISOString(),
        lastActive: new Date(now - 2 * 3600 * 1000).toISOString(),
        lastActiveTimestamp: now - 2 * 3600 * 1000,
      },
      student_rohan_04: {
        id: 'student_rohan_04',
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
        totalTimeSpentSeconds: 98,
        joinDate: new Date(now - 2 * dayMs).toISOString(),
        lastActive: new Date(now - 5 * 3600 * 1000).toISOString(),
        lastActiveTimestamp: now - 5 * 3600 * 1000,
      },
      student_kabir_05: {
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
        totalTimeSpentSeconds: 58,
        joinDate: new Date(now - 1 * dayMs).toISOString(),
        lastActive: new Date(now - 8 * 3600 * 1000).toISOString(),
        lastActiveTimestamp: now - 8 * 3600 * 1000,
      },
    };

    await set(studentsRef, sampleData);
    return true;
  } catch (err) {
    console.warn('Firebase seed notice:', err);
    return false;
  }
}
