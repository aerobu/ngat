import React from 'react';
import {
  StudentProgress,
  DayMission,
  SubtestType,
  QuestionArchetype,
} from '../../types/ngat';
import {
  Award,
  Zap,
  Target,
  Play,
  Lock,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Flame,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export interface DashboardViewProps {
  progress: StudentProgress;
  missions: DayMission[];
  onStartExam: (subtest: SubtestType | 'mixed', count?: number) => void;
  onStartDojo: (subtest?: SubtestType, archetype?: QuestionArchetype) => void;
  onStartTutorial: () => void;
  onStartMission: (mission: DayMission) => void;
  onResetProgress?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  missions,
  onStartExam,
  onStartDojo,
  onStartTutorial,
  onStartMission,
  onResetProgress,
}) => {
  const overallAccuracy =
    progress.totalQuestionsAttempted > 0
      ? Math.round((progress.totalCorrect / progress.totalQuestionsAttempted) * 100)
      : 0;

  const completedMissionCount = progress.completedMissions?.length || 0;
  const recentExam = progress.recentExamScores?.[progress.recentExamScores.length - 1];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Student Header Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-blue-400">
              {progress.studentName.charAt(0) || 'B'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {progress.studentName}
                </h1>
                <span className="text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Grade {progress.grade} TAG Candidate
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Beaverton School District • Naglieri General Ability Test Prep
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <div>
                <span className="block text-xs font-black text-amber-900">
                  {progress.currentStreakDays} Day Streak
                </span>
                <span className="text-[10px] text-amber-700 font-bold">Countdown Active</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="block text-xs font-black text-emerald-900">
                  {progress.totalCorrect} / {progress.totalQuestionsAttempted} Solved
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">
                  {overallAccuracy}% Accuracy
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-3.5 py-2 rounded-2xl">
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <span className="block text-xs font-black text-purple-900">
                  {completedMissionCount} / 7 Missions
                </span>
                <span className="text-[10px] text-purple-700 font-bold">Prep Progress</span>
              </div>
            </div>

            {onResetProgress && (
              <button
                onClick={onResetProgress}
                title="Reset local student progress"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Action Hero Cards (Mock Exam & Practice Dojo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Beaverton Quantitative Mock Exam Card */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full border border-blue-400/30">
                  BSD Identification Format
                </span>
                <Target className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Full BSD Quantitative Mock Exam
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                40 calibrated questions across 5 core quantitative archetypes with strict 30-minute timing, authentic MHS click-to-highlight ergonomics, and zero Back button.
              </p>
              {recentExam && (
                <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-xs flex items-center justify-between">
                  <span className="text-slate-300">Last Session Percentile:</span>
                  <span className="font-black text-amber-300 text-sm">
                    {recentExam.percentile}th Percentile (Scaled {recentExam.score})
                  </span>
                </div>
              )}
            </div>

            <div className="pt-6 relative z-10 space-y-2">
              <button
                data-testid="start-quant-exam-btn"
                onClick={() => onStartExam('quantitative', 40)}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Quantitative Mock (40 Questions)</span>
              </button>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <button
                  data-testid="start-nonverbal-exam-btn"
                  onClick={() => onStartExam('nonverbal', 30)}
                  className="py-2 px-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Nonverbal (30Q)
                </button>
                <button
                  data-testid="start-verbal-exam-btn"
                  onClick={() => onStartExam('verbal', 30)}
                  className="py-2 px-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Verbal (30Q)
                </button>
                <button
                  data-testid="start-mixed-exam-btn"
                  onClick={() => onStartExam('mixed', 40)}
                  className="py-2 px-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Full Mock (40Q)
                </button>
              </div>
            </div>
          </div>

          {/* Adaptive Practice Dojo Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  Targeted Skill Building
                </span>
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Adaptive Practice Dojo
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Infinite procedural puzzle drills with 3-stage progressive hints, visual rule overlays, step-by-step logic breakdowns, and cognitive trap analysis.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <button
                  onClick={() => onStartDojo('quantitative')}
                  className="bg-slate-50 hover:bg-blue-50 hover:border-blue-300 p-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
                >
                  <span className="block text-xs font-black text-blue-700">Quantitative</span>
                  <span className="text-[10px] text-gray-500 font-bold">5 Archetypes</span>
                </button>
                <button
                  onClick={() => onStartDojo('nonverbal')}
                  className="bg-slate-50 hover:bg-purple-50 hover:border-purple-300 p-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
                >
                  <span className="block text-xs font-black text-purple-700">Nonverbal</span>
                  <span className="text-[10px] text-gray-500 font-bold">4 Archetypes</span>
                </button>
                <button
                  onClick={() => onStartDojo('verbal')}
                  className="bg-slate-50 hover:bg-amber-50 hover:border-amber-300 p-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
                >
                  <span className="block text-xs font-black text-amber-700">Verbal</span>
                  <span className="text-[10px] text-gray-500 font-bold">Classification</span>
                </button>
              </div>
            </div>

            <div className="pt-6">
              <button
                data-testid="start-dojo-btn"
                onClick={() => onStartDojo()}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Enter Practice Dojo</span>
              </button>
            </div>
          </div>
        </div>

        {/* 7-Day Beaverton Countdown Mission Plan */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>7-Day Countdown Mission Plan</span>
              </h2>
              <p className="text-xs text-gray-500">
                Structured daily curriculum prioritizing Quantitative BSD TAG benchmarks.
              </p>
            </div>
            <button
              onClick={onStartTutorial}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Exam Tutorial & Rules</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((mission) => {
              const isCompleted = progress.completedMissions?.includes(mission.dayNumber) || mission.isCompleted;
              const isUnlocked = mission.isUnlocked || isCompleted;

              let cardBg = 'bg-white border-slate-200 hover:border-blue-300';
              if (isCompleted) {
                cardBg = 'bg-emerald-50/50 border-emerald-300';
              } else if (!isUnlocked) {
                cardBg = 'bg-gray-50 border-gray-200 opacity-75';
              }

              return (
                <div
                  key={mission.dayNumber}
                  data-testid={`mission-card-${mission.dayNumber}`}
                  className={`rounded-2xl p-5 border-2 shadow-2xs flex flex-col justify-between transition-all space-y-4 ${cardBg}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        Day {mission.dayNumber}
                      </span>
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </div>
                      ) : !isUnlocked ? (
                        <div className="flex items-center gap-1 text-gray-400 font-bold text-xs">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          Ready
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-gray-900 text-sm leading-snug">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {mission.theme}
                    </p>

                    <div className="text-[11px] text-gray-600 bg-white/70 p-2 rounded-xl border border-gray-200 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Questions:</span>
                        <span className="font-bold">{mission.questionCount} Puzzles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Accuracy:</span>
                        <span className="font-bold">{mission.accuracyTargetPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Badge Reward:</span>
                        <span className="font-bold text-blue-600">{mission.badgeReward}</span>
                      </div>
                    </div>

                    {mission.tipOfDay && (
                      <p className="text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-xl border border-amber-200/80 italic font-medium">
                        💡 {mission.tipOfDay}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    {isUnlocked ? (
                      <button
                        onClick={() => onStartMission(mission)}
                        className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                        }`}
                      >
                        <span>{isCompleted ? 'Review Mission' : 'Start Mission'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-xl text-center font-bold text-xs text-gray-400 bg-gray-100 cursor-not-allowed">
                        Complete Day {mission.dayNumber - 1} to Unlock
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
