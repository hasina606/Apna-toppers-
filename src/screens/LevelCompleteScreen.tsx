import React, { useEffect } from 'react';
import { GameResult } from '../types';
import { Mascot } from '../components/Mascot';
import { soundEffects } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, RotateCcw, Home, Sparkles, Clock, CheckCircle, Zap } from 'lucide-react';

interface LevelCompleteScreenProps {
  result: GameResult;
  soundEnabled: boolean;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  result,
  soundEnabled,
  onNextLevel,
  onPlayAgain,
  onGoHome,
}) => {
  const isPassed = result.accuracy >= 70;

  useEffect(() => {
    if (isPassed) {
      soundEffects.playLevelComplete(soundEnabled);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'],
        });
      } catch {
        // ignore
      }
    }
  }, [isPassed, soundEnabled]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 select-none overflow-y-auto">
      {/* Top Banner */}
      <div className="text-center pt-2 max-w-sm mx-auto w-full z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{result.levelName}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isPassed ? 'LEVEL COMPLETE! 🏆' : 'GOOD EFFORT! 💪'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {isPassed
            ? 'Awesome problem solving! You are mastering Maths.'
            : 'Keep practicing! You need 70% to unlock the next level.'}
        </p>
      </div>

      {/* Center Trophy / Mascot Card */}
      <div className="max-w-sm mx-auto w-full my-auto py-4 z-10 space-y-4">
        {/* Mascot */}
        <div className="flex justify-center">
          <Mascot mood={isPassed ? 'celebrating' : 'encouraging'} size="lg" />
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              className={`w-8 h-8 transition-all ${
                i < result.starsEarned
                  ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-md'
                  : 'text-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="rounded-3xl p-5 bg-slate-900 border-2 border-slate-800 shadow-xl space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Score */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs font-bold text-slate-400">Score</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {result.correctAnswers} / {result.totalQuestions}
              </div>
            </div>

            {/* Accuracy */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="text-xs font-bold text-slate-400">Accuracy</div>
              <div
                className={`text-xl font-black font-mono mt-0.5 ${
                  result.accuracy >= 70 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {result.accuracy}%
              </div>
            </div>

            {/* XP Gained */}
            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="text-xs font-bold text-indigo-300">XP Earned</div>
              <div className="text-xl font-black text-indigo-300 font-mono mt-0.5">
                +{result.xpEarned} XP
              </div>
            </div>

            {/* Coins Gained */}
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30">
              <div className="text-xs font-bold text-amber-300">Coins</div>
              <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                +{result.coinsEarned} 🪙
              </div>
            </div>
          </div>

          {/* Time spent */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-2 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Time Spent
            </span>
            <span className="font-mono text-slate-200">
              {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
            </span>
          </div>
        </div>

        {/* Level Unlock Notification if passed and next level exists */}
        {isPassed && result.newLevelUnlocked && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border-2 border-emerald-500/50 text-center animate-pulse">
            <div className="text-sm font-black text-emerald-300 flex items-center justify-center gap-1.5">
              <span>🎉</span>
              <span>NEW LEVEL UNLOCKED!</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Level {result.newLevelUnlocked} is now ready to play!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="max-w-sm mx-auto w-full z-10 space-y-2.5 pb-2">
        {isPassed && result.levelId < 50 ? (
          <button
            onClick={onNextLevel}
            id="btn-next-level"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>NEXT LEVEL</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        ) : null}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onPlayAgain}
            className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-black text-slate-200 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onGoHome}
            className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-black text-slate-200 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>HOME</span>
          </button>
        </div>
      </div>
    </div>
  );
};
