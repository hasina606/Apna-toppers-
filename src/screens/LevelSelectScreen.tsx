import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { GAME_LEVELS } from '../utils/mathEngine';
import { Lock, Star, ChevronLeft, Play, Sparkles, Trophy } from 'lucide-react';

interface LevelSelectScreenProps {
  profile: StudentProfile;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  profile,
  onSelectLevel,
  onBack,
}) => {
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return { label: 'EASY', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'medium':
        return { label: 'MEDIUM', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'hard':
        return { label: 'HARD', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'expert':
        return { label: 'EXPERT', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default:
        return { label: 'EASY', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  const unlockedCount = profile.unlockedLevels.length;
  const highestUnlocked = Math.max(...profile.unlockedLevels, 1);

  const filteredLevels = selectedTier === 'all'
    ? GAME_LEVELS
    : GAME_LEVELS.filter((lvl: any) => lvl.tier === selectedTier);

  return (
    <div className="flex-1 w-full max-w-lg mx-auto px-4 pt-3 pb-24 space-y-4 overflow-y-auto">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20">
            Class: {String(profile.class)}
          </span>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
            {unlockedCount}/50 Unlocked
          </span>
        </div>
      </div>

      {/* Screen Title & Progress Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 p-4 rounded-2xl border border-indigo-500/30">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3 h-3" />
              <span>50 Progressive Levels</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Curriculum Arena
            </h2>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Pass with 70%+ accuracy to unlock the next level!
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Level progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
            <span>Overall Milestone Progress</span>
            <span className="text-amber-300">{Math.round((unlockedCount / 50) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
        {[
          { id: 'all', label: 'All 50' },
          { id: 1, label: 'Tier 1 (1-10)' },
          { id: 2, label: 'Tier 2 (11-20)' },
          { id: 3, label: 'Tier 3 (21-30)' },
          { id: 4, label: 'Tier 4 (31-40)' },
          { id: 5, label: 'Tier 5 (41-50)' },
        ].map((tab) => (
          <button
            key={String(tab.id)}
            onClick={() => setSelectedTier(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTier === tab.id
                ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Level Cards List */}
      <div className="space-y-2.5">
        {filteredLevels.map((lvl: any) => {
          const isUnlocked = profile.unlockedLevels.includes(lvl.id);
          const highScore = profile.levelHighScores[lvl.id];
          const diffBadge = getDifficultyBadge(lvl.difficulty);

          return (
            <div
              key={lvl.id}
              className={`rounded-2xl p-3.5 sm:p-4 transition-all border-2 ${
                isUnlocked
                  ? 'bg-slate-900/95 border-slate-800 hover:border-indigo-500/60 shadow-md'
                  : 'bg-slate-950/60 border-slate-800/40 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg shrink-0">{lvl.icon || '🎯'}</span>
                    <span className="font-black text-sm text-white">
                      {lvl.name}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${diffBadge.color}`}
                    >
                      {diffBadge.label}
                    </span>
                    {lvl.tierName && (
                      <span className="text-[9px] font-semibold text-slate-400">
                        • {lvl.tierName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {lvl.description}
                  </p>

                  {/* Stars / High Score if played */}
                  {highScore && (
                    <div className="flex items-center gap-3 pt-1 text-[11px] font-bold">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < highScore.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-emerald-400 font-mono">
                        Best: {highScore.score}/10 ({highScore.accuracy}%)
                      </span>
                    </div>
                  )}

                  {/* Unlock Condition text if locked */}
                  {!isUnlocked && (
                    <p className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1 pt-0.5">
                      <Lock className="w-3 h-3" />
                      Score 70%+ on Level {lvl.id - 1} to unlock
                    </p>
                  )}
                </div>

                {/* Play button or lock icon */}
                <div className="shrink-0 self-center">
                  {isUnlocked ? (
                    <button
                      onClick={() => onSelectLevel(lvl.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950 stroke-slate-950" />
                      <span>PLAY</span>
                    </button>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
