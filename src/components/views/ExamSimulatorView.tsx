import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  SubtestType,
  ExamSession,
  QuestionAttempt,
  NGATQuestion,
} from '../../types/ngat';
import { buildNGATExam } from '../../engine/examBuilder';
import { StimulusRenderer } from '../renderers/StimulusRenderer';
import { GeometricShapeSVG } from '../renderers/GeometricShapeSVG';
import { ArrowRight, Clock, X, AlertTriangle } from 'lucide-react';

export interface ExamSimulatorViewProps {
  subtest: SubtestType | 'mixed';
  questionCount?: number;
  timeLimitSeconds?: number;
  seed?: number;
  onFinishExam: (session: ExamSession) => void;
  onExitExam: () => void;
}

export const ExamSimulatorView: React.FC<ExamSimulatorViewProps> = ({
  subtest,
  questionCount = 40,
  timeLimitSeconds = 1800,
  seed,
  onFinishExam,
  onExitExam,
}) => {
  // Generate question deck
  const questions: NGATQuestion[] = useMemo(() => {
    return buildNGATExam(subtest, questionCount, seed ?? 42);
  }, [subtest, questionCount, seed]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>({});
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const questionStartTimeRef = useRef<number>(Date.now());
  const examStartTimeRef = useRef<number>(Date.now());

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    // MHS Rule: Selecting an option highlights it, but DOES NOT advance
    setSelectedOptionIndex(idx);
  };

  const finishSession = (finalAttempts: Record<string, QuestionAttempt> = attempts) => {
    const totalQ = questions.length;
    const attemptedList = Object.values(finalAttempts);
    const correctCount = attemptedList.filter((a) => a.isCorrect).length;
    const accuracy = totalQ > 0 ? correctCount / totalQ : 0;

    // Standard Naglieri Scaled Score (100–160 scale, mean 100, sd 15/16)
    const scaledScore = Math.min(160, Math.max(90, Math.round(100 + accuracy * 58 + 2)));

    // Percentile rank estimate (calibrated for 5th-grade Oregon TAG norms)
    let percentileRank = 50;
    if (accuracy >= 0.95) percentileRank = 99;
    else if (accuracy >= 0.90) percentileRank = 98;
    else if (accuracy >= 0.85) percentileRank = 95;
    else if (accuracy >= 0.75) percentileRank = 88;
    else if (accuracy >= 0.65) percentileRank = 78;
    else if (accuracy >= 0.50) percentileRank = 62;
    else percentileRank = Math.max(1, Math.round(accuracy * 80));

    const session: ExamSession = {
      id: `exam-session-${Date.now()}`,
      subtest: subtest === 'mixed' ? 'full-mock' : subtest,
      startTime: examStartTimeRef.current,
      endTime: Date.now(),
      totalQuestions: totalQ,
      currentIndex,
      questions,
      attempts: finalAttempts,
      flaggedQuestionIds: [],
      isCompleted: true,
      timeLimitSeconds,
      scaledScore,
      percentileRank,
      strengths: ['Pattern Analysis', 'Rapid Visual Scanning'],
      growthAreas: ['Hidden Perspective Traps'],
    };

    onFinishExam(session);
  };

  const handleNext = () => {
    if (selectedOptionIndex === null) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const isCorrect = selectedOptionIndex === currentQuestion.correctIndex;
    const pickedOption = currentQuestion.options[selectedOptionIndex];

    const newAttempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      subtest: currentQuestion.subtest,
      archetype: currentQuestion.archetype,
      difficulty: currentQuestion.difficulty,
      selectedOptionIndex,
      correctOptionIndex: currentQuestion.correctIndex,
      isCorrect,
      timeSpentSeconds: timeSpent,
      hintsUsed: 0,
      trapIdentified: isCorrect ? undefined : pickedOption.trapType,
      timestamp: Date.now(),
    };

    const nextAttempts = {
      ...attempts,
      [currentQuestion.id]: newAttempt,
    };
    setAttempts(nextAttempts);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      questionStartTimeRef.current = Date.now();
    } else {
      finishSession(nextAttempts);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      {/* Top Header Bar: Question Counter, Countdown Timer, Exit */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-xs">
        {/* Left: Question Counter */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-extrabold flex items-center justify-center text-sm shadow-inner">
            N
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              {subtest} Assessment
            </div>
          </div>
        </div>

        {/* Center: Timer */}
        <div
          data-testid="exam-timer"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-black font-mono shadow-xs ${
            timeLeft < 300
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Right: Exit Button */}
        <div>
          <button
            onClick={() => setShowConfirmExit(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Exit Exam"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Split-Stage Canvas */}
      <main className="flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto p-4 sm:p-6 gap-4">
        {/* Top 60%: Stimulus Canvas with Prominent Question Mark */}
        <div className="flex-1 min-h-[260px] sm:min-h-[340px] bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <StimulusRenderer
            question={currentQuestion}
            showHighlight={false}
            showHiddenXRay={false}
            showWordLabels={true}
          />
        </div>

        {/* Bottom 40%: Tactile Option Cards & Forward Navigation Button */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-4">
          {/* Option Cards Grid */}
          <div
            className={`flex-1 grid gap-2.5 sm:gap-3 w-full ${
              currentQuestion.options.length === 6
                ? 'grid-cols-3 sm:grid-cols-6'
                : 'grid-cols-5'
            }`}
          >
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              return (
                <button
                  key={option.id ?? idx}
                  data-testid={`exam-option-${idx}`}
                  aria-pressed={isSelected ? 'true' : 'false'}
                  onClick={() => handleSelectOption(idx)}
                  className={`h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-between p-2 transition-all relative outline-none shadow-xs cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 border-3 border-blue-600 shadow-md ring-4 ring-blue-100 scale-[1.02]'
                      : 'bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Option Label Badge (A–E or A–F) */}
                  <span
                    className={`text-xs font-black rounded-md px-1.5 py-0.5 leading-none ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {option.label}
                  </span>

                  {/* Option Visual Content */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-1">
                    <GeometricShapeSVG visual={option.visual} size="100%" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Forward Navigation Button (➔) */}
          <button
            data-testid="exam-next-btn"
            disabled={selectedOptionIndex === null}
            onClick={handleNext}
            className={`w-full sm:w-28 h-14 sm:h-28 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-lg transition-all shadow-md select-none cursor-pointer ${
              selectedOptionIndex !== null
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <ArrowRight className="w-6 h-6 stroke-[3]" />
            <span className="text-xs uppercase tracking-wider">
              {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </span>
          </button>
        </div>
      </main>

      {/* Exit Confirmation Dialog */}
      {showConfirmExit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              Leave Mock Exam?
            </h3>
            <p className="text-xs text-gray-600 mb-6">
              Your test timer is running. If you leave now, uncompleted questions will be marked skipped.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
              >
                Keep Testing
              </button>
              <button
                onClick={onExitExam}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Exit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
