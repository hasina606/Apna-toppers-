import React from 'react';
import { ScreenType, LanguageCode } from '../types';
import { Home, BookOpen, BarChart3, Award, User } from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface BottomNavProps {
  currentScreen: ScreenType;
  language?: LanguageCode;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, language = 'en', onNavigate }) => {
  const t = (key: string) => getTranslation(key, language);

  const tabs = [
    { id: 'home' as ScreenType, label: t('nav.home'), icon: Home, color: 'text-blue-400' },
    { id: 'practice' as ScreenType, label: t('nav.practice'), icon: BookOpen, color: 'text-emerald-400' },
    { id: 'progress' as ScreenType, label: t('nav.progress'), icon: BarChart3, color: 'text-indigo-400' },
    { id: 'badges' as ScreenType, label: t('nav.badges'), icon: Award, color: 'text-amber-400' },
    { id: 'profile' as ScreenType, label: t('nav.profile'), icon: User, color: 'text-purple-400' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] ${
                isActive
                  ? 'text-white bg-slate-800/90 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? `scale-110 ${tab.color}` : ''
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-bold tracking-tight ${
                  isActive ? 'text-white font-extrabold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

