import { useState, useEffect } from 'react';
import {
  DayMission,
  ExamSession,
  QuestionArchetype,
  QuestionAttempt,
  StudentProgress,
  SubtestType,
} from './types/ngat';
import {
  getInitialMissions,
  loadStudentProgress,
  recordQuestionAttempt,
  recordExamCompletion,
  completeDayMission,
  resetStudentProgress,
} from './store/progressStore';
import { DashboardView } from './components/views/DashboardView';
import { PracticeDojoView } from './components/views/PracticeDojoView';
import { ExamSimulatorView } from './components/views/ExamSimulatorView';
import { ExamReportView } from './components/views/ExamReportView';
import { TutorialView } from './components/views/TutorialView';
import {
  LayoutDashboard,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';

type AppView = 'dashboard' | 'exam' | 'report' | 'dojo' | 'tutorial';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [progress, setProgress] = useState<StudentProgress>(() => loadStudentProgress());
  const [missions, setMissions] = useState<DayMission[]>(() => getInitialMissions());

  // Exam state
  const [examConfig, setExamConfig] = useState<{
    subtest: SubtestType | 'mixed';
    count: number;
    seed?: number;
  }>({
    subtest: 'quantitative',
    count: 40,
  });
  const [lastExamSession, setLastExamSession] = useState<ExamSession | null>(null);

  // Dojo state
  const [dojoConfig, setDojoConfig] = useState<{
    subtest?: SubtestType;
    archetype?: QuestionArchetype;
    mission?: DayMission;
  }>({});

  // Re-sync missions with completed progress missions
  useEffect(() => {
    const freshMissions = getInitialMissions();
    setMissions(freshMissions);
  }, [progress]);

  // Handlers
  const handleStartExam = (subtest: SubtestType | 'mixed' = 'quantitative', count: number = 40) => {
    setExamConfig({ subtest, count, seed: Date.now() });
    setCurrentView('exam');
  };

  const handleFinishExam = (session: ExamSession) => {
    const updated = recordExamCompletion(session);
    setProgress(updated);
    setLastExamSession(session);
    setCurrentView('report');
  };

  const handleStartDojo = (subtest?: SubtestType, archetype?: QuestionArchetype) => {
    setDojoConfig({ subtest, archetype, mission: undefined });
    setCurrentView('dojo');
  };

  const handleStartMission = (mission: DayMission) => {
    setDojoConfig({
      subtest: mission.targetSubtest === 'all' ? 'quantitative' : mission.targetSubtest,
      archetype: mission.targetArchetypes?.[0],
      mission,
    });
    setCurrentView('dojo');
  };

  const handleCompleteMission = (dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7, scorePercent: number) => {
    const updated = completeDayMission(dayNumber, scorePercent);
    setProgress(updated);
  };

  const handleRecordAttempt = (attempt: QuestionAttempt) => {
    const updated = recordQuestionAttempt(attempt);
    setProgress(updated);
  };

  const handleStartTutorial = () => {
    setCurrentView('tutorial');
  };

  const handlePracticeWeakArea = () => {
    // If the last session identified growth areas or traps, target that archetype
    const missedAttempts = Object.values(lastExamSession?.attempts || {}).filter((a) => !a.isCorrect);
    const weakArchetype = missedAttempts[0]?.archetype || 'cube-3d';
    handleStartDojo('quantitative', weakArchetype);
  };

  const handleRetakeExam = () => {
    handleStartExam(examConfig.subtest, examConfig.count);
  };

  const handleReset = () => {
    const reset = resetStudentProgress();
    setProgress(reset);
    setMissions(getInitialMissions());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans">
      {/* Top Navigation Bar (Hidden during active Exam for authentic MHS focus) */}
      {currentView !== 'exam' && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs select-none">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-xs border border-blue-500 group-hover:scale-105 transition-transform">
                N
              </div>
              <div>
                <span className="font-black text-gray-900 text-sm tracking-tight block leading-tight">
                  NGAT Prep Master
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Beaverton 5th Grade TAG
                </span>
              </div>
            </button>

            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <button
                onClick={() => handleStartDojo()}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                  currentView === 'dojo'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Practice Dojo</span>
              </button>

              <button
                onClick={() => handleStartExam('quantitative', 40)}
                className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Target className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mock Exam</span>
              </button>

              <button
                data-testid="nav-tutorial-btn"
                onClick={handleStartTutorial}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                  currentView === 'tutorial'
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Exam Guide</span>
              </button>
            </nav>
          </div>
        </header>
      )}

      {/* Main Content Stage */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <DashboardView
            progress={progress}
            missions={missions}
            onStartExam={handleStartExam}
            onStartDojo={handleStartDojo}
            onStartTutorial={handleStartTutorial}
            onStartMission={handleStartMission}
            onResetProgress={handleReset}
          />
        )}

        {currentView === 'dojo' && (
          <PracticeDojoView
            initialSubtest={dojoConfig.subtest}
            initialArchetype={dojoConfig.archetype}
            mission={dojoConfig.mission}
            onCompleteMission={handleCompleteMission}
            onExitDojo={() => setCurrentView('dashboard')}
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {currentView === 'exam' && (
          <ExamSimulatorView
            subtest={examConfig.subtest}
            questionCount={examConfig.count}
            timeLimitSeconds={1800}
            seed={examConfig.seed}
            onFinishExam={handleFinishExam}
            onExitExam={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'report' && lastExamSession && (
          <ExamReportView
            session={lastExamSession}
            onPracticeWeakArea={handlePracticeWeakArea}
            onRetakeExam={handleRetakeExam}
            onReturnHome={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'tutorial' && (
          <TutorialView
            onComplete={() => handleStartDojo()}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  );
}
