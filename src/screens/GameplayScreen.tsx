import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, StudentClass, Difficulty, GameResult } from '../types';
import { soundEffects } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Clock, HelpCircle, Zap, ShieldAlert, Sparkles, ArrowRight, X, AlertCircle } from 'lucide-react';

interface GameplayScreenProps {
  levelId: number;
  levelName: string;
  difficulty: Difficulty;
  studentClass: StudentClass;
  questions: Question[];
  soundEnabled: boolean;
  isPracticeMode?: boolean;
  isDailyChallenge?: boolean;
  onFinishGame: (result: GameResult, topicStats: Record<string, { total: number; correct: number }>) => void;
  onExit: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  levelId,
  levelName,
  difficulty,
  studentClass,
  questions,
  soundEnabled,
  isPracticeMode = false,
  isDailyChallenge = false,
  onFinishGame,
  onExit,
}) => {
  // Game session states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Per-question states
  const getInitialTimeForDiff = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 20;
      case 'medium':
        return 15;
      case 'hard':
        return 12;
      case 'expert':
        return 10;
      default:
        return 20;
    }
  };

  const initialTime = getInitialTimeForDiff(difficulty);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Power-ups state
  const [hiddenOptions, setHiddenOptions] = useState<(number | string)[]>([]);
  const [showHintModal, setShowHintModal] = useState(false);
  const [powerupsUsed, setPowerupsUsed] = useState({
    fiftyFifty: false,
    timeBoost: false,
    hint: false,
    secondChance: false,
  });
  const [secondChanceActive, setSecondChanceActive] = useState(false);

  // Topic performance tracker
  const topicStatsRef = useRef<Record<string, { total: number; correct: number }>>({});

  const currentQ = questions[currentIndex] || questions[0];

  // Timer effect
  useEffect(() => {
    if (isAnswered || isPracticeMode) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isPracticeMode]);

  // Handle timeout
  const handleTimeout = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsTimedOut(true);
    soundEffects.playWrong(soundEnabled);

    // Track topic failure
    if (!topicStatsRef.current[currentQ.topic]) {
      topicStatsRef.current[currentQ.topic] = { total: 0, correct: 0 };
    }
    topicStatsRef.current[currentQ.topic].total += 1;

    if (!isPracticeMode) {
      setLives((prev) => Math.max(0, prev - 1));
    }
  };

  // Handle answer selection
  const handleSelectAnswer = (option: number | string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = String(option).trim() === String(currentQ.correctAnswer).trim();

    // Track topic stats
    if (!topicStatsRef.current[currentQ.topic]) {
      topicStatsRef.current[currentQ.topic] = { total: 0, correct: 0 };
    }
    topicStatsRef.current[currentQ.topic].total += 1;

    if (isCorrect) {
      soundEffects.playCorrect(soundEnabled);
      topicStatsRef.current[currentQ.topic].correct += 1;

      // Confetti burst
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
        });
      } catch {
        // ignore
      }

      // Calculate XP & Coins based on difficulty and speed bonus
      let baseXP = 10;
      let baseCoins = 5;
      if (difficulty === 'medium') {
        baseXP = 20;
        baseCoins = 10;
      } else if (difficulty === 'hard') {
        baseXP = 30;
        baseCoins = 15;
      } else if (difficulty === 'expert') {
        baseXP = 50;
        baseCoins = 25;
      }

      // Speed bonus: answered with > 50% time left
      const speedBonus = !isPracticeMode && timeLeft > initialTime / 2 ? 5 : 0;
      setXpEarned((prev) => prev + baseXP + speedBonus);
      setCoinsEarned((prev) => prev + baseCoins);
      setScore((prev) => prev + 1);
    } else {
      soundEffects.playWrong(soundEnabled);

      // Check if Second Chance powerup was active
      if (secondChanceActive) {
        setSecondChanceActive(false);
        setIsAnswered(false);
        setSelectedOption(null);
        // Remove the wrong answer clicked
        setHiddenOptions((prev) => [...prev, option]);
        return;
      }

      if (!isPracticeMode) {
        setLives((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Next Question or End Game
  const handleNextQuestion = () => {
    soundEffects.playClick(soundEnabled);

    // Check if lives ran out
    if (!isPracticeMode && lives <= (isCorrectAnswer ? 0 : 1) && !isCorrectAnswer) {
      finishGameSession(false);
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsTimedOut(false);
      setTimeLeft(initialTime);
      setHiddenOptions([]);
      setShowHintModal(false);
    } else {
      finishGameSession(true);
    }
  };

  // Complete Game Session
  const finishGameSession = (completed: boolean) => {
    const totalQ = currentIndex + 1;
    const accuracy = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

    // Stars calculation
    let stars = 1;
    if (accuracy >= 90) stars = 3;
    else if (accuracy >= 70) stars = 2;

    // Perfect game bonus
    let finalXP = xpEarned;
    if (accuracy === 100 && totalQ >= 10) {
      finalXP += 50;
    }

    // Daily bonus
    if (isDailyChallenge) {
      finalXP += 30;
    }

    const result: GameResult = {
      levelId,
      levelName,
      difficulty,
      totalQuestions: totalQ,
      correctAnswers: score,
      accuracy,
      timeSpentSeconds: totalTimeSpent,
      xpEarned: finalXP,
      coinsEarned,
      starsEarned: stars,
      newLevelUnlocked: null,
      isDailyChallenge,
    };

    onFinishGame(result, topicStatsRef.current);
  };

  // Power-up: 50/50
  const handleUseFiftyFifty = () => {
    if (powerupsUsed.fiftyFifty || isAnswered) return;
    soundEffects.playPowerup(soundEnabled);
    setPowerupsUsed((prev) => ({ ...prev, fiftyFifty: true }));

    const wrongOptions = currentQ.options.filter(
      (opt) => String(opt).trim() !== String(currentQ.correctAnswer).trim()
    );
    // Hide up to 2 wrong options
    const toHide = wrongOptions.slice(0, 2);
    setHiddenOptions(toHide);
  };

  // Power-up: Time Boost (+5s)
  const handleUseTimeBoost = () => {
    if (powerupsUsed.timeBoost || isAnswered || isPracticeMode) return;
    soundEffects.playPowerup(soundEnabled);
    setPowerupsUsed((prev) => ({ ...prev, timeBoost: true }));
    setTimeLeft((prev) => prev + 5);
  };

  // Power-up: Hint
  const handleUseHint = () => {
    soundEffects.playPowerup(soundEnabled);
    setPowerupsUsed((prev) => ({ ...prev, hint: true }));
    setShowHintModal(true);
  };

  // Power-up: Second Chance
  const handleUseSecondChance = () => {
    if (powerupsUsed.secondChance || isAnswered || isPracticeMode) return;
    soundEffects.playPowerup(soundEnabled);
    setPowerupsUsed((prev) => ({ ...prev, secondChance: true }));
    setSecondChanceActive(true);
  };

  const isCorrectAnswer =
    selectedOption !== null &&
    String(selectedOption).trim() === String(currentQ.correctAnswer).trim();

  const timerRatio = timeLeft / initialTime;
  const timerColor =
    timerRatio > 0.5 ? 'bg-emerald-500' : timerRatio > 0.25 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse';

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between p-3 sm:p-5 relative select-none">
      {/* Top Header Navigation & Status */}
      <div className="w-full max-w-md mx-auto z-10 space-y-2">
        <div className="flex items-center justify-between">
          {/* Exit Button */}
          <button
            onClick={onExit}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Level or Practice Title */}
          <div className="text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">
              {isPracticeMode ? 'Practice Mode' : isDailyChallenge ? 'Daily Challenge' : levelName}
            </span>
            <div className="text-xs font-bold text-slate-400 font-mono">
              Q {currentIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Lives System (Hearts) */}
          <div className="flex items-center gap-1">
            {isPracticeMode ? (
              <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                ∞ Free
              </span>
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 transition-all ${
                    i < lives
                      ? 'fill-rose-500 text-rose-500 scale-100'
                      : 'fill-slate-800 text-slate-800 scale-90'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Timer Bar (unless practice mode) */}
        {!isPracticeMode && (
          <div className="flex items-center gap-2 pt-1">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className={`h-full ${timerColor} transition-all duration-300`}
                style={{ width: `${Math.max(timerRatio * 100, 0)}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 w-7 text-right">
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Main Question Arena */}
      <div className="w-full max-w-md mx-auto my-auto py-3 space-y-4 z-10">
        {/* Topic Badge */}
        <div className="text-center">
          <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
            {currentQ.topicTitle}
          </span>
        </div>

        {/* Main Question Display Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/60 border-2 border-slate-800 shadow-2xl text-center relative overflow-hidden">
          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug drop-shadow-md">
            {currentQ.question}
          </div>
        </div>

        {/* 4 Large MCQ Answer Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isHidden = hiddenOptions.includes(opt);
            if (isHidden) {
              return (
                <div
                  key={idx}
                  className="h-16 rounded-2xl bg-slate-900/30 border border-slate-900/50 opacity-20"
                />
              );
            }

            const isThisSelected = selectedOption === opt;
            const isThisCorrect = String(opt).trim() === String(currentQ.correctAnswer).trim();

            let btnStyle =
              'bg-slate-900 hover:bg-slate-850 border-2 border-slate-800 text-white hover:border-indigo-500/60 active:scale-98 shadow-md';

            if (isAnswered) {
              if (isThisCorrect) {
                btnStyle =
                  'bg-emerald-600/90 border-2 border-emerald-400 text-white ring-4 ring-emerald-500/30 shadow-lg';
              } else if (isThisSelected) {
                btnStyle =
                  'bg-rose-600/90 border-2 border-rose-400 text-white ring-4 ring-rose-500/30';
              } else {
                btnStyle = 'bg-slate-900/40 border border-slate-800/40 text-slate-500 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(opt)}
                disabled={isAnswered}
                className={`min-h-[64px] p-3 rounded-2xl font-black text-lg sm:text-xl transition-all flex items-center justify-center cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Power-ups Bar (in game mode) */}
        {!isPracticeMode && (
          <div className="pt-2 flex items-center justify-center gap-2">
            {/* 50/50 */}
            <button
              onClick={handleUseFiftyFifty}
              disabled={powerupsUsed.fiftyFifty || isAnswered}
              title="Remove 2 wrong answers"
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                powerupsUsed.fiftyFifty
                  ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span>🌓</span>
              <span>50/50</span>
            </button>

            {/* Time Boost */}
            <button
              onClick={handleUseTimeBoost}
              disabled={powerupsUsed.timeBoost || isAnswered}
              title="Add 5 seconds"
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                powerupsUsed.timeBoost
                  ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>+5s</span>
            </button>

            {/* Hint */}
            <button
              onClick={handleUseHint}
              title="View conceptual Math hint"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-amber-300 flex items-center gap-1 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Hint</span>
            </button>

            {/* Second Chance */}
            <button
              onClick={handleUseSecondChance}
              disabled={powerupsUsed.secondChance || isAnswered}
              title="Allow retry if wrong"
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                powerupsUsed.secondChance || secondChanceActive
                  ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-purple-400" />
              <span>2nd Chance</span>
            </button>
          </div>
        )}
      </div>

      {/* Answer Feedback Banner (Correct / Wrong / Timeout) */}
      {isAnswered ? (
        <div className="w-full max-w-md mx-auto z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`p-4 sm:p-5 rounded-3xl border-2 shadow-2xl ${
              isCorrectAnswer
                ? 'bg-emerald-950/95 border-emerald-500/70 text-emerald-100'
                : 'bg-rose-950/95 border-rose-500/70 text-rose-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-black text-lg sm:text-xl">
                  {isCorrectAnswer ? (
                    <>
                      <span className="text-2xl">✅</span>
                      <span className="text-emerald-300">CORRECT!</span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                        +10 XP
                      </span>
                    </>
                  ) : isTimedOut ? (
                    <>
                      <span className="text-2xl">⏰</span>
                      <span className="text-rose-300">TIME'S UP!</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">❌</span>
                      <span className="text-rose-300">Almost! Let's learn this one.</span>
                    </>
                  )}
                </div>

                {!isCorrectAnswer && (
                  <div className="mt-1 font-bold text-sm text-white">
                    Correct Answer: <span className="text-amber-300 font-mono">{currentQ.correctAnswer}</span>
                  </div>
                )}

                {/* Friendly step-by-step pedagogical explanation */}
                <p className="mt-2 text-xs text-slate-200 font-medium leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/10">
                  <span className="font-bold text-amber-300 block mb-0.5">Explanation:</span>
                  {currentQ.explanation}
                </p>
              </div>
            </div>

            {/* Next Question Button */}
            <button
              onClick={handleNextQuestion}
              id="btn-next-question"
              className={`mt-3 w-full py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all ${
                isCorrectAnswer
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
              }`}
            >
              <span>{currentIndex + 1 < questions.length ? 'NEXT QUESTION' : 'SEE RESULTS'}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty spacer to keep balance */
        <div className="h-14 w-full max-w-md mx-auto" />
      )}

      {/* Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-sm w-full p-5 shadow-2xl text-center space-y-3 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-2xl mx-auto">
              💡
            </div>
            <h3 className="text-base font-black text-white">Math Hero Hint</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              {currentQ.hint}
            </p>
            <button
              onClick={() => setShowHintModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer active:scale-95"
            >
              GOT IT, THANKS!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
