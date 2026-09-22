import React, { useState } from 'react';
import { Mascot, AVATAR_LIST } from '../components/Mascot';
import { ArrowRight, User } from 'lucide-react';

interface UsernameScreenProps {
  initialUsername?: string;
  initialAvatarId?: string;
  onNext: (username: string, avatarId: string) => void;
}

export const UsernameScreen: React.FC<UsernameScreenProps> = ({
  initialUsername = '',
  initialAvatarId = 'hero_1',
  onNext,
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) {
      setError('Please enter a username');
      return;
    }
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username must be 20 characters or less');
      return;
    }

    setError('');
    onNext(trimmed, selectedAvatarId);
  };

  const selectedAvatar = AVATAR_LIST.find((a) => a.id === selectedAvatarId) || AVATAR_LIST[0];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background radial shine */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Section */}
      <div className="pt-6 text-center z-10">
        <div className="inline-block mb-3">
          <Mascot mood="happy" size="md" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Welcome!
        </h1>
        <p className="mt-1 text-sm text-indigo-300 font-medium">
          Let's start your Maths journey.
        </p>
      </div>

      {/* Center Form */}
      <div className="max-w-sm mx-auto w-full my-auto z-10 py-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center block">
              Pick Your Hero Avatar
            </label>
            <div className="flex items-center justify-center gap-2.5">
              {AVATAR_LIST.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => setSelectedAvatarId(av.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-tr ${av.color} transition-all cursor-pointer ${
                    selectedAvatarId === av.id
                      ? 'ring-4 ring-amber-400 scale-110 shadow-lg shadow-amber-400/25'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
            <div className="text-center text-xs font-semibold text-amber-300">
              {selectedAvatar.name}
            </div>
          </div>

          {/* Username Input Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="username-input"
              className="text-xs font-bold text-slate-300 uppercase tracking-wider block"
            >
              Enter your username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                maxLength={20}
                placeholder="e.g. Rahul, Aru, Champion"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900 border-2 border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-white placeholder:text-slate-500 font-bold text-base outline-none transition-all"
                autoFocus
              />
            </div>
            {error ? (
              <p className="text-xs font-bold text-rose-400 mt-1 flex items-center gap-1">
                ⚠️ {error}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                2 to 20 characters. No password needed!
              </p>
            )}
          </div>

          <button
            type="submit"
            id="btn-username-next"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-black text-base shadow-lg shadow-indigo-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-300/30"
          >
            <span>NEXT</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="pb-4 text-center z-10 text-xs text-slate-500">
        Takes less than 30 seconds to begin playing!
      </div>
    </div>
  );
};
