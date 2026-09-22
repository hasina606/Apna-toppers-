import React from 'react';
import { StudentProfile, StudentClass } from '../types';
import { Trophy, ChevronLeft, Flame, Star, Award } from 'lucide-react';

interface LeaderboardScreenProps {
  profile: StudentProfile;
  onBack: () => void;
}

interface PeerScore {
  rank: number;
  name: string;
  avatar: string;
  class: StudentClass;
  xp: number;
  streak: number;
  badgeCount: number;
  isUser?: boolean;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ profile, onBack }) => {
  // Generate friendly peer classmates for leaderboard
  const peers: PeerScore[] = [
    { rank: 1, name: 'Aarav Sharma', avatar: '⚡', class: profile.class, xp: Math.max(profile.xp + 240, 680), streak: 12, badgeCount: 7 },
    { rank: 2, name: 'Ananya Roy', avatar: '🔮', class: profile.class, xp: Math.max(profile.xp + 180, 590), streak: 9, badgeCount: 6 },
    { rank: 3, name: 'Kabir Patel', avatar: '🔥', class: profile.class, xp: Math.max(profile.xp + 110, 480), streak: 8, badgeCount: 5 },
    { rank: 4, name: 'Diya Nair', avatar: '🌱', class: profile.class, xp: Math.max(profile.xp + 60, 390), streak: 5, badgeCount: 4 },
    { rank: 5, name: 'Rohan Mehra', avatar: '⭐', class: profile.class, xp: Math.max(profile.xp + 20, 310), streak: 4, badgeCount: 3 },
    {
      rank: 6,
      name: profile.username || 'You',
      avatar: '👑',
      class: profile.class,
      xp: profile.xp,
      streak: profile.streak,
      badgeCount: profile.badges.filter((b) => b.unlocked).length,
      isUser: true,
    },
    { rank: 7, name: 'Pooja Iyer', avatar: '⚡', class: profile.class, xp: Math.max(profile.xp - 30, 220), streak: 3, badgeCount: 2 },
    { rank: 8, name: 'Vihaan Verma', avatar: '🔥', class: profile.class, xp: Math.max(profile.xp - 60, 180), streak: 2, badgeCount: 2 },
    { rank: 9, name: 'Sanya Gupta', avatar: '🌱', class: profile.class, xp: Math.max(profile.xp - 90, 140), streak: 2, badgeCount: 1 },
    { rank: 10, name: 'Dev Joshi', avatar: '⭐', class: profile.class, xp: Math.max(profile.xp - 110, 110), streak: 1, badgeCount: 1 },
  ];

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-4 pt-3 pb-24 space-y-4 overflow-y-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          Weekly Champions 🏆
        </span>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Class {profile.class} Leaderboard
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Solve more questions and keep your streak to climb the ranks!
        </p>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-3 gap-2 pt-2 items-end">
        {/* Rank 2 */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="text-xl">🥈</div>
          <div className="text-xs font-black text-white truncate">{peers[1].name.split(' ')[0]}</div>
          <div className="text-[10px] font-bold text-slate-400 font-mono">{peers[1].xp} XP</div>
        </div>

        {/* Rank 1 */}
        <div className="p-4 rounded-2xl bg-gradient-to-t from-amber-500/20 to-slate-900 border-2 border-amber-400 text-center space-y-1 -translate-y-2 shadow-lg shadow-amber-500/10">
          <div className="text-3xl">👑</div>
          <div className="text-xs font-black text-amber-300 truncate">{peers[0].name.split(' ')[0]}</div>
          <div className="text-[11px] font-black text-white font-mono">{peers[0].xp} XP</div>
        </div>

        {/* Rank 3 */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="text-xl">🥉</div>
          <div className="text-xs font-black text-white truncate">{peers[2].name.split(' ')[0]}</div>
          <div className="text-[10px] font-bold text-slate-400 font-mono">{peers[2].xp} XP</div>
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="space-y-2">
        {peers.map((peer) => {
          return (
            <div
              key={peer.rank}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                peer.isUser
                  ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/90 border-indigo-400 ring-2 ring-indigo-400/30 shadow-md'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 text-center font-black text-xs text-slate-400 font-mono">
                  #{peer.rank}
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                  {peer.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">
                      {peer.name}
                    </span>
                    {peer.isUser && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-500 text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Flame className="w-3 h-3" /> {peer.streak} streak
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-purple-400">
                      <Award className="w-3 h-3" /> {peer.badgeCount} badges
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-amber-300 font-mono">
                  {peer.xp} XP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
