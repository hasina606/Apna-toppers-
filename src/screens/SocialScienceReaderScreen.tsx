import React, { useState } from 'react';
import { CLASS_6_SOCIAL_SCIENCE_CHAPTERS } from '../data/class6SocialScienceData';
import { LanguageCode, StudentClass } from '../types';
import { getTranslation } from '../utils/i18n';
import {
  BookOpen,
  ChevronLeft,
  Search,
  ChevronDown,
  ChevronUp,
  Play,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SocialScienceReaderScreenProps {
  language?: LanguageCode;
  studentClass?: StudentClass;
  onStartQuiz?: (chapterNumber?: number) => void;
  onStartChapterQuiz?: (chapterNumber: number) => void;
  onBack: () => void;
}

export const SocialScienceReaderScreen: React.FC<SocialScienceReaderScreenProps> = ({
  language = 'as',
  studentClass = 6,
  onStartQuiz,
  onStartChapterQuiz,
  onBack,
}) => {
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const t = (key: string) => getTranslation(key, language);

  const handleLaunchQuiz = (chapNum?: number) => {
    if (onStartQuiz) {
      onStartQuiz(chapNum);
    } else if (onStartChapterQuiz && chapNum) {
      onStartChapterQuiz(chapNum);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = (chapNumber: number) => {
    const chapter = CLASS_6_SOCIAL_SCIENCE_CHAPTERS.find((c) => c.chapterNumber === chapNumber);
    if (!chapter) return;
    const update: Record<string, boolean> = {};
    chapter.questions.forEach((q) => {
      update[q.id] = true;
    });
    setExpandedQuestions((prev) => ({ ...prev, ...update }));
  };

  // Filter chapters
  const filteredChapters = CLASS_6_SOCIAL_SCIENCE_CHAPTERS.filter((chap) => {
    if (selectedChapterNumber !== 'all' && chap.chapterNumber !== selectedChapterNumber) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-4 pt-3 pb-24 space-y-4 overflow-y-auto">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('result.home')}</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Class 6 • SCERT / SEBA</span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-2xl mr-2">📜</span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight inline">
              {t('social.reader_title')}
            </h1>
            <p className="text-xs text-indigo-200/80 mt-1">
              {t('social.reader_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('social.search_placeholder')}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white font-medium text-xs sm:text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Chapter Selection Pills */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>{t('social.chapter')}</span>
          <span className="text-[11px] text-indigo-400">8 Chapters</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          <button
            onClick={() => setSelectedChapterNumber('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedChapterNumber === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            {t('social.all_chapters')}
          </button>

          {CLASS_6_SOCIAL_SCIENCE_CHAPTERS.map((chap) => {
            const isSelected = selectedChapterNumber === chap.chapterNumber;
            return (
              <button
                key={chap.chapterNumber}
                onClick={() => setSelectedChapterNumber(chap.chapterNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
                }`}
              >
                <span>{chap.icon}</span>
                <span>
                  {chap.chapterNumber}. {chap.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapters & Questions List */}
      <div className="space-y-6 pt-1">
        {filteredChapters.map((chapter) => {
          // Filter questions by query
          const qMatches = chapter.questions.filter((q) => {
            if (!searchQuery.trim()) return true;
            const term = searchQuery.toLowerCase();
            return (
              q.question.toLowerCase().includes(term) ||
              q.answer.toLowerCase().includes(term)
            );
          });

          if (qMatches.length === 0) return null;

          return (
            <div
              key={chapter.chapterNumber}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-3.5 shadow-sm"
            >
              {/* Chapter Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
                    {chapter.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wide">
                      পাঠ {chapter.chapterNumber}
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                      {chapter.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {chapter.summary}
                    </p>
                  </div>
                </div>

                {/* Chapter Actions: Play Quiz & Expand */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => expandAll(chapter.chapterNumber)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 cursor-pointer"
                  >
                    {t('social.view_answer')}
                  </button>

                  <button
                    onClick={() => handleLaunchQuiz(chapter.chapterNumber)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{t('social.practice_quiz')}</span>
                  </button>
                </div>
              </div>

              {/* Questions Accordion */}
              <div className="space-y-2.5">
                {qMatches.map((q, idx) => {
                  const isExpanded = expandedQuestions[q.id];
                  return (
                    <div
                      key={q.id}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isExpanded
                          ? 'bg-slate-950/80 border-indigo-500/40 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpand(q.id)}
                        className="w-full text-left p-3 flex items-start justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-slate-100 leading-relaxed">
                            {q.question}
                          </span>
                        </div>
                        <div className="text-slate-400 hover:text-white shrink-0 mt-0.5">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-amber-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 bg-indigo-950/20">
                          <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-300 font-medium leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="space-y-1.5">
                              <span className="font-bold text-emerald-400 mr-1.5">উত্তৰ:</span>
                              <span className="text-slate-200">{q.answer}</span>
                              {q.options && q.options.length > 0 && (
                                <div className="pt-2 grid grid-cols-2 gap-1.5 text-[11px]">
                                  {q.options.map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className={`px-2 py-1 rounded-md border ${
                                        oIdx === q.correctOptionIndex
                                          ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 font-bold'
                                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                                      }`}
                                    >
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
