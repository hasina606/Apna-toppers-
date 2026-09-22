import React from 'react';
import { StudentProfile, MathTopic, Difficulty } from '../types';
import { BarChart3, TrendingUp, Target, Award, Play, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';

interface ProgressScreenProps {
  profile: StudentProfile;
  onPracticeTopic: (topic: MathTopic, difficulty: Difficulty) => void;
  onBack: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  profile,
  onPracticeTopic,
  onBack,
}) => {
  const overallAccuracy =
    profile.totalQuestionsSolved > 0
      ? Math.round((profile.totalCorrectAnswers / profile.totalQuestionsSolved) * 100)
      : 0;

  // Find lowest accuracy topic for recommendations
  const topicEntries = Object.entries(profile.topicStats);
  let recommendedTopic: MathTopic = 'division';
  let minAcc = 100;

  if (topicEntries.length > 0) {
    for (const [topic, stat] of topicEntries) {
      if (stat.total >= 3) {
        const acc = (stat.correct / stat.total) * 100;
        if (acc < minAcc) {
          minAcc = acc;
          recommendedTopic = topic as MathTopic;
        }
      }
    }
  }

  const topicNameMap: Record<string, string> = {
    addition: 'Addition ➕',
    subtraction: 'Subtraction ➖',
    multiplication: 'Multiplication ✖️',
    division: 'Division ➗',
    tables: 'Times Tables 📊',
    fractions: 'Fractions 🥧',
    decimals: 'Decimals 🎯',
    integers: 'Integers 📈',
    percentage: 'Percentage 🏷️',
    algebra: 'Algebra 🧩',
    geometry: 'Geometry 📐',
    word_problems: 'Word Problems 📖',
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-24 space-y-4 overflow-y-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-bold text-slate-400">Class {profile.class}</span>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Maths Progress & Analytics 📊
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          See your growth, strengths, and smart learning recommendations.
        </p>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Solved */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400">Questions Solved</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {profile.totalQuestionsSolved}
          </div>
          <div className="text-[11px] font-semibold text-emerald-400 mt-1">
            {profile.totalCorrectAnswers} Correct
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="text-xs font-bold text-slate-400">Overall Accuracy</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {overallAccuracy}%
          </div>
          <div className="text-[11px] font-semibold text-indigo-400 mt-1">
            Current Level {profile.currentLevel}
          </div>
        </div>
      </div>

      {/* Recommended Practice Section */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border-2 border-amber-500/40 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Recommended For You</span>
        </div>
        <h3 className="text-base font-black text-white">
          Boost your {topicNameMap[recommendedTopic] || recommendedTopic}
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Daily practice in this area will unlock your next level badge faster!
        </p>
        <button
          onClick={() => onPracticeTopic(recommendedTopic, 'easy')}
          className="mt-3 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shadow-amber-500/20"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950 stroke-slate-950" />
          <span>PRACTICE {recommendedTopic.toUpperCase()} NOW</span>
        </button>
      </div>

      {/* Difficulty Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-black text-slate-300 uppercase tracking-wider">
          Difficulty Mastery
        </div>
        <div className="space-y-2.5">
          {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((diff) => {
            const stat = profile.difficultyStats[diff] || { total: 0, correct: 0 };
            const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;

            const colorMap = {
              easy: 'bg-emerald-500',
              medium: 'bg-amber-500',
              hard: 'bg-rose-500',
              expert: 'bg-purple-500',
            };

            return (
              <div key={diff} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="capitalize text-slate-300">{diff}</span>
                  <span className="font-mono text-slate-400">
                    {stat.correct}/{stat.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full ${colorMap[diff]} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Stats Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-black text-slate-300 uppercase tracking-wider">
          Topic Breakdown
        </div>
        {topicEntries.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            No topic data yet. Play a level or practice to see your strengths!
          </p>
        ) : (
          <div className="space-y-3">
            {topicEntries.map(([topic, stat]) => {
              const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <div key={topic} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">
                      {topicNameMap[topic] || topic}
                    </span>
                    <span className="font-mono text-slate-400">
                      {stat.correct}/{stat.total} ({acc}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${acc}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
