import React, { useState } from 'react';
import { StudentClass } from '../types';
import { Sparkles, ArrowLeft, GraduationCap } from 'lucide-react';

interface ClassSelectScreenProps {
  username: string;
  selectedClass?: StudentClass;
  onSelectClass: (grade: StudentClass) => void;
  onBack?: () => void;
}

interface ClassOption {
  grade: StudentClass;
  title: string;
  category: 'pre' | 'primary' | 'middle' | 'secondary';
  topicsSummary: string;
  gradient: string;
  borderColor: string;
  icon: string;
  tag: string;
}

const ALL_CLASS_OPTIONS: ClassOption[] = [
  // PRE-PRIMARY
  {
    grade: 'Nursery',
    title: 'NURSERY',
    category: 'pre',
    topicsSummary: 'Object Counting (🍎🍎🍎), Big vs Small & Fun Shapes',
    gradient: 'from-pink-500/20 via-pink-600/10 to-transparent',
    borderColor: 'border-pink-500/50 hover:border-pink-400',
    icon: '🧸',
    tag: 'Age 3-4',
  },
  {
    grade: 'LKG',
    title: 'LKG (Lower KG)',
    category: 'pre',
    topicsSummary: 'Numbers 1-10, Picture Addition & Number Sequences',
    gradient: 'from-fuchsia-500/20 via-fuchsia-600/10 to-transparent',
    borderColor: 'border-fuchsia-500/50 hover:border-fuchsia-400',
    icon: '🐣',
    tag: 'Age 4-5',
  },
  {
    grade: 'UKG',
    title: 'UKG (Upper KG)',
    category: 'pre',
    topicsSummary: 'Single-digit Addition, Subtraction & Shape Corners',
    gradient: 'from-purple-500/20 via-purple-600/10 to-transparent',
    borderColor: 'border-purple-500/50 hover:border-purple-400',
    icon: '🎈',
    tag: 'Age 5-6',
  },

  // PRIMARY 1 - 5
  {
    grade: 1,
    title: 'CLASS 1',
    category: 'primary',
    topicsSummary: 'Addition within 20, Subtraction & Number Names',
    gradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
    borderColor: 'border-emerald-500/50 hover:border-emerald-400',
    icon: '🌱',
    tag: 'Age 6-7',
  },
  {
    grade: 2,
    title: 'CLASS 2',
    category: 'primary',
    topicsSummary: '2-Digit Addition/Subtraction & Times Tables 2-10',
    gradient: 'from-teal-500/20 via-teal-600/10 to-transparent',
    borderColor: 'border-teal-500/50 hover:border-teal-400',
    icon: '🌿',
    tag: 'Age 7-8',
  },
  {
    grade: 3,
    title: 'CLASS 3',
    category: 'primary',
    topicsSummary: '3-Digit Operations, Times Tables & Simple Word Stories',
    gradient: 'from-cyan-500/20 via-cyan-600/10 to-transparent',
    borderColor: 'border-cyan-500/50 hover:border-cyan-400',
    icon: '🚀',
    tag: 'Age 8-9',
  },
  {
    grade: 4,
    title: 'CLASS 4',
    category: 'primary',
    topicsSummary: 'Multi-digit Times, Division, Fractions & Decimals',
    gradient: 'from-sky-500/20 via-sky-600/10 to-transparent',
    borderColor: 'border-sky-500/50 hover:border-sky-400',
    icon: '⚡',
    tag: 'Age 9-10',
  },
  {
    grade: 5,
    title: 'CLASS 5',
    category: 'primary',
    topicsSummary: 'HCF, LCM, Percentages, Geometry Perimeter & Area',
    gradient: 'from-blue-500/20 via-blue-600/10 to-transparent',
    borderColor: 'border-blue-500/50 hover:border-blue-400',
    icon: '💎',
    tag: 'Age 10-11',
  },

  // MIDDLE 6 - 8
  {
    grade: 6,
    title: 'CLASS 6',
    category: 'middle',
    topicsSummary: 'Integers, Ratios, Basic Algebra & Angles',
    gradient: 'from-indigo-500/20 via-indigo-600/10 to-transparent',
    borderColor: 'border-indigo-500/50 hover:border-indigo-400',
    icon: '🔮',
    tag: 'Age 11-12',
  },
  {
    grade: 7,
    title: 'CLASS 7',
    category: 'middle',
    topicsSummary: 'Rational Numbers, Linear Equations, Profit & Loss',
    gradient: 'from-violet-500/20 via-violet-600/10 to-transparent',
    borderColor: 'border-violet-500/50 hover:border-violet-400',
    icon: '⚔️',
    tag: 'Age 12-13',
  },
  {
    grade: 8,
    title: 'CLASS 8',
    category: 'middle',
    topicsSummary: 'Exponents, Powers, Factorisation & Mensuration',
    gradient: 'from-amber-500/20 via-amber-600/10 to-transparent',
    borderColor: 'border-amber-500/50 hover:border-amber-400',
    icon: '🛡️',
    tag: 'Age 13-14',
  },

  // SECONDARY 9 - 10
  {
    grade: 9,
    title: 'CLASS 9',
    category: 'secondary',
    topicsSummary: 'Polynomials, Coordinate Geometry & Pythagorean Theorem',
    gradient: 'from-orange-500/20 via-orange-600/10 to-transparent',
    borderColor: 'border-orange-500/50 hover:border-orange-400',
    icon: '🎯',
    tag: 'Age 14-15',
  },
  {
    grade: 10,
    title: 'CLASS 10',
    category: 'secondary',
    topicsSummary: 'Quadratic Equations, AP, Trigonometry & Board Prep',
    gradient: 'from-rose-500/20 via-rose-600/10 to-transparent',
    borderColor: 'border-rose-500/50 hover:border-rose-400',
    icon: '👑',
    tag: 'Board Hero',
  },
];

export const ClassSelectScreen: React.FC<ClassSelectScreenProps> = ({
  username,
  selectedClass,
  onSelectClass,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pre' | 'primary' | 'middle' | 'secondary'>('all');

  const filteredOptions = activeTab === 'all'
    ? ALL_CLASS_OPTIONS
    : ALL_CLASS_OPTIONS.filter((opt) => opt.category === activeTab);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col p-4 sm:p-6 relative overflow-y-auto">
      {/* Back button if available */}
      {onBack && (
        <button
          onClick={onBack}
          className="self-start mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}

      {/* Header */}
      <div className="text-center pt-2 pb-4 z-10 max-w-lg mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Hello, {username || 'Hero'}!</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <GraduationCap className="w-7 h-7 text-amber-400" />
          <span>Choose Your Class</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          From Nursery to Class 10 — questions adapt automatically to your level!
        </p>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 mt-4 overflow-x-auto py-1 px-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
          {[
            { id: 'all', label: 'All (13)' },
            { id: 'pre', label: 'Nursery-UKG' },
            { id: 'primary', label: 'Class 1-5' },
            { id: 'middle', label: 'Class 6-8' },
            { id: 'secondary', label: 'Class 9-10' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Class Option Cards */}
      <div className="max-w-lg mx-auto w-full space-y-2.5 z-10 pb-10">
        {filteredOptions.map((opt) => {
          const isSelected = String(selectedClass) === String(opt.grade);

          return (
            <button
              key={String(opt.grade)}
              onClick={() => onSelectClass(opt.grade)}
              className={`w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r ${opt.gradient} bg-slate-900/90 border-2 ${
                isSelected ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg bg-amber-950/20' : opt.borderColor
              } transition-all active:scale-98 cursor-pointer flex items-center justify-between gap-3 text-left group`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform shrink-0">
                  {opt.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors">
                      {opt.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                      {opt.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 font-medium">
                    {opt.topicsSummary}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shrink-0">
                →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
