import React from 'react';
import { StudentProfile, LanguageCode } from '../types';
import { AVATAR_LIST } from './Mascot';
import { Volume2, VolumeX, Shield } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface HeaderBarProps {
  profile: StudentProfile;
  onOpenProfile: () => void;
  onToggleSound: () => void;
  onSelectLanguage?: (lang: LanguageCode) => void;
  onOpenAdmin?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  profile,
  onOpenProfile,
  onToggleSound,
  onSelectLanguage,
  onOpenAdmin,
}) => {
  const avatar = AVATAR_LIST.find((a) => a.id === profile.avatarId) || AVATAR_LIST[0];
  const t = (key: string) => getTranslation(key, profile.language);

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'as', label: 'অসমীয়া', flag: '🪷' },
  ];

  const handleCycleLanguage = () => {
    if (!onSelectLanguage) return;
    const order: LanguageCode[] = ['en', 'hi', 'as'];
    const nextIdx = (order.indexOf(profile.language) + 1) % order.length;
    onSelectLanguage(order[nextIdx]);
  };

  const currentLangObj = languages.find((l) => l.code === profile.language) || languages[0];

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-2.5 py-2 sm:px-4 sm:py-2.5 z-30 sticky top-0">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* User Info & Avatar */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all text-left group cursor-pointer shrink-0"
        >
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr ${avatar.color} flex items-center justify-center text-base sm:text-lg shadow-md ring-2 ring-indigo-400/40 group-hover:ring-indigo-400 transition-all`}
          >
            {avatar.emoji}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight leading-tight max-w-[90px] sm:max-w-none truncate">
                {profile.username || 'Hero'}
              </span>
              <span className="text-xs">👋</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-indigo-300/90 flex items-center gap-1">
              <span>
                {t('header.class')} {profile.class}
              </span>
              <span>•</span>
              <span className="text-emerald-400">
                {t('header.level')} {profile.currentLevel}
              </span>
            </div>
          </div>
        </button>

        {/* Game Stats & Language Pill */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Language Toggle Button */}
          {onSelectLanguage && (
            <button
              onClick={handleCycleLanguage}
              title="Change Language (English / हिन्दी / অসমীয়া)"
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 px-2 py-1 rounded-full text-[11px] font-extrabold text-white cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <span>{currentLangObj.flag}</span>
              <span className="text-[10px] text-amber-300">{currentLangObj.label}</span>
            </button>
          )}

          {/* Streak */}
          <div
            title="Daily Practice Streak"
            className="flex items-center gap-0.5 sm:gap-1 bg-amber-500/15 border border-amber-500/30 px-1.5 sm:px-2 py-1 rounded-full text-xs font-bold text-amber-300"
          >
            <span className="text-xs sm:text-sm">🔥</span>
            <span>{profile.streak}</span>
          </div>

          {/* XP */}
          <div
            title="Total XP"
            className="flex items-center gap-0.5 sm:gap-1 bg-indigo-500/15 border border-indigo-500/30 px-1.5 sm:px-2 py-1 rounded-full text-xs font-bold text-indigo-300"
          >
            <span className="text-xs sm:text-sm">⭐</span>
            <span className="text-[11px] sm:text-xs">{profile.xp}</span>
          </div>

          {/* Coins */}
          <div
            title="Gold Coins"
            className="hidden xs:flex items-center gap-0.5 sm:gap-1 bg-yellow-500/15 border border-yellow-500/30 px-1.5 sm:px-2 py-1 rounded-full text-xs font-bold text-yellow-300"
          >
            <span className="text-xs sm:text-sm">🪙</span>
            <span className="text-[11px] sm:text-xs">{profile.coins}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            )}
          </button>

          {/* Admin Portal Toggle */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              aria-label="Admin Portal"
              title="Admin Portal | এডমিন পেনেল (nzali789987$&)"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 flex items-center justify-center transition-colors cursor-pointer border border-emerald-500/30"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
