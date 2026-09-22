import { StudentProfile, GameResult, SubjectId, AdminOverviewData, StudentActivityItem } from '../types';
import { syncStudentToFirebase, logActivityToFirebase } from './firebase';

const STUDENT_ID_KEY = 'topper_student_client_id_v1';
const ADMIN_TOKEN_KEY = 'topper_admin_token_session_v1';

// Get or generate permanent client device ID
export function getOrCreateStudentId(): string {
  if (typeof window === 'undefined') return 'server_id';
  let id = localStorage.getItem(STUDENT_ID_KEY);
  if (!id) {
    id = `stud_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(STUDENT_ID_KEY, id);
  }
  return id;
}

// Sync student profile to both server and Firebase Realtime Database
export async function syncStudentToServer(profile: StudentProfile): Promise<void> {
  if (!profile.username) return;
  const studentId = getOrCreateStudentId();

  // 1. Sync to Firebase Realtime Database
  syncStudentToFirebase(studentId, profile).catch((err) => {
    console.debug('Firebase sync notice:', err);
  });

  // 2. Sync to Express server API
  try {
    await fetch('/api/students/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        username: profile.username,
        class: profile.class,
        avatarId: profile.avatarId,
        currentSubject: profile.currentSubject,
        language: profile.language,
        xp: profile.xp,
        coins: profile.coins,
        currentLevel: profile.currentLevel,
        unlockedLevels: profile.unlockedLevels,
        streak: profile.streak,
        totalQuestionsSolved: profile.totalQuestionsSolved,
        totalCorrectAnswers: profile.totalCorrectAnswers,
      }),
    });
  } catch (err) {
    console.debug('Failed to sync student to server:', err);
  }
}

// Record completed game activity to both server and Firebase Realtime Database
export async function logGameActivityToServer(
  profile: StudentProfile,
  result: GameResult,
  subject: SubjectId
): Promise<void> {
  const studentId = getOrCreateStudentId();

  // 1. Log to Firebase Realtime Database
  logActivityToFirebase(studentId, profile, result, subject).catch((err) => {
    console.debug('Firebase activity log notice:', err);
  });

  // 2. Log to Express server API
  try {
    await fetch('/api/students/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        activity: {
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
          isDailyChallenge: result.isDailyChallenge,
          timestamp: Date.now(),
        },
      }),
    });
  } catch (err) {
    console.debug('Failed to log game activity to server:', err);
  }
}

// Admin Token Management
export function getSavedAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function saveAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

// Admin: Login
export async function loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.token) {
      saveAdminToken(data.token);
      return { success: true, token: data.token };
    } else {
      return { success: false, error: data.error || 'Invalid password' };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error while connecting to server' };
  }
}

// Admin: Fetch Overview & All Students
export async function fetchAdminOverview(token: string): Promise<AdminOverviewData> {
  const res = await fetch('/api/admin/overview', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAdminToken();
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to load admin overview');
  }

  return await res.json();
}

// Admin: Fetch single student detail
export async function fetchStudentDetails(
  studentId: string,
  token: string
): Promise<{ student: any; activities: StudentActivityItem[] }> {
  const res = await fetch(`/api/admin/student/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load student details');
  }

  const data = await res.json();
  return {
    student: data.student,
    activities: data.student.activities || [],
  };
}

// Admin: Delete student
export async function deleteStudent(studentId: string, token: string): Promise<boolean> {
  const res = await fetch(`/api/admin/student/${studentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.ok;
}

// Admin: Reset sample demo data
export async function resetDemoData(token: string): Promise<boolean> {
  const res = await fetch('/api/admin/reset-demo', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.ok;
}
