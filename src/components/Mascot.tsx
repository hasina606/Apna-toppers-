import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'cheering' | 'thinking' | 'encouraging' | 'superhero' | 'celebrating';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  const dim = sizeMap[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${dim} ${className}`}>
      {/* Floating Math Symbols around mascot */}
      {mood === 'celebrating' || mood === 'superhero' ? (
        <>
          <span className="absolute -top-2 -left-2 text-amber-400 text-xs sm:text-sm font-black animate-bounce">
            +
          </span>
          <span className="absolute -top-3 -right-1 text-cyan-400 text-xs sm:text-sm font-black animate-pulse">
            ×
          </span>
          <span className="absolute -bottom-1 -left-3 text-emerald-400 text-xs sm:text-sm font-black">
            ÷
          </span>
          <span className="absolute -bottom-2 -right-2 text-pink-400 text-xs sm:text-sm font-black animate-bounce">
            ⭐
          </span>
        </>
      ) : null}

      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="capeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Backdrop aura */}
        <circle cx="80" cy="80" r="70" fill="url(#glowGrad)" />

        {/* Hero Cape (fluttering behind) */}
        <path
          d="M 46 76 C 24 95 18 135 34 148 C 50 138 60 128 72 120 Z"
          fill="url(#capeGrad)"
        />
        <path
          d="M 114 76 C 136 95 142 135 126 148 C 110 138 100 128 88 120 Z"
          fill="url(#capeGrad)"
        />

        {/* Body / Hero Suit */}
        <rect x="54" y="86" width="52" height="48" rx="20" fill="url(#suitGrad)" />

        {/* Math Hero Emblem on Chest */}
        <circle cx="80" cy="104" r="14" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
        <text
          x="80"
          y="109"
          fontFamily="system-ui, sans-serif"
          fontSize="13"
          fontWeight="900"
          fill="#1e1b4b"
          textAnchor="middle"
        >
          {mood === 'cheering' || mood === 'celebrating' ? '100' : 'π'}
        </text>

        {/* Neck */}
        <rect x="72" y="76" width="16" height="14" rx="4" fill="#fdba74" />

        {/* Head */}
        <circle cx="80" cy="60" r="32" fill="url(#skinGrad)" />

        {/* Cheeks */}
        <circle cx="60" cy="68" r="5" fill="#f43f5e" opacity="0.35" />
        <circle cx="100" cy="68" r="5" fill="#f43f5e" opacity="0.35" />

        {/* Hair - Stylized stylish cartoon swoop */}
        <path
          d="M 50 56 C 48 38 62 26 80 26 C 98 26 112 36 110 54 C 104 42 94 38 82 39 C 68 40 56 46 50 56 Z"
          fill="url(#hairGrad)"
        />
        <path
          d="M 56 34 C 62 20 86 16 94 28 C 86 24 74 26 68 32 Z"
          fill="#78350f"
        />

        {/* Superhero Visor / Headband */}
        <path
          d="M 49 48 C 65 44 95 44 111 48 L 110 55 C 95 51 65 51 50 55 Z"
          fill="#3b82f6"
        />
        <circle cx="80" cy="49.5" r="4" fill="#fbbf24" />

        {/* Eyes */}
        {mood === 'cheering' || mood === 'celebrating' ? (
          // Happy squinting crescent eyes
          <>
            <path
              d="M 64 61 Q 70 55 76 61"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 84 61 Q 90 55 96 61"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : mood === 'thinking' ? (
          // Thinking glance up
          <>
            <circle cx="70" cy="59" r="6" fill="#0f172a" />
            <circle cx="68" cy="57" r="2.5" fill="#ffffff" />
            <circle cx="90" cy="59" r="6" fill="#0f172a" />
            <circle cx="88" cy="57" r="2.5" fill="#ffffff" />
            {/* Raised eyebrow */}
            <path d="M 84 51 Q 92 47 98 52" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          // Big, friendly, expressive cartoon eyes
          <>
            <circle cx="70" cy="62" r="6" fill="#0f172a" />
            <circle cx="68" cy="60" r="2.5" fill="#ffffff" />
            <circle cx="72" cy="64" r="1.2" fill="#ffffff" />

            <circle cx="90" cy="62" r="6" fill="#0f172a" />
            <circle cx="88" cy="60" r="2.5" fill="#ffffff" />
            <circle cx="92" cy="64" r="1.2" fill="#ffffff" />

            {/* Confident gentle eyebrows */}
            <path d="M 63 53 Q 70 51 76 54" stroke="#451a03" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 84 54 Q 90 51 97 53" stroke="#451a03" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Nose */}
        <circle cx="80" cy="66" r="1.5" fill="#ea580c" opacity="0.6" />

        {/* Mouth */}
        {mood === 'cheering' || mood === 'celebrating' ? (
          // Big excited open smile with tongue
          <g>
            <path
              d="M 70 71 Q 80 84 90 71 Z"
              fill="#be123c"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <path d="M 74 76 Q 80 81 86 76" fill="#fb7185" />
          </g>
        ) : mood === 'encouraging' ? (
          // Warm confident smile
          <path
            d="M 72 72 Q 80 79 88 72"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === 'thinking' ? (
          // Quizzical sideways smile
          <path
            d="M 73 74 Q 81 75 87 71"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          // Happy confident smile
          <path
            d="M 71 71 Q 80 78 89 71"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Hands / Gesture */}
        {mood === 'cheering' || mood === 'celebrating' || mood === 'superhero' ? (
          // Both arms up / victory fists
          <>
            <path
              d="M 54 94 C 40 86 34 68 40 56 C 44 54 50 60 48 70 L 58 92 Z"
              fill="url(#suitGrad)"
            />
            <circle cx="39" cy="56" r="6.5" fill="#fdba74" stroke="#ea580c" strokeWidth="1" />
            <path
              d="M 106 94 C 120 86 126 68 120 56 C 116 54 110 60 112 70 L 102 92 Z"
              fill="url(#suitGrad)"
            />
            <circle cx="121" cy="56" r="6.5" fill="#fdba74" stroke="#ea580c" strokeWidth="1" />
          </>
        ) : (
          // Friendly wave with right hand
          <>
            <path
              d="M 104 94 C 118 88 126 76 128 66 C 124 64 116 68 114 78 Z"
              fill="url(#suitGrad)"
            />
            <circle cx="128" cy="65" r="6.5" fill="#fdba74" />
          </>
        )}
      </svg>
    </div>
  );
};

export const AVATAR_LIST = [
  { id: 'hero_1', name: 'Lightning Hero', color: 'from-blue-500 to-indigo-600', emoji: '⚡' },
  { id: 'hero_2', name: 'Fire Phoenix', color: 'from-amber-500 to-rose-600', emoji: '🔥' },
  { id: 'hero_3', name: 'Cosmic Genius', color: 'from-purple-500 to-pink-600', emoji: '🔮' },
  { id: 'hero_4', name: 'Nature Wizard', color: 'from-emerald-500 to-teal-600', emoji: '🌱' },
  { id: 'hero_5', name: 'Star Voyager', color: 'from-cyan-400 to-blue-600', emoji: '⭐' },
  { id: 'hero_6', name: 'Golden Champion', color: 'from-yellow-400 to-amber-600', emoji: '🏆' },
];
