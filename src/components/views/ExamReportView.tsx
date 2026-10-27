import React from 'react';
import { ExamSession } from '../../types/ngat';
import { Award, Target, RotateCcw, Home, ArrowRight, Zap, CheckCircle2, XCircle } from 'lucide-react';

export interface ExamReportViewProps {
  session: ExamSession;
  onPracticeWeakArea: () => void;
  onRetakeExam: () => void;
  onReturnHome: () => void;
}

export const ExamReportView: React.FC<ExamReportViewProps> = ({
  session,
  onPracticeWeakArea,
  onRetakeExam,
  onReturnHome,
}) => {
  const attemptsList = Object.values(session.attempts || {});
  const correctCount = attemptsList.filter((a) => a.isCorrect).length;
  const totalQuestions = session.totalQuestions || attemptsList.length || 1;
  const accuracyPercent = Math.round((correctCount / totalQuestions) * 100);

  const scaledScore = session.scaledScore ?? 142;
  const percentileRank = session.percentileRank ?? 98;
  const isTagQualified = percentileRank >= 97;

  // Identify missed attempts and cognitive traps
  const missedAttempts = attemptsList.filter((a) => !a.isCorrect);

  // Group traps triggered
  const trapCounts: Record<string, number> = {};
  missedAttempts.forEach((a) => {
    if (a.trapIdentified) {
      trapCounts[a.trapIdentified] = (trapCounts[a.trapIdentified] || 0) + 1;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Exam Complete • Diagnostic Scorecard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Beaverton NGAT Performance Report
            </h1>
          </div>
          <button
            onClick={onReturnHome}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Hero Scorecard: Percentile & Oregon TAG Benchmark */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center sm:text-left">
            {/* National Percentile Rank */}
            <div className="sm:border-r border-slate-200 sm:pr-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Estimated National Rank
              </span>
              <div className="text-5xl sm:text-6xl font-black text-blue-600 tracking-tight my-1">
                {percentileRank}
                <span className="text-2xl sm:text-3xl font-bold text-blue-400">th</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Percentile on 5th Grade NGAT Norms
              </p>
            </div>

            {/* Scaled Score & Accuracy */}
            <div className="sm:border-r border-slate-200 sm:px-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Naglieri Scaled Score
              </span>
              <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight my-1">
                {scaledScore}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {correctCount} of {totalQuestions} Correct ({accuracyPercent}%)
              </p>
            </div>

            {/* Oregon 97th-Percentile TAG Benchmark Status */}
            <div className="sm:pl-6 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 mb-2">
                <Award className={`w-5 h-5 ${isTagQualified ? 'text-amber-500' : 'text-blue-600'}`} />
                <span className="text-xs font-black uppercase tracking-wider text-gray-800">
                  Oregon TAG Benchmark
                </span>
              </div>

              {isTagQualified ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 w-full text-emerald-900 text-xs font-bold flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="block font-black text-emerald-800">
                      97th% Qualifier Met!
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700">
                      Meets Beaverton Talented & Gifted standard.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 w-full text-amber-900 text-xs font-bold flex items-center gap-2.5">
                  <Target className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="block font-black text-amber-800">
                      Target: 97th Percentile
                    </span>
                    <span className="text-[11px] font-medium text-amber-700">
                      Just {Math.max(1, 97 - percentileRank)} percentile points to qualifying ceiling!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cognitive Trap Diagnostics & Growth Areas */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Cognitive Trap Analysis & Missed Questions</span>
              </h2>
              <p className="text-xs text-gray-500">
                Understanding why you picked a distractor turns mistakes into permanent breakthroughs.
              </p>
            </div>
            <button
              data-testid="practice-weak-area-btn"
              onClick={onPracticeWeakArea}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Practice Weak Areas in Dojo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {missedAttempts.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-base font-black text-emerald-900">
                Flawless Performance! 100% Accuracy
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                Zero cognitive traps triggered. You solved every item with championship precision.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {missedAttempts.map((attempt, idx) => {
                const question = session.questions?.find((q) => q.id === attempt.questionId);
                const trapName = attempt.trapIdentified ?? 'distractor';
                const pickedOption = question?.options[attempt.selectedOptionIndex];

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span className="text-xs font-bold text-gray-900">
                          {question ? `${question.archetype} • Difficulty Level ${question.difficulty}` : `Question #${idx + 1}`}
                        </span>
                        <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200">
                          {trapName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 pl-6">
                        {pickedOption?.trapExplanation ??
                          'Selected a plausible cognitive trap without checking all row/column rules.'}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5 self-end sm:self-center pl-6 sm:pl-0">
                      <span>Spent: {attempt.timeSpentSeconds}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={onRetakeExam}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-300 text-gray-800 font-black text-xs hover:bg-gray-50 transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
            <span>Retake Mock Exam</span>
          </button>

          <button
            onClick={onReturnHome}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Mission Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
