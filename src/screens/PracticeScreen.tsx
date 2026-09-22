import React, { useState } from 'react';
import { StudentClass, MathTopic, Difficulty } from '../types';
import { BookOpen, Play, ChevronLeft, Sparkles, Check } from 'lucide-react';

interface PracticeScreenProps {
  studentClass: StudentClass;
  onStartPractice: (topic: MathTopic | 'mixed', difficulty: Difficulty) => void;
  onBack: () => void;
}

interface TopicCard {
  id: MathTopic | 'mixed';
  title: string;
  icon: string;
  desc: string;
}

const TOPICS_FOR_STUDENTS: TopicCard[] = [
  { id: 'mixed', title: 'Mixed Topics', icon: '🎲', desc: 'Random mix from your class syllabus' },
  { id: 'addition', title: 'Addition', icon: '➕', desc: 'Single, double & carrying additions' },
  { id: 'subtraction', title: 'Subtraction', icon: '➖', desc: 'Regrouping & quick mental subtractions' },
  { id: 'multiplication', title: 'Multiplication', icon: '✖️', desc: 'Times tables, grouping & multi-digits' },
  { id: 'division', title: 'Division', icon: '➗', desc: 'Even sharing, quotient & mental division' },
  { id: 'tables', title: 'Times Tables', icon: '📊', desc: 'Fast recall of times tables 2 to 20' },
  { id: 'fractions', title: 'Fractions', icon: '🥧', desc: 'Halves, quarters, addition & simplification' },
  { id: 'decimals', title: 'Decimals', icon: '🎯', desc: 'Point calculations, decimals & money math' },
  { id: 'integers', title: 'Integers', icon: '📈', desc: 'Negative numbers, signs and operations' },
  { id: 'percentage', title: 'Percentage', icon: '🏷️', desc: 'Discounts, parts of 100 & simple rates' },
  { id: 'algebra', title: 'Algebra', icon: '🧩', desc: 'Finding unknown x and simple linear equations' },
  { id: 'geometry', title: 'Geometry', icon: '📐', desc: 'Perimeter, area of squares and rectangles' },
  { id: 'word_problems', title: 'Word Problems', icon: '📖', desc: 'Real life stories with pencils, money & items' },
];

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  studentClass,
  onStartPractice,
  onBack,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<MathTopic | 'mixed'>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

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

        <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Sparkles className="w-3 h-3" />
          <span>No Timer • Unlimited Lives</span>
        </div>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Practice Zone 📚
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Pick any topic to learn at your own pace without pressure.
        </p>
      </div>

      {/* Difficulty Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Choose Difficulty
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`py-2 px-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                difficulty === d
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Selection Grid */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Select Math Topic
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TOPICS_FOR_STUDENTS.map((t) => {
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`p-3 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <div className="text-xs font-black text-white">{t.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{t.desc}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2 sticky bottom-20 z-10">
        <button
          onClick={() => onStartPractice(selectedTopic, difficulty)}
          id="btn-start-practice"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/40"
        >
          <Play className="w-5 h-5 fill-slate-950 stroke-slate-950" />
          <span>START PRACTICE SESSION</span>
        </button>
      </div>
    </div>
  );
};
