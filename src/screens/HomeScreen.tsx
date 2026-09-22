import React from 'react';
import { StudentProfile, ScreenType, SubjectId } from '../types';
import { Mascot } from '../components/Mascot';
import { GAME_LEVELS } from '../utils/mathEngine';
import { getTranslation } from '../utils/i18n';
import {
  Play,
  BookOpen,
  ChevronRight,
  Zap,
  Star,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface HomeScreenProps {
  profile: StudentProfile;
  onNavigate: (screen: ScreenType) => void;
  onStartLevel: (levelId: number) => void;
  onStartDailyChallenge: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onNavigate,
  onStartLevel,
  onStartDailyChallenge,
}) => {
  const t = (key: string) => getTranslation(key, profile.language);

  // Subject details
  const getSubjectLabel = (s: SubjectId = 'maths') => {
    switch (s) {
      case 'social_science':
      case 'social':
        return { name: t('subjects.social_science'), icon: '📜', color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30' };
      case 'english_grammar':
        return { name: t('subjects.english_grammar'), icon: '📝', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' };
      case 'english_speaking':
        return { name: t('subjects.english_speaking'), icon: '💬', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' };
      case 'science':
        return { name: t('subjects.science'), icon: '🔬', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30' };
      default:
        return { name: t('subjects.maths'), icon: '🧮', color: 'text-amber-400 bg-amber-500/20 border-amber-400/30' };
    }
  };

  const subjectInfo = getSubjectLabel(profile.currentSubject);

  // XP Progress in current level threshold (100 XP per rank)
  const xpInCurrentBracket = profile.xp % 100;
  const xpNeeded = 100;
  const xpProgressPercent = Math.min(Math.round((xpInCurrentBracket / xpNeeded) * 100), 100);

  // Overall accuracy
  const overallAccuracy =
    profile.totalQuestionsSolved > 0
      ? Math.round((profile.totalCorrectAnswers / profile.totalQuestionsSolved) * 100)
      : 0;

  // Check if daily challenge was done today
  const today = new Date().toISOString().split('T')[0];
  const isDailyDone = profile.dailyChallengeCompletedDate === today;

  return (
    <div className="flex-1 w-full max-w-lg mx-auto px-4 pt-2 pb-24 space-y-3.5 overflow-y-auto">
      {/* Top Quick Switcher Bar: Class & Subject Selector */}
      <div className="flex items-center justify-between gap-2">
        {/* Class Badge & Switcher */}
        <button
          onClick={() => onNavigate('class_select')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm group"
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>
            {t('home.class_label')}: <strong className="text-amber-300">{String(profile.class)}</strong>
          </span>
          <ChevronRight className="w-3 h-3 text-slate-500" />
        </button>

        {/* Subject Badge & Switcher */}
        <button
          onClick={() => onNavigate('subjects')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${subjectInfo.color} hover:brightness-110`}
        >
          <span>{subjectInfo.icon}</span>
          <span className="max-w-[140px] truncate">{subjectInfo.name}</span>
          <ChevronRight className="w-3 h-3 opacity-60" />
        </button>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-indigo-900/80 via-slate-900 to-purple-950/80 border-2 border-indigo-500/40 shadow-xl overflow-hidden">
        {/* Glowing background shapes */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-500/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-400/30">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>50 PROGRESSIVE LEVELS</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {t('home.welcome_back')}, {profile.username || 'Hero'}!
            </h2>
            <p className="text-xs text-indigo-200/90 font-medium">
              {t('header.class')} {String(profile.class)} • {t('header.level')} {profile.currentLevel} / 50
            </p>
          </div>

          <div className="shrink-0 -mr-1">
            <Mascot mood="cheering" size="md" />
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4 pt-3 border-t border-indigo-500/20 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
            <span className="flex items-center gap-1 text-amber-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              XP
            </span>
            <span className="font-mono text-white">
              {xpInCurrentBracket} / {xpNeeded} XP
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950/70 border border-slate-700/60 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(xpProgressPercent, 6)}%` }}
            />
          </div>
        </div>

        {/* Big Quick Start Play Button */}
        <button
          onClick={() => onStartLevel(profile.currentLevel)}
          id="btn-play-current-level"
          className="mt-4 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/40"
        >
          <Play className="w-5 h-5 fill-slate-950 stroke-slate-950" />
          <span>
            {t('home.continue_level')} {profile.currentLevel}
          </span>
        </button>
      </div>

      {/* Featured Card: Class 6 Social Science Q&A (Assamese) */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-2 border-indigo-500/40 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-2xl shrink-0">
              📜
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-sm text-white">
                  {t('home.social_science_title')}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SCERT / SEBA
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                {t('home.social_science_desc')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ৮টা অধ্যায় • সম্পূৰ্ণ প্ৰশ্নোত্তৰ
          </span>

          <button
            onClick={() => onNavigate('social_qa_reader')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/30 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{t('home.social_science_btn')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Action Buttons: Play Game, Practice Mode */}
      <div className="grid grid-cols-2 gap-3">
        {/* Choose Level / 50 Levels */}
        <button
          onClick={() => onNavigate('level_select')}
          id="btn-choose-level"
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all text-left group cursor-pointer active:scale-98 shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
            🎮
          </div>
          <div className="font-black text-sm text-white group-hover:text-blue-300 transition-colors">
            {t('home.all_levels')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {profile.unlockedLevels.length}/50 {t('badges.unlocked')}
          </div>
        </button>

        {/* Practice Mode */}
        <button
          onClick={() => onNavigate('practice')}
          id="btn-practice-mode"
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all text-left group cursor-pointer active:scale-98 shadow-md"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
            📚
          </div>
          <div className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
            {t('home.practice_zone')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {t('home.practice_desc')}
          </div>
        </button>
      </div>

      {/* Daily Challenge Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white">
                  {t('home.daily_challenge')}
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  +100 XP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isDailyDone ? t('home.daily_completed') : t('home.daily_desc')}
              </p>
            </div>
          </div>

          <button
            onClick={onStartDailyChallenge}
            disabled={isDailyDone}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              isDailyDone
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
            }`}
          >
            {isDailyDone ? 'Done ✓' : t('home.play_daily')}
          </button>
        </div>
      </div>

      {/* Quick Summary Grid (My Progress, Leaderboard, Badges) */}
      <div className="space-y-2 pt-1">
        <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
          {t('home.quick_stats')}
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Progress */}
          <button
            onClick={() => onNavigate('progress')}
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-lg mb-1 group-hover:scale-110 transition-transform">📊</div>
            <div className="text-xs font-bold text-white">{t('nav.progress')}</div>
            <div className="text-[10px] font-semibold text-emerald-400 mt-0.5">
              {overallAccuracy}% {t('home.accuracy')}
            </div>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => onNavigate('leaderboard')}
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-lg mb-1 group-hover:scale-110 transition-transform">🏆</div>
            <div className="text-xs font-bold text-white">{t('leaderboard.rank')}</div>
            <div className="text-[10px] font-semibold text-amber-300 mt-0.5">
              #12
            </div>
          </button>

          {/* Badges */}
          <button
            onClick={() => onNavigate('badges')}
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="text-lg mb-1 group-hover:scale-110 transition-transform">🏅</div>
            <div className="text-xs font-bold text-white">{t('nav.badges')}</div>
            <div className="text-[10px] font-semibold text-purple-300 mt-0.5">
              {profile.badges.filter((b) => b.unlocked).length} / {profile.badges.length}
            </div>
          </button>
        </div>
      </div>

      {/* Admin Portal Quick Access */}
      <div className="pt-1">
        <button
          onClick={() => onNavigate('admin')}
          className="w-full py-2.5 px-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 text-xs font-bold transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🔐</span>
            <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white">
              Admin Portal • এডমিন পেনেল (Student & Score Monitor)
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Open
          </span>
        </button>
      </div>
    </div>
  );
};

