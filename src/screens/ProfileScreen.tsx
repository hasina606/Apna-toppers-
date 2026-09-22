import React, { useState } from 'react';
import { StudentProfile, StudentClass, SubjectId, LanguageCode } from '../types';
import { AVATAR_LIST } from '../components/Mascot';
import { Volume2, VolumeX, RotateCcw, Save, Check, User, ChevronLeft, Globe, BookOpen, Trophy, Shield, ChevronRight } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface ProfileScreenProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onResetProgress: () => void;
  onBack: () => void;
  onOpenAdmin?: () => void;
}

const ALL_GRADES: StudentClass[] = [
  'Nursery', 'LKG', 'UKG', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
];

const SUBJECTS_OPTIONS: { id: SubjectId; labelKey: string; icon: string }[] = [
  { id: 'maths', labelKey: 'subjects.maths', icon: '🧮' },
  { id: 'social_science', labelKey: 'subjects.social_science', icon: '📜' },
  { id: 'english_grammar', labelKey: 'subjects.english_grammar', icon: '📝' },
  { id: 'english_speaking', labelKey: 'subjects.english_speaking', icon: '💬' },
  { id: 'science', labelKey: 'subjects.science', icon: '🔬' },
];

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'as', label: 'অসমীয়া (Assamese)', flag: '🪷' },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onResetProgress,
  onBack,
  onOpenAdmin,
}) => {
  const [username, setUsername] = useState(profile.username);
  const [selectedClass, setSelectedClass] = useState<StudentClass>(profile.class);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(profile.currentSubject || 'maths');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(profile.language || 'en');
  const [avatarId, setAvatarId] = useState(profile.avatarId);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const t = (key: string) => getTranslation(key, selectedLanguage);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim() || 'Math Hero';
    onUpdateProfile({
      username: trimmed,
      class: selectedClass,
      currentSubject: selectedSubject,
      language: selectedLanguage,
      avatarId,
      soundEnabled,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };


  return (
    <div className="flex-1 w-full max-w-lg mx-auto px-4 pt-3 pb-24 space-y-4 overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{profile.unlockedLevels.length}/50 Levels Unlocked</span>
        </div>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Hero Profile ⚙️
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Customize your student details, school class (Nursery to 10), subject, and language.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-3.5">
        {/* Avatar Picker */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Choose Your Avatar
          </label>
          <div className="flex items-center justify-around gap-2 pt-1 flex-wrap">
            {AVATAR_LIST.map((av) => (
              <button
                type="button"
                key={av.id}
                onClick={() => setAvatarId(av.id)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg bg-gradient-to-tr ${av.color} transition-all cursor-pointer ${
                  avatarId === av.id
                    ? 'ring-3 ring-amber-400 scale-110 shadow-md shadow-amber-400/25'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                {av.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Username Input */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              placeholder="Your student name"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* School Class Selection (Nursery to 10) */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Class / Grade (Nursery to 10)
            </label>
            <span className="text-xs font-extrabold text-amber-400">
              Selected: {String(selectedClass)}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-1">
            {ALL_GRADES.map((c) => {
              const isSelected = String(selectedClass) === String(c);
              return (
                <button
                  type="button"
                  key={String(c)}
                  onClick={() => setSelectedClass(c)}
                  className={`py-2 px-1 rounded-xl font-black text-xs transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {typeof c === 'number' ? `Class ${c}` : c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Subject Selector */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Active Learning Subject</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUBJECTS_OPTIONS.map((subj) => {
              const isSelected = selectedSubject === subj.id;
              return (
                <button
                  type="button"
                  key={subj.id}
                  onClick={() => setSelectedSubject(subj.id)}
                  className={`py-2 px-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{subj.icon}</span>
                  <span className="truncate">{t(subj.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* App Language Selector (English / Hindi / Assamese) */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Application Language (भाषा / ভাষা)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`py-2 px-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
            <div>
              <div className="text-xs font-bold text-white">Sound Effects & Jingles</div>
              <div className="text-[11px] text-slate-400">Audio feedback for answers & rewards</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
              soundEnabled ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {savedNotice ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>SAVED SUCCESSFULLY!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>SAVE PROFILE CHANGES</span>
            </>
          )}
        </button>

        {/* Admin Portal Entry */}
        {onOpenAdmin && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="w-full py-3 px-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 text-xs font-black transition-all cursor-pointer flex items-center justify-between shadow-lg shadow-emerald-950/20 active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-white text-xs">Admin Portal (এডমিন পেনেল)</span>
                  <span className="text-[10px] text-slate-400 font-semibold">View Students, Classes & Game Scores</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                <span>Open</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}

        {/* Danger Zone: Reset Progress */}
        <div className="pt-1">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-rose-900/40 text-rose-400/80 hover:text-rose-300 hover:border-rose-700/60 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game Progress</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2 text-center">
              <p className="text-xs text-rose-200 font-bold">
                Reset all 50 levels, XP, and badges back to Level 1?
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer"
                >
                  Yes, Reset Everything
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
