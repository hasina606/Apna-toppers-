import React from 'react';
import { Mascot } from '../components/Mascot';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen w-full bg-radial from-slate-900 via-slate-950 to-indigo-950 text-white flex flex-col justify-between p-6 relative overflow-hidden select-none">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating mathematical symbols */}
      <div className="absolute top-10 left-8 text-2xl font-black text-amber-400/40 animate-pulse">+</div>
      <div className="absolute top-24 right-12 text-3xl font-black text-cyan-400/40 animate-bounce">×</div>
      <div className="absolute top-1/3 left-6 text-2xl font-black text-pink-400/30">÷</div>
      <div className="absolute top-2/3 right-8 text-4xl font-black text-indigo-400/30">−</div>
      <div className="absolute bottom-32 left-12 text-2xl font-black text-emerald-400/40">π</div>
      <div className="absolute bottom-40 right-16 text-2xl font-black text-yellow-400/40">∑</div>

      {/* Top Header Badge */}
      <div className="pt-4 text-center z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-extrabold uppercase tracking-widest shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          TOPPER APP
        </div>
      </div>

      {/* Center Character & Hero Title */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-4">
        {/* Animated Mascot */}
        <div className="relative mb-3">
          <div className="absolute inset-0 bg-blue-500/25 rounded-full blur-xl animate-pulse" />
          <Mascot mood="superhero" size="xl" />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
          MATH <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">HERO</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-xs sm:text-sm font-extrabold tracking-widest text-indigo-300 uppercase">
          PRACTICE • PLAY • IMPROVE
        </p>

        {/* Core Tagline */}
        <div className="mt-4 px-4 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-semibold max-w-xs">
          Level up your Maths with fast, colorful & fun challenges!
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pb-4 text-center z-10 max-w-sm mx-auto w-full space-y-3">
        <button
          onClick={onStart}
          id="btn-get-started"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base sm:text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/40"
        >
          <span>GET STARTED</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        <p className="text-xs font-medium text-slate-400">
          "Small Steps. Big Brain."
        </p>
      </div>
    </div>
  );
};
