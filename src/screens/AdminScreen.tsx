import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Users,
  Gamepad2,
  Trophy,
  Star,
  Clock,
  Calendar,
  Search,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Trash2,
  ChevronRight,
  CheckCircle2,
  X,
  BookOpen,
  Sparkles,
  AlertCircle,
  BarChart3,
  Award,
  Flame,
  Timer,
  Radio,
} from 'lucide-react';
import {
  loginAdmin,
  getSavedAdminToken,
  clearAdminToken,
  fetchAdminOverview,
  fetchStudentDetails,
  deleteStudent,
  resetDemoData,
} from '../utils/adminService';
import { subscribeToFirebaseStudents, seedFirebaseSampleDataIfEmpty } from '../utils/firebase';
import { AdminOverviewData, AdminStudentSummary, StudentActivityItem, StudentClass } from '../types';
import { AVATAR_LIST } from '../components/Mascot';

interface AdminScreenProps {
  onBackToApp: () => void;
}

const ALL_CLASSES: (StudentClass | 'all')[] = [
  'all',
  'Nursery',
  'LKG',
  'UKG',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
];

export const AdminScreen: React.FC<AdminScreenProps> = ({ onBackToApp }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => getSavedAdminToken());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshError, setRefreshError] = useState('');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  // Filters & Search
  const [selectedClass, setSelectedClass] = useState<StudentClass | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'recent' | 'xp' | 'games' | 'accuracy' | 'class'>('rank');

  // Selected Student for detailed Activity modal
  const [selectedStudent, setSelectedStudent] = useState<AdminStudentSummary | null>(null);
  const [studentActivities, setStudentActivities] = useState<StudentActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  // Subscribe to Firebase Realtime Database when admin is logged in
  useEffect(() => {
    if (!authToken) return;

    setIsLoading(true);
    // Seed initial demo data into Firebase if completely empty
    seedFirebaseSampleDataIfEmpty().catch(() => {});

    // Attach real-time listener to Firebase Realtime Database
    const unsubscribe = subscribeToFirebaseStudents(
      (fbStudents) => {
        if (fbStudents && fbStudents.length > 0) {
          setIsFirebaseLive(true);
          let totalGames = 0;
          let totalCorrect = 0;
          let totalQ = 0;
          let totalXp = 0;
          const classMap: Record<string, number> = {};

          const mappedStudents: AdminStudentSummary[] = fbStudents.map((st) => {
            totalGames += st.totalGamesPlayed || 0;
            totalCorrect += st.totalCorrectAnswers || 0;
            totalQ += st.totalQuestionsSolved || 0;
            totalXp += st.xp || 0;

            const cStr = String(st.class);
            classMap[cStr] = (classMap[cStr] || 0) + 1;

            const actsList: StudentActivityItem[] = st.activities
              ? Object.values(st.activities).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
              : [];

            return {
              id: st.id,
              username: st.username,
              class: st.class,
              avatarId: st.avatarId,
              currentSubject: st.currentSubject,
              language: (st.language || 'en') as any,
              xp: st.xp || 0,
              coins: st.coins || 0,
              currentLevel: st.currentLevel || 1,
              totalGamesPlayed: st.totalGamesPlayed || actsList.length,
              accuracy: st.calculatedAccuracy,
              totalQuestionsSolved: st.totalQuestionsSolved || 0,
              totalCorrectAnswers: st.totalCorrectAnswers || 0,
              streak: st.streak || 1,
              joinDate: st.joinDate || new Date().toISOString(),
              lastActive: st.lastActive || new Date().toISOString(),
              recentActivities: actsList.slice(0, 10),
              rank: st.rank,
              totalTimeSpentSeconds: st.totalTimeSpentSeconds || 0,
            };
          });

          const overallAcc = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;

          setOverviewData({
            totalStudents: mappedStudents.length,
            totalGamesPlayed: totalGames,
            overallAccuracy: overallAcc,
            totalXp,
            classCounts: classMap,
            students: mappedStudents,
          });

          setLastRefreshedAt(
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          );
          setIsLoading(false);
        } else {
          // If Firebase is empty, fall back to server overview
          loadOverview(authToken);
        }
      },
      (err) => {
        console.warn('Firebase live listener fallback to server:', err);
        setIsFirebaseLive(false);
        loadOverview(authToken);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authToken]);

  const loadOverview = async (token: string) => {
    setIsLoading(true);
    setRefreshError('');
    try {
      const data = await fetchAdminOverview(token);
      setOverviewData(data);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err: any) {
      if (err.message === 'Unauthorized') {
        setAuthToken(null);
        clearAdminToken();
      } else {
        setRefreshError('Failed to refresh data. Please check connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoggingIn(true);
    setLoginError('');

    const res = await loginAdmin(password.trim());
    setIsLoggingIn(false);

    if (res.success && res.token) {
      setAuthToken(res.token);
      setPassword('');
    } else {
      setLoginError(res.error || 'Incorrect admin password.');
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAuthToken(null);
    setOverviewData(null);
    setSelectedStudent(null);
  };

  const handleViewStudentActivities = async (student: AdminStudentSummary) => {
    setSelectedStudent(student);
    setStudentActivities(student.recentActivities || []);

    if (authToken) {
      setIsLoadingActivities(true);
      try {
        const details = await fetchStudentDetails(student.id, authToken);
        setStudentActivities(details.activities);
      } catch (err) {
        console.error('Error fetching full activities:', err);
      } finally {
        setIsLoadingActivities(false);
      }
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!authToken) return;
    try {
      await deleteStudent(studentId, authToken);
      setDeleteConfirmId(null);
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
      }
      loadOverview(authToken);
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  const handleResetDemo = async () => {
    if (!authToken) return;
    if (window.confirm('Reset student records to standard sample data?')) {
      await resetDemoData(authToken);
      loadOverview(authToken);
    }
  };

  // Filter & Sort Students
  const filteredStudents = useMemo(() => {
    if (!overviewData?.students) return [];

    let list = [...overviewData.students];

    // Filter by class
    if (selectedClass !== 'all') {
      list = list.filter((s) => String(s.class).toLowerCase() === String(selectedClass).toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.username.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          String(s.class).toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'rank') {
        return (a.rank || 999) - (b.rank || 999);
      }
      if (sortBy === 'recent') {
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      }
      if (sortBy === 'xp') {
        return b.xp - a.xp;
      }
      if (sortBy === 'games') {
        return b.totalGamesPlayed - a.totalGamesPlayed;
      }
      if (sortBy === 'accuracy') {
        return b.accuracy - a.accuracy;
      }
      if (sortBy === 'class') {
        return String(a.class).localeCompare(String(b.class));
      }
      return 0;
    });

    return list;
  }, [overviewData, selectedClass, searchQuery, sortBy]);

  // Render Login Screen if not authenticated
  if (!authToken) {
    return (
      <div className="flex-1 min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-md bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Shield className="w-9 h-9 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">Admin Portal</h1>
              <p className="text-xs font-semibold text-emerald-400 mt-1 uppercase tracking-wider">
                এডমিন পেনেল • Student Activity & Class Monitor
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kripya master admin password darj karein to view newly joined students, enrolled classes, played games, and live scores.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all pr-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !password.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Back button */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onBackToApp}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Student App</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Authenticated Dashboard
  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Student Mode"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white leading-tight">Admin Portal</h1>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFirebaseLive ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {isFirebaseLive
                      ? 'Firebase RTDB Live (apna-toppers)'
                      : 'Server Realtime Sync Active'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => authToken && loadOverview(authToken)}
              disabled={isLoading}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleResetDemo}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer hidden md:flex"
              title="Reset Sample Records"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-4 pt-4 space-y-5">
        {/* Metric Cards Banner */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Students */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Total Enrolled</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{overviewData?.totalStudents ?? 0}</span>
              <span className="text-[11px] text-blue-400 font-semibold">Students</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Across Nursery to Class 10</p>
          </div>

          {/* Games Played */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Games Played</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{overviewData?.totalGamesPlayed ?? 0}</span>
              <span className="text-[11px] text-emerald-400 font-semibold">Sessions</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Levels & Chapter Quizzes</p>
          </div>

          {/* Overall Accuracy */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Avg Accuracy</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{overviewData?.overallAccuracy ?? 0}%</span>
              <span className="text-[11px] text-amber-400 font-semibold">Pass Rate</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Correct answer percentage</p>
          </div>

          {/* Total XP */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Total XP Earned</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{overviewData?.totalXp ?? 0}</span>
              <span className="text-[11px] text-purple-400 font-semibold">XP</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Cumulative student progress</p>
          </div>
        </section>

        {/* Class Enrollment Filter Bar */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filter By Enrolled Class (শ্রেণী অনুসৰি বাছক)</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Showing {filteredStudents.length} of {overviewData?.totalStudents ?? 0} students
            </span>
          </div>

          {/* Class pills horizontal scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {ALL_CLASSES.map((cls) => {
              const count =
                cls === 'all'
                  ? overviewData?.totalStudents ?? 0
                  : overviewData?.classCounts[String(cls)] ?? 0;
              const isSelected = selectedClass === cls;

              return (
                <button
                  key={String(cls)}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{cls === 'all' ? 'All Classes' : `Class ${cls}`}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Search & Sort Bar */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or class..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="rank">🏆 Live Rank (Top Scorer)</option>
              <option value="recent">Recently Active</option>
              <option value="games">Most Games Played</option>
              <option value="xp">Highest XP</option>
              <option value="accuracy">Highest Accuracy</option>
              <option value="class">Class</option>
            </select>
          </div>
        </section>

        {/* Students Roster List */}
        <section className="space-y-3">
          {filteredStudents.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No students found</h3>
              <p className="text-xs text-slate-500">
                {searchQuery
                  ? `No students matching "${searchQuery}" in ${selectedClass === 'all' ? 'any class' : `Class ${selectedClass}`}.`
                  : `No students have joined ${selectedClass === 'all' ? 'yet' : `Class ${selectedClass}`}.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredStudents.map((student) => {
                const avatar = AVATAR_LIST.find((a) => a.id === student.avatarId) || AVATAR_LIST[0];
                const lastActiveFormatted = formatTimeAgo(student.lastActive);

                return (
                  <div
                    key={student.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3 group shadow-sm"
                  >
                    {/* Top Row: Avatar, Name, Class & Delete */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          {avatar.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-black text-white truncate">{student.username}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] shrink-0">
                              Class {student.class}
                            </span>
                            {student.rank !== undefined && (
                              <span
                                className={`px-2 py-0.5 rounded-full font-black text-[10px] shrink-0 flex items-center gap-1 ${
                                  student.rank === 1
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-sm shadow-amber-500/20'
                                    : student.rank === 2
                                    ? 'bg-slate-300/20 text-slate-200 border border-slate-300/50'
                                    : student.rank === 3
                                    ? 'bg-amber-700/20 text-amber-400 border border-amber-600/50'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                <Trophy className="w-2.5 h-2.5" />
                                <span>Rank #{student.rank}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium flex-wrap mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>Active {lastActiveFormatted}</span>
                            </span>
                            {student.totalTimeSpentSeconds ? (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-teal-400 font-semibold">
                                  <Timer className="w-3 h-3" />
                                  <span>{Math.max(1, Math.round(student.totalTimeSpentSeconds / 60))}m usage</span>
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Delete action */}
                      <div>
                        {deleteConfirmId === student.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(student.id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                            title="Delete Student Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Games</span>
                        <span className="text-xs font-black text-white">{student.totalGamesPlayed}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Accuracy</span>
                        <span
                          className={`text-xs font-black ${
                            student.accuracy >= 80
                              ? 'text-emerald-400'
                              : student.accuracy >= 60
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {student.accuracy}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Level</span>
                        <span className="text-xs font-black text-blue-400">Lvl {student.currentLevel}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Total XP</span>
                        <span className="text-xs font-black text-purple-400">{student.xp}</span>
                      </div>
                    </div>

                    {/* Footer Row: Subject & Inspect Activity Button */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <span className="capitalize">{student.currentSubject.replace('_', ' ')}</span>
                        <span>•</span>
                        <span className="uppercase text-[10px] font-bold text-slate-500">
                          Lang: {student.language}
                        </span>
                      </div>

                      <button
                        onClick={() => handleViewStudentActivities(student)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>View Activity</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Student Activity History Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                  {AVATAR_LIST.find((a) => a.id === selectedStudent.avatarId)?.emoji || '🦸'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-white">{selectedStudent.username}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      Class {selectedStudent.class}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Joined: {new Date(selectedStudent.joinDate).toLocaleDateString()} • {selectedStudent.totalGamesPlayed} games completed
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Activity Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Quick Summary Pill Bar */}
              <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Live Rank</span>
                  <span className="text-sm font-black text-amber-400">
                    {selectedStudent.rank ? `#${selectedStudent.rank}` : '🏆 Active'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Score</span>
                  <span className="text-sm font-black text-purple-400">{selectedStudent.xp} XP</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Usage</span>
                  <span className="text-sm font-black text-teal-400">
                    {Math.max(1, Math.round((selectedStudent.totalTimeSpentSeconds || 0) / 60))} min
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Accuracy</span>
                  <span className="text-sm font-black text-emerald-400">{selectedStudent.accuracy}%</span>
                </div>
              </div>

              {/* Title */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-emerald-400" />
                  <span>Khele Gaye Games & Quizzes (Game History)</span>
                </h3>
                {isLoadingActivities && (
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                )}
              </div>

              {/* Activity Items */}
              {studentActivities.length === 0 ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <p className="text-xs">Is student ne abhi koi game finish nahi kiya hai.</p>
                  <p className="text-[11px] text-slate-600">
                    As soon as they complete a level or quiz, the exact scores will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {studentActivities.map((act) => {
                    const dateStr = new Date(act.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={act.id}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-black text-white block">{act.levelName}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                                {act.subject.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                Diff: {act.difficulty}
                              </span>
                              {act.isDailyChallenge && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                  Daily Challenge
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`text-sm font-black ${
                                act.accuracy >= 80
                                  ? 'text-emerald-400'
                                  : act.accuracy >= 60
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {act.accuracy}%
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {act.correctAnswers}/{act.totalQuestions} Correct
                            </span>
                          </div>
                        </div>

                        {/* Secondary Details: XP, Time, Stars, Date */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-300 font-semibold">+{act.xpEarned} XP</span>
                            {act.coinsEarned ? (
                              <span className="text-amber-300 font-semibold">+{act.coinsEarned} 🪙</span>
                            ) : null}
                            {act.starsEarned ? (
                              <span className="text-amber-400">{'★'.repeat(act.starsEarned)}</span>
                            ) : null}
                            <span className="text-slate-500">• {act.timeSpentSeconds}s</span>
                          </div>

                          <span className="text-slate-500 text-[10px]">{dateStr}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 text-right">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: Format Time ago
function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  } catch {
    return 'Recently';
  }
}
