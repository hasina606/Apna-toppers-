import { StudentProfile, Badge, GameResult, Difficulty } from '../types';

const STORAGE_KEY = 'topper_math_hero_student_profile_v1';

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'FIRST STEP',
    description: 'Complete your first 10 questions.',
    icon: '🏅',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'level_master',
    title: 'LEVEL MASTER',
    description: 'Complete any level with 70%+ accuracy.',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'perfect_score',
    title: 'PERFECT SCORE',
    description: 'Score 100% (10/10) in any game.',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'math_streak',
    title: 'STREAK STARTER',
    description: 'Build a practice streak of 3 sessions.',
    icon: '🔥',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
  },
  {
    id: 'speed_solver',
    title: 'SPEED SOLVER',
    description: 'Solve questions quickly with fast bonuses.',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'century_club',
    title: 'CENTURY CLUB',
    description: 'Earn 300 total XP.',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 300,
  },
  {
    id: 'level_10_hero',
    title: 'TIER 1 CONQUEROR',
    description: 'Complete Level 10 milestone.',
    icon: '🧮',
    unlocked: false,
    progress: 1,
    maxProgress: 10,
  },
  {
    id: 'level_25_champion',
    title: 'WARRIOR CHAMPION',
    description: 'Conquer Level 25 challenge.',
    icon: '⚔️',
    unlocked: false,
    progress: 1,
    maxProgress: 25,
  },
  {
    id: 'half_century_legend',
    title: '50 LEVELS LEGEND',
    description: 'Reach the ultimate Level 50 summit!',
    icon: '👑',
    unlocked: false,
    progress: 1,
    maxProgress: 50,
  },
  {
    id: 'coin_collector',
    title: 'COIN COLLECTOR',
    description: 'Gather 100 Gold Coins.',
    icon: '🪙',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
  },
];

export function getInitialStudentProfile(): StudentProfile {
  const today = new Date().toISOString().split('T')[0];
  return {
    username: '',
    class: 5,
    avatarId: 'hero_1',
    currentSubject: 'maths',
    language: 'en',
    darkMode: true,
    xp: 0,
    coins: 0,
    currentLevel: 1,
    unlockedLevels: [1], // Level 1 is always unlocked by default
    levelHighScores: {},
    streak: 1,
    lastActiveDate: today,
    totalQuestionsSolved: 0,
    totalCorrectAnswers: 0,
    difficultyStats: {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 },
      expert: { total: 0, correct: 0 },
    },
    topicStats: {},
    badges: DEFAULT_BADGES,
    soundEnabled: true,
  };
}

export function loadStudentProfile(): StudentProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const initial = getInitialStudentProfile();
    return {
      ...initial,
      ...parsed,
      currentSubject: parsed.currentSubject || 'maths',
      language: parsed.language || 'en',
      darkMode: parsed.darkMode !== undefined ? parsed.darkMode : true,
      unlockedLevels: parsed.unlockedLevels?.length ? parsed.unlockedLevels : [1],
      badges: initial.badges.map((b) => {
        const existing = parsed.badges?.find((eb: Badge) => eb.id === b.id);
        return existing || b;
      }),
    };
  } catch (err) {
    console.error('Failed to load profile:', err);
    return null;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function clearStudentProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear profile:', err);
  }
}

// Update profile after completing a game session
export function recordGameResult(
  current: StudentProfile,
  result: GameResult,
  topicResults: Record<string, { total: number; correct: number }>
): { updatedProfile: StudentProfile; newlyUnlockedBadges: Badge[]; newLevelUnlocked: number | null } {
  const updated = { ...current };

  // Update XP & Coins
  updated.xp += result.xpEarned;
  updated.coins += result.coinsEarned;

  // Update Questions & Totals
  updated.totalQuestionsSolved += result.totalQuestions;
  updated.totalCorrectAnswers += result.correctAnswers;

  // Update Difficulty Stats
  const diff = result.difficulty;
  if (!updated.difficultyStats[diff]) {
    updated.difficultyStats[diff] = { total: 0, correct: 0 };
  }
  updated.difficultyStats[diff].total += result.totalQuestions;
  updated.difficultyStats[diff].correct += result.correctAnswers;

  // Update Topic Stats
  for (const [topic, stats] of Object.entries(topicResults)) {
    if (!updated.topicStats[topic]) {
      updated.topicStats[topic] = { total: 0, correct: 0 };
    }
    updated.topicStats[topic].total += stats.total;
    updated.topicStats[topic].correct += stats.correct;
  }

  // Update Level High Scores
  const prevHighScore = updated.levelHighScores[result.levelId];
  if (!prevHighScore || result.accuracy > prevHighScore.accuracy) {
    updated.levelHighScores[result.levelId] = {
      score: result.correctAnswers,
      accuracy: result.accuracy,
      stars: result.starsEarned,
    };
  }

  // Check Level Unlocking up to 50 Levels
  let newLevelUnlocked: number | null = null;
  const nextLevel = result.levelId + 1;
  if (result.accuracy >= 70 && nextLevel <= 50 && !updated.unlockedLevels.includes(nextLevel)) {
    updated.unlockedLevels.push(nextLevel);
    updated.unlockedLevels.sort((a, b) => a - b);
    newLevelUnlocked = nextLevel;
    if (nextLevel > updated.currentLevel) {
      updated.currentLevel = nextLevel;
    }
  }

  // Update Streak logic
  const today = new Date().toISOString().split('T')[0];
  if (updated.lastActiveDate !== today) {
    // Check if consecutive day
    const lastDate = new Date(updated.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      updated.streak += 1;
    } else if (diffDays > 1) {
      updated.streak = 1;
    }
    updated.lastActiveDate = today;
  }

  // Check Badges
  const newlyUnlockedBadges: Badge[] = [];
  updated.badges = updated.badges.map((badge) => {
    if (badge.unlocked) return badge;
    const b = { ...badge };

    if (b.id === 'first_step') {
      b.progress = Math.min(updated.totalQuestionsSolved, b.maxProgress);
      if (b.progress >= b.maxProgress) {
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'level_master') {
      if (result.accuracy >= 70) {
        b.progress = 1;
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'perfect_score') {
      if (result.accuracy === 100 && result.totalQuestions >= 10) {
        b.progress = 1;
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'math_streak') {
      b.progress = Math.min(updated.streak, b.maxProgress);
      if (b.progress >= b.maxProgress) {
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'speed_solver') {
      if (result.totalQuestions >= 10 && result.timeSpentSeconds / result.totalQuestions <= 7 && result.accuracy >= 70) {
        b.progress = 1;
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'century_club') {
      b.progress = Math.min(updated.xp, b.maxProgress);
      if (b.progress >= b.maxProgress) {
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'coin_collector') {
      b.progress = Math.min(updated.coins, b.maxProgress);
      if (b.progress >= b.maxProgress) {
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'level_10_hero') {
      const maxUnlocked = Math.max(...updated.unlockedLevels, 1);
      b.progress = Math.min(maxUnlocked, 10);
      if (maxUnlocked >= 10) {
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'level_25_champion') {
      const maxUnlocked = Math.max(...updated.unlockedLevels, 1);
      b.progress = Math.min(maxUnlocked, 25);
      if (maxUnlocked >= 25) {
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    } else if (b.id === 'half_century_legend') {
      const maxUnlocked = Math.max(...updated.unlockedLevels, 1);
      b.progress = Math.min(maxUnlocked, 50);
      if (maxUnlocked >= 50) {
        b.unlocked = true;
        b.unlockedAt = Date.now();
        newlyUnlockedBadges.push(b);
      }
    }
    return b;
  });

  saveStudentProfile(updated);
  return { updatedProfile: updated, newlyUnlockedBadges, newLevelUnlocked };
}
