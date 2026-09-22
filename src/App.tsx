import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  ScreenType,
  StudentClass,
  MathTopic,
  Difficulty,
  Question,
  GameResult,
  SubjectId,
} from './types';
import {
  loadStudentProfile,
  saveStudentProfile,
  getInitialStudentProfile,
  recordGameResult,
  clearStudentProfile,
} from './utils/storage';
import {
  GAME_LEVELS,
  generateQuestionsForLevel,
  generateQuestionForSubjectAndStudent,
} from './utils/mathEngine';
import { soundEffects } from './utils/audio';

import { SplashScreen } from './screens/SplashScreen';
import { UsernameScreen } from './screens/UsernameScreen';
import { ClassSelectScreen } from './screens/ClassSelectScreen';
import { SubjectSelectScreen } from './screens/SubjectSelectScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { LevelCompleteScreen } from './screens/LevelCompleteScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { BadgesScreen } from './screens/BadgesScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SocialScienceReaderScreen } from './screens/SocialScienceReaderScreen';

import { HeaderBar } from './components/HeaderBar';
import { BottomNav } from './components/BottomNav';
import { AdminScreen } from './screens/AdminScreen';
import { syncStudentToServer, logGameActivityToServer } from './utils/adminService';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const loaded = loadStudentProfile();
    return loaded || getInitialStudentProfile();
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const loaded = loadStudentProfile();
    if (!loaded || !loaded.username) {
      return 'splash';
    }
    return 'home';
  });

  // Active game session state
  const [activeGameParams, setActiveGameParams] = useState<{
    levelId: number;
    levelName: string;
    difficulty: Difficulty;
    questions: Question[];
    isPracticeMode?: boolean;
    isDailyChallenge?: boolean;
  } | null>(null);

  const [lastGameResult, setLastGameResult] = useState<GameResult | null>(null);

  // Sync profile changes to localStorage and server
  useEffect(() => {
    if (profile.username) {
      saveStudentProfile(profile);
      syncStudentToServer(profile);
    }
  }, [profile]);

  // Onboarding: Splash -> Username
  const handleSplashStart = () => {
    soundEffects.playClick(profile.soundEnabled);
    setCurrentScreen('username');
  };

  // Onboarding: Username -> Class Select
  const handleUsernameNext = (username: string, avatarId: string) => {
    soundEffects.playClick(profile.soundEnabled);
    setProfile((prev) => ({
      ...prev,
      username,
      avatarId,
    }));
    setCurrentScreen('class_select');
  };

  // Onboarding: Class Select -> Home
  const handleClassSelect = (grade: StudentClass) => {
    soundEffects.playClick(profile.soundEnabled);
    const updated = {
      ...profile,
      class: grade,
    };
    setProfile(updated);
    saveStudentProfile(updated);
    setCurrentScreen('home');
  };

  // Subject Select -> Home
  const handleSelectSubject = (subj: SubjectId) => {
    soundEffects.playClick(profile.soundEnabled);
    const updated = {
      ...profile,
      currentSubject: subj,
    };
    setProfile(updated);
    saveStudentProfile(updated);
    setCurrentScreen('home');
  };

  // Start Social Science Chapter Quiz (Assamese)
  const handleStartSocialQuiz = (chapterId?: number) => {
    soundEffects.playClick(profile.soundEnabled);
    const questions: Question[] = [];
    const diffs: Difficulty[] = ['easy', 'medium', 'hard'];
    for (let i = 0; i < 10; i++) {
      const d = diffs[i % diffs.length];
      questions.push(generateQuestionForSubjectAndStudent('social_science', 6, d, chapterId));
    }

    const titlePrefix = chapterId ? `অধ্যায় ${chapterId}` : 'সমাজ বিজ্ঞান';
    setActiveGameParams({
      levelId: 0,
      levelName: `${titlePrefix} কুইজ (Quiz)`,
      difficulty: 'medium',
      questions,
      isPracticeMode: true,
      isDailyChallenge: false,
    });
    setCurrentScreen('gameplay');
  };

  // Start Level Gameplay (Supports 50 levels & multi-subject)
  const handleStartLevel = (levelId: number) => {
    soundEffects.playClick(profile.soundEnabled);
    const levelConfig = GAME_LEVELS.find((l) => l.id === levelId) || GAME_LEVELS[0];
    const questions = generateQuestionsForLevel(levelConfig, profile.class, profile.currentSubject || 'maths');

    setActiveGameParams({
      levelId: levelConfig.id,
      levelName: levelConfig.name,
      difficulty: levelConfig.difficulty,
      questions,
      isPracticeMode: false,
      isDailyChallenge: false,
    });
    setCurrentScreen('gameplay');
  };

  // Start Daily Challenge
  const handleStartDailyChallenge = () => {
    soundEffects.playClick(profile.soundEnabled);
    const questions: Question[] = [];
    const diffs: Difficulty[] = ['easy', 'medium', 'hard'];
    for (let i = 0; i < 10; i++) {
      const d = diffs[i % diffs.length];
      questions.push(generateQuestionForSubjectAndStudent(profile.currentSubject || 'maths', profile.class, d));
    }

    setActiveGameParams({
      levelId: 0,
      levelName: `Daily Challenge (${profile.currentSubject?.toUpperCase() || 'MATHS'})`,
      difficulty: 'medium',
      questions,
      isPracticeMode: false,
      isDailyChallenge: true,
    });
    setCurrentScreen('gameplay');
  };

  // Start Practice Mode
  const handleStartPractice = (topic: MathTopic | 'mixed', difficulty: Difficulty) => {
    soundEffects.playClick(profile.soundEnabled);
    const questions: Question[] = [];
    for (let i = 0; i < 10; i++) {
      questions.push(
        generateQuestionForSubjectAndStudent(
          profile.currentSubject || 'maths',
          profile.class,
          difficulty,
          topic === 'mixed' ? undefined : topic
        )
      );
    }

    setActiveGameParams({
      levelId: 0,
      levelName: `Practice: ${topic === 'mixed' ? 'Mixed Topics' : topic.toUpperCase()}`,
      difficulty,
      questions,
      isPracticeMode: true,
      isDailyChallenge: false,
    });
    setCurrentScreen('gameplay');
  };

  // Game completed handler
  const handleFinishGame = (
    result: GameResult,
    topicStats: Record<string, { total: number; correct: number }>
  ) => {
    const { updatedProfile, newLevelUnlocked } = recordGameResult(
      profile,
      result,
      topicStats
    );

    if (result.isDailyChallenge && result.accuracy >= 50) {
      updatedProfile.dailyChallengeCompletedDate = new Date().toISOString().split('T')[0];
      saveStudentProfile(updatedProfile);
    }

    setProfile(updatedProfile);

    const finalResultWithUnlock = {
      ...result,
      newLevelUnlocked,
    };
    setLastGameResult(finalResultWithUnlock);

    // Sync activity and updated stats to server for admin monitor
    logGameActivityToServer(updatedProfile, finalResultWithUnlock, profile.currentSubject || 'maths');
    syncStudentToServer(updatedProfile);

    setCurrentScreen('level_complete');
  };

  // Sound toggle helper
  const handleToggleSound = () => {
    const nextVal = !profile.soundEnabled;
    soundEffects.playClick(nextVal);
    setProfile((prev) => {
      const updated = { ...prev, soundEnabled: nextVal };
      saveStudentProfile(updated);
      return updated;
    });
  };

  // Profile update
  const handleUpdateProfile = (updatedFields: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updatedFields };
      saveStudentProfile(updated);
      return updated;
    });
  };

  // Reset progress
  const handleResetProgress = () => {
    clearStudentProfile();
    const fresh = getInitialStudentProfile();
    fresh.username = profile.username;
    fresh.class = profile.class;
    fresh.avatarId = profile.avatarId;
    fresh.currentSubject = profile.currentSubject || 'maths';
    fresh.language = profile.language || 'en';
    setProfile(fresh);
    saveStudentProfile(fresh);
    setCurrentScreen('home');
  };

  // Standard bottom navigation screens
  const isStandardScreen =
    ['home', 'practice', 'progress', 'badges', 'profile', 'level_select', 'leaderboard', 'subjects', 'social_qa_reader'].includes(
      currentScreen
    );

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Onboarding Flow: Splash */}
      {currentScreen === 'splash' && <SplashScreen onStart={handleSplashStart} />}

      {/* Onboarding Flow: Username */}
      {currentScreen === 'username' && (
        <UsernameScreen
          initialUsername={profile.username}
          initialAvatarId={profile.avatarId}
          onNext={handleUsernameNext}
        />
      )}

      {/* Onboarding / Switcher Flow: Class Selection (Nursery - Class 10) */}
      {currentScreen === 'class_select' && (
        <ClassSelectScreen
          username={profile.username}
          selectedClass={profile.class}
          onSelectClass={handleClassSelect}
          onBack={() => setCurrentScreen(profile.username ? 'home' : 'username')}
        />
      )}

      {/* Subject Selection Screen */}
      {currentScreen === 'subjects' && (
        <SubjectSelectScreen
          currentSubject={profile.currentSubject || 'maths'}
          studentClass={profile.class}
          language={profile.language}
          onSelectSubject={handleSelectSubject}
          onBack={() => setCurrentScreen('home')}
        />
      )}

      {/* Gameplay Screen (fullscreen immersive game mode) */}
      {currentScreen === 'gameplay' && activeGameParams && (
        <GameplayScreen
          levelId={activeGameParams.levelId}
          levelName={activeGameParams.levelName}
          difficulty={activeGameParams.difficulty}
          studentClass={profile.class}
          questions={activeGameParams.questions}
          soundEnabled={profile.soundEnabled}
          isPracticeMode={activeGameParams.isPracticeMode}
          isDailyChallenge={activeGameParams.isDailyChallenge}
          onFinishGame={handleFinishGame}
          onExit={() => setCurrentScreen('home')}
        />
      )}

      {/* Level Complete Celebration */}
      {currentScreen === 'level_complete' && lastGameResult && (
        <LevelCompleteScreen
          result={lastGameResult}
          soundEnabled={profile.soundEnabled}
          onNextLevel={() => {
            const nextLvl = lastGameResult.levelId + 1;
            if (nextLvl <= 50) {
              handleStartLevel(nextLvl);
            } else {
              setCurrentScreen('home');
            }
          }}
          onPlayAgain={() => {
            if (lastGameResult.levelId > 0) {
              handleStartLevel(lastGameResult.levelId);
            } else {
              setCurrentScreen('practice');
            }
          }}
          onGoHome={() => setCurrentScreen('home')}
        />
      )}

      {/* Main Application Shell with Header & Bottom Navigation */}
      {isStandardScreen && (
        <div className="flex-1 flex flex-col min-h-screen relative">
          <HeaderBar
            profile={profile}
            onOpenProfile={() => setCurrentScreen('profile')}
            onToggleSound={handleToggleSound}
            onSelectLanguage={(lang) => handleUpdateProfile({ language: lang })}
            onOpenAdmin={() => setCurrentScreen('admin')}
          />

          <main className="flex-1 flex flex-col">
            {currentScreen === 'home' && (
              <HomeScreen
                profile={profile}
                onNavigate={(s) => setCurrentScreen(s)}
                onStartLevel={handleStartLevel}
                onStartDailyChallenge={handleStartDailyChallenge}
              />
            )}

            {currentScreen === 'social_qa_reader' && (
              <SocialScienceReaderScreen
                studentClass={profile.class}
                language={profile.language}
                onBack={() => setCurrentScreen('home')}
                onStartQuiz={handleStartSocialQuiz}
              />
            )}

            {currentScreen === 'level_select' && (
              <LevelSelectScreen
                profile={profile}
                onSelectLevel={handleStartLevel}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'practice' && (
              <PracticeScreen
                studentClass={profile.class}
                onStartPractice={handleStartPractice}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'progress' && (
              <ProgressScreen
                profile={profile}
                onPracticeTopic={(topic, diff) => handleStartPractice(topic, diff)}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'badges' && (
              <BadgesScreen profile={profile} onBack={() => setCurrentScreen('home')} />
            )}

            {currentScreen === 'leaderboard' && (
              <LeaderboardScreen
                profile={profile}
                onBack={() => setCurrentScreen('home')}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onResetProgress={handleResetProgress}
                onBack={() => setCurrentScreen('home')}
                onOpenAdmin={() => setCurrentScreen('admin')}
              />
            )}
          </main>

          {/* Sticky Bottom Navigation Bar */}
          <BottomNav
            currentScreen={currentScreen}
            language={profile.language}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        </div>
      )}

      {/* Admin Screen (Full Screen Modal/Portal) */}
      {currentScreen === 'admin' && (
        <AdminScreen onBackToApp={() => setCurrentScreen('home')} />
      )}
    </div>
  );
}
