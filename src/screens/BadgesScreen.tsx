import React from 'react';
import { StudentProfile, Badge } from '../types';
import { Award, Lock, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface BadgesScreenProps {
  profile: StudentProfile;
  onBack: () => void;
}

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ profile, onBack }) => {
  const unlockedCount = profile.badges.filter((b) => b.unlocked).length;

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-24 space-y-4 overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {unlockedCount} of {profile.badges.length} Unlocked
          </span>
        </div>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Math Hero Badges 🏅
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Unlock medals by practicing regularly, solving fast, and conquering levels.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {profile.badges.map((badge) => {
          const progressPercent = Math.min(
            Math.round((badge.progress / badge.maxProgress) * 100),
            100
          );

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border-2 transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border-amber-400/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    badge.unlocked
                      ? 'bg-amber-400/20 border border-amber-400/40 text-amber-300 scale-105'
                      : 'bg-slate-800 border border-slate-700 text-slate-500 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-white">
                      {badge.title}
                    </span>
                    {badge.unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="pt-1 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Progress</span>
                      <span>
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          badge.unlocked ? 'bg-amber-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
