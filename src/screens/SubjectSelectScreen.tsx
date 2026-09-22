import React from 'react';
import { SubjectId, StudentClass, LanguageCode } from '../types';
import { BookOpen, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface SubjectSelectScreenProps {
  currentSubject: SubjectId;
  studentClass: StudentClass;
  language?: LanguageCode;
  onSelectSubject: (subject: SubjectId) => void;
  onBack: () => void;
}

interface SubjectCardInfo {
  id: SubjectId;
  title: string;
  subtitle: string;
  icon: string;
  tag: string;
  gradient: string;
  borderColor: string;
  topics: string[];
  activeLevels: number;
  available: boolean;
}

export const SubjectSelectScreen: React.FC<SubjectSelectScreenProps> = ({
  currentSubject,
  studentClass,
  language = 'en',
  onSelectSubject,
  onBack,
}) => {
  const t = (key: string) => getTranslation(key, language);

  const subjectsList: SubjectCardInfo[] = [
    {
      id: 'maths',
      title: t('subjects.maths'),
      subtitle: 'Full 50-Level Journey with Speed Drills & Formulas',
      icon: '🧮',
      tag: '50 Levels',
      gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
      borderColor: 'border-amber-500/50 hover:border-amber-400',
      topics: ['Numbers & Counting', 'Four Operations', 'Fractions & Decimals', 'Algebra & Geometry'],
      activeLevels: 50,
      available: true,
    },
    {
      id: 'social_science',
      title: t('subjects.social_science'),
      subtitle: 'SCERT / SEBA Chapter-wise Q&A & Quiz (সৌৰজগত, মানচিত্ৰ, জাপান, ভাৰত, হৰপ্পা)',
      icon: '📜',
      tag: 'Class 6 অসমীয়া',
      gradient: 'from-indigo-500/25 via-purple-500/15 to-transparent',
      borderColor: 'border-indigo-500/50 hover:border-indigo-400',
      topics: ['সৌৰজগতত আমাৰ পৃথিৱী', 'সময় মণ্ডল আৰু মানচিত্ৰ', 'জাপান', 'ভাৰতৰ ভূগোল', 'ভাৰতীয় সভ্যতা'],
      activeLevels: 50,
      available: true,
    },
    {
      id: 'english_grammar',
      title: t('subjects.english_grammar'),
      subtitle: 'Nouns, Verbs, Articles, Tenses & Punctuation',
      icon: '📝',
      tag: 'Interactive',
      gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-blue-500/50 hover:border-blue-400',
      topics: ['Articles (a, an, the)', 'Plurals & Pronouns', 'Tenses', 'Sentence Structure'],
      activeLevels: 50,
      available: true,
    },
    {
      id: 'english_speaking',
      title: t('subjects.english_speaking'),
      subtitle: 'Everyday Manners, Polite Phrases & Conversations',
      icon: '💬',
      tag: 'Fluency',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/50 hover:border-emerald-400',
      topics: ['Greetings & Farewells', 'Polite Words', 'Self Introductions', 'Everyday Phrases'],
      activeLevels: 50,
      available: true,
    },
    {
      id: 'science',
      title: t('subjects.science'),
      subtitle: 'Living Things, Human Body, Solar System & Nature',
      icon: '🔬',
      tag: 'Discovery',
      gradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
      borderColor: 'border-purple-500/50 hover:border-purple-400',
      topics: ['Plants & Photosynthesis', 'Human Organs', 'Planets & Earth', 'States of Matter'],
      activeLevels: 50,
      available: true,
    },
    {
      id: 'hindi',
      title: 'Hindi (हिंदी)',
      subtitle: 'Varnamala, Shabd Bodh & Kahaniya',
      icon: '🕉️',
      tag: 'Coming Soon',
      gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
      borderColor: 'border-rose-500/30 hover:border-rose-400/50',
      topics: ['स्वर और व्यंजन', 'मात्रा ज्ञान', 'सरल वाक्य'],
      activeLevels: 10,
      available: false,
    },
    {
      id: 'assamese',
      title: 'Assamese (অসমীয়া ভাষা)',
      subtitle: 'Bornomala, Juktakkhor & Sabda Sambhar',
      icon: '🪷',
      tag: 'Coming Soon',
      gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-teal-500/30 hover:border-teal-400/50',
      topics: ['স্বৰবৰ্ণ আৰু ব্যঞ্জনবৰ্ণ', 'যুক্তাক্ষৰ', 'শব্দ গঠন'],
      activeLevels: 10,
      available: false,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col p-4 sm:p-6 relative overflow-y-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full pt-1 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('result.home')}</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
          {t('home.class_label')}: {String(studentClass)}
        </span>
      </div>

      {/* Main Title */}
      <div className="text-center pb-5 max-w-lg mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>{t('subjects.title')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <span>{t('subjects.title')}</span>
          <Sparkles className="w-6 h-6 text-amber-400" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {t('subjects.subtitle')}
        </p>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-lg mx-auto w-full space-y-3 pb-12">
        {subjectsList.map((subj) => {
          const isSelected = currentSubject === subj.id;

          return (
            <div
              key={subj.id}
              onClick={() => {
                if (subj.available) {
                  onSelectSubject(subj.id);
                }
              }}
              className={`w-full p-4 rounded-2xl bg-gradient-to-r ${subj.gradient} bg-slate-900/90 border-2 ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                  : subj.borderColor
              } ${
                subj.available
                  ? 'cursor-pointer hover:scale-[1.01] active:scale-98 transition-all'
                  : 'opacity-70 cursor-not-allowed'
              } flex flex-col gap-3 group`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform shrink-0">
                    {subj.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors">
                        {subj.title}
                      </h3>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          subj.available
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {subj.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {subj.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : subj.available ? (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    →
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Soon
                  </span>
                )}
              </div>

              {/* Topics chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/80">
                {subj.topics.map((tp, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
                  >
                    {tp}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

