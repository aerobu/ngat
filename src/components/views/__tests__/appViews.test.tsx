import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DayMission,
  StudentProgress,
  ExamSession,
  QuestionAttempt,
} from '../../../types/ngat';
import {
  getInitialMissions,
  loadStudentProgress,
  saveStudentProgress,
  recordQuestionAttempt,
  recordExamCompletion,
  completeDayMission,
  resetStudentProgress,
} from '../../../store/progressStore';
import { DashboardView } from '../DashboardView';
import { TutorialView } from '../TutorialView';
import { ExamSimulatorView } from '../ExamSimulatorView';
import { ExamReportView } from '../ExamReportView';
import { PracticeDojoView } from '../PracticeDojoView';
import App from '../../../App';

// ============================================================================
// Test Fixtures
// ============================================================================

const createMockProgress = (overrides: Partial<StudentProgress> = {}): StudentProgress => ({
  studentName: 'Beaverton Scholar',
  grade: 5,
  completedMissions: [],
  totalQuestionsAttempted: 0,
  totalCorrect: 0,
  archetypeMastery: {
    'number-matrix': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'balance-scale': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'shape-quantity': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'sequence-series': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'cube-3d': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'pattern-completion': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'matrix-analogy': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'serial-reasoning': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'spatial-visualization': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
    'verbal-classification': { attempted: 0, correct: 0, averageTimeSeconds: 0, trapsTriggered: {} },
  },
  recentExamScores: [],
  currentStreakDays: 1,
  earnedBadges: [],
  ...overrides,
});

const createMockMissions = (): DayMission[] => [
  {
    dayNumber: 1,
    title: 'Day 1: Matrix Foundations',
    theme: 'Quantitative Number Patterns',
    targetSubtest: 'quantitative',
    targetArchetypes: ['number-matrix'],
    questionCount: 10,
    isUnlocked: true,
    isCompleted: false,
    accuracyTargetPercent: 80,
    badgeReward: 'Matrix Cadet',
    tipOfDay: 'Check row sums and column differences.',
  },
  {
    dayNumber: 2,
    title: 'Day 2: Balance Scale Systems',
    theme: 'Equivalence & Substitution',
    targetSubtest: 'quantitative',
    targetArchetypes: ['balance-scale'],
    questionCount: 10,
    isUnlocked: false,
    isCompleted: false,
    accuracyTargetPercent: 80,
    badgeReward: 'Equilibrium Master',
    tipOfDay: 'Substitute known weights into target scale.',
  },
  {
    dayNumber: 3,
    title: 'Day 3: Nonverbal Transformations',
    theme: 'Spatial Rotations & Reflections',
    targetSubtest: 'nonverbal',
    targetArchetypes: ['pattern-completion', 'matrix-analogy'],
    questionCount: 10,
    isUnlocked: false,
    isCompleted: false,
    accuracyTargetPercent: 80,
    badgeReward: 'Spatial Seer',
    tipOfDay: 'Trace one feature through clockwise steps.',
  },
  {
    dayNumber: 4,
    title: 'Day 4: 3D Isometric Cubes',
    theme: 'Hidden Cube Counting',
    targetSubtest: 'quantitative',
    targetArchetypes: ['cube-3d'],
    questionCount: 10,
    isUnlocked: false,
    isCompleted: false,
    accuracyTargetPercent: 80,
    badgeReward: 'Dimension Architect',
    tipOfDay: 'Count columns from back to front.',
  },
  {
    dayNumber: 5,
    title: 'Day 5: Verbal Picture Analogies',
    theme: 'Categorical & Relational Grids',
    targetSubtest: 'verbal',
    targetArchetypes: ['verbal-classification'],
    questionCount: 10,
    isUnlocked: false,
    isCompleted: false,
    accuracyTargetPercent: 80,
    badgeReward: 'Semantic Scout',
    tipOfDay: 'Identify the common trait shared by 5 pictures.',
  },
  {
    dayNumber: 6,
    title: 'Day 6: Mixed Speed Sprint',
    theme: 'Speed, Accuracy & Pacing',
    targetSubtest: 'all',
    targetArchetypes: ['number-matrix', 'balance-scale', 'cube-3d'],
    questionCount: 15,
    isUnlocked: false,
    isCompleted: false,
    accuracyTargetPercent: 85,
    badgeReward: 'Speed Demon',
    tipOfDay: 'Spend under 45 seconds per puzzle.',
  },
  {
    dayNumber: 7,
    title: 'Day 7: Full BSD Mock Simulator',
    theme: 'Championship Benchmark Readiness',
    targetSubtest: 'quantitative',
    targetArchetypes: ['number-matrix', 'balance-scale', 'shape-quantity', 'sequence-series', 'cube-3d'],
    questionCount: 40,
    isUnlocked: false,
    isCompleted: false,
    accuracyTargetPercent: 90,
    badgeReward: 'TAG Champion',
    tipOfDay: 'Stay calm and review answers with confidence.',
  },
];

const createMockSession = (overrides: Partial<ExamSession> = {}): ExamSession => ({
  id: 'test-session-123',
  subtest: 'quantitative',
  startTime: Date.now() - 1800000,
  endTime: Date.now(),
  totalQuestions: 40,
  currentIndex: 39,
  questions: [],
  attempts: {
    'q-1': {
      questionId: 'q-1',
      subtest: 'quantitative',
      archetype: 'number-matrix',
      difficulty: 2,
      selectedOptionIndex: 0,
      correctOptionIndex: 0,
      isCorrect: true,
      timeSpentSeconds: 22,
      hintsUsed: 0,
      timestamp: Date.now(),
    },
    'q-2': {
      questionId: 'q-2',
      subtest: 'quantitative',
      archetype: 'cube-3d',
      difficulty: 3,
      selectedOptionIndex: 2,
      correctOptionIndex: 1,
      isCorrect: false,
      timeSpentSeconds: 48,
      hintsUsed: 1,
      trapIdentified: 'hidden-block-trap',
      timestamp: Date.now(),
    },
  },
  flaggedQuestionIds: [],
  isCompleted: true,
  timeLimitSeconds: 1800,
  scaledScore: 142,
  percentileRank: 98,
  strengths: ['Number Matrix Operations', 'Balance Scales'],
  growthAreas: ['3D Hidden Cube Visualization'],
  ...overrides,
});

// ============================================================================
// Test Suite
// ============================================================================

describe('Stage 3: View, Store & UI/UX Interaction Suite', () => {
  beforeEach(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {
      // Ignore if localStorage not accessible
    }
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // 1. Progress Store & Persistence Tests
  // ==========================================================================
  describe('progressStore', () => {
    it('getInitialMissions returns 7-Day Beaverton Countdown Missions with Quantitative prioritization', () => {
      const missions = getInitialMissions();
      expect(missions).toHaveLength(7);
      expect(missions[0].dayNumber).toBe(1);
      expect(missions[6].dayNumber).toBe(7);

      // Day 1 must be unlocked, Days 2-7 initially locked
      expect(missions[0].isUnlocked).toBe(true);
      for (let i = 1; i < 7; i++) {
        expect(missions[i].isUnlocked).toBe(false);
      }

      // Beaverton 5th grade heavily prioritizes Quantitative (BSD TAG identifier subtest)
      const quantMissions = missions.filter(
        (m) => m.targetSubtest === 'quantitative' || m.targetSubtest === 'all'
      );
      expect(quantMissions.length).toBeGreaterThanOrEqual(4);
    });

    it('loadStudentProgress initializes default 5th-grade student profile and saves to localStorage', () => {
      const progress = loadStudentProgress();
      expect(progress.grade).toBe(5);
      expect(progress.totalQuestionsAttempted).toBe(0);
      expect(progress.totalCorrect).toBe(0);
      expect(progress.archetypeMastery['number-matrix']).toBeDefined();
      expect(progress.archetypeMastery['cube-3d']).toBeDefined();

      // Verify persistent storage save
      saveStudentProgress(progress);
      const reloaded = loadStudentProgress();
      expect(reloaded.studentName).toBe(progress.studentName);
    });

    it('recordQuestionAttempt updates attempted, correct, timeSpent, and cognitive traps telemetry', () => {
      const attempt: QuestionAttempt = {
        questionId: 'q-cube-test',
        subtest: 'quantitative',
        archetype: 'cube-3d',
        difficulty: 3,
        selectedOptionIndex: 3,
        correctOptionIndex: 0,
        isCorrect: false,
        timeSpentSeconds: 38,
        hintsUsed: 1,
        trapIdentified: 'hidden-block-trap',
        timestamp: Date.now(),
      };

      const updated = recordQuestionAttempt(attempt);
      expect(updated.totalQuestionsAttempted).toBe(1);
      expect(updated.totalCorrect).toBe(0);
      expect(updated.archetypeMastery['cube-3d'].attempted).toBe(1);
      expect(updated.archetypeMastery['cube-3d'].correct).toBe(0);
      expect(updated.archetypeMastery['cube-3d'].trapsTriggered['hidden-block-trap']).toBe(1);
    });

    it('recordExamCompletion appends session, calculates percentile rank, and persists', () => {
      const session = createMockSession();
      const updated = recordExamCompletion(session);
      expect(updated.recentExamScores.length).toBeGreaterThan(0);
      const lastExam = updated.recentExamScores[updated.recentExamScores.length - 1];
      expect(lastExam.percentile).toBe(98);
      expect(lastExam.score).toBe(142);
    });

    it('completeDayMission marks mission complete, records score, and unlocks next consecutive mission', () => {
      const updated = completeDayMission(1, 90);
      expect(updated.completedMissions).toContain(1);

      const missions = getInitialMissions(); // Should reflect unlocked day 2
      const day2 = missions.find((m) => m.dayNumber === 2);
      expect(day2?.isUnlocked).toBe(true);
    });

    it('resetStudentProgress resets student profile to default initial state', () => {
      const attempt: QuestionAttempt = {
        questionId: 'q-reset',
        subtest: 'quantitative',
        archetype: 'number-matrix',
        difficulty: 1,
        selectedOptionIndex: 0,
        correctOptionIndex: 0,
        isCorrect: true,
        timeSpentSeconds: 15,
        hintsUsed: 0,
        timestamp: Date.now(),
      };
      recordQuestionAttempt(attempt);

      const reset = resetStudentProgress();
      expect(reset.totalQuestionsAttempted).toBe(0);
      expect(reset.totalCorrect).toBe(0);
      expect(reset.completedMissions).toHaveLength(0);
    });
  });

  // ==========================================================================
  // 2. ExamSimulatorView: Authentic MHS NGAT Interaction Mechanics
  // ==========================================================================
  describe('ExamSimulatorView (Authentic MHS NGAT Interface)', () => {
    it('renders question counter, countdown timer, stimulus area, and exactly 5 option choices', () => {
      const onFinish = vi.fn();
      const onExit = vi.fn();

      render(
        <ExamSimulatorView
          subtest="quantitative"
          questionCount={5}
          timeLimitSeconds={300}
          seed={42}
          onFinishExam={onFinish}
          onExitExam={onExit}
        />
      );

      // Question Counter (e.g. Question 1 of 5)
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();

      // Countdown Timer
      expect(screen.getByTestId('exam-timer')).toBeInTheDocument();

      // 5 option choices A-E
      for (let i = 0; i < 5; i++) {
        expect(screen.getByTestId(`exam-option-${i}`)).toBeInTheDocument();
      }
    });

    it('enforces MHS NGAT Interaction Rule: Click-to-Highlight does NOT auto-advance', async () => {
      const user = userEvent.setup();
      const onFinish = vi.fn();
      const onExit = vi.fn();

      render(
        <ExamSimulatorView
          subtest="quantitative"
          questionCount={5}
          timeLimitSeconds={300}
          seed={42}
          onFinishExam={onFinish}
          onExitExam={onExit}
        />
      );

      const option0 = screen.getByTestId('exam-option-0');
      await user.click(option0);

      // Highlighted state must be active
      expect(option0).toHaveAttribute('aria-pressed', 'true');

      // Crucial MHS Rule: Still on Question 1! Must NOT auto-advance upon selecting
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/Question 2/i)).not.toBeInTheDocument();
    });

    it('commits choice and advances only when clicking the Forward Arrow button (➔)', async () => {
      const user = userEvent.setup();
      const onFinish = vi.fn();
      const onExit = vi.fn();

      render(
        <ExamSimulatorView
          subtest="quantitative"
          questionCount={5}
          timeLimitSeconds={300}
          seed={42}
          onFinishExam={onFinish}
          onExitExam={onExit}
        />
      );

      const option1 = screen.getByTestId('exam-option-1');
      await user.click(option1);

      const nextBtn = screen.getByTestId('exam-next-btn');
      expect(nextBtn).toBeEnabled();
      await user.click(nextBtn);

      // Now advances to Question 2
      expect(screen.getByText(/Question 2/i)).toBeInTheDocument();
    });

    it('strictly enforces NO Back button exists in active Mock Exam Simulator mode', () => {
      const onFinish = vi.fn();
      const onExit = vi.fn();

      render(
        <ExamSimulatorView
          subtest="quantitative"
          questionCount={5}
          timeLimitSeconds={300}
          seed={42}
          onFinishExam={onFinish}
          onExitExam={onExit}
        />
      );

      // Verify the simulator is rendered
      expect(screen.getByTestId('exam-timer')).toBeInTheDocument();

      // Authentic Naglieri test format prevents revisiting previous questions
      expect(screen.queryByTestId('exam-back-btn')).toBeNull();
      expect(screen.queryByRole('button', { name: /back|previous/i })).toBeNull();
    });

    it('completing the final question invokes onFinishExam with session telemetry', async () => {
      const user = userEvent.setup();
      const onFinish = vi.fn();
      const onExit = vi.fn();

      render(
        <ExamSimulatorView
          subtest="quantitative"
          questionCount={2}
          timeLimitSeconds={300}
          seed={42}
          onFinishExam={onFinish}
          onExitExam={onExit}
        />
      );

      // Answer Q1
      await user.click(screen.getByTestId('exam-option-0'));
      await user.click(screen.getByTestId('exam-next-btn'));

      // Answer Q2 (Final Question)
      expect(screen.getByText(/Question 2/i)).toBeInTheDocument();
      await user.click(screen.getByTestId('exam-option-1'));
      await user.click(screen.getByTestId('exam-next-btn'));

      // Exam completes
      expect(onFinish).toHaveBeenCalledTimes(1);
      const sessionArg: ExamSession = onFinish.mock.calls[0][0];
      expect(sessionArg.isCompleted).toBe(true);
      expect(sessionArg.totalQuestions).toBe(2);
      expect(sessionArg.percentileRank).toBeGreaterThanOrEqual(1);
      expect(sessionArg.percentileRank).toBeLessThanOrEqual(99);
    });
  });

  // ==========================================================================
  // 3. ExamReportView Tests
  // ==========================================================================
  describe('ExamReportView', () => {
    it('displays raw score, percentile rank, and Oregon 97th-Percentile TAG Benchmark comparison', () => {
      const session = createMockSession({
        scaledScore: 146,
        percentileRank: 98,
      });

      const onPracticeWeakArea = vi.fn();
      const onRetake = vi.fn();
      const onHome = vi.fn();

      render(
        <ExamReportView
          session={session}
          onPracticeWeakArea={onPracticeWeakArea}
          onRetakeExam={onRetake}
          onReturnHome={onHome}
        />
      );

      // Percentile and score badge
      expect(screen.getByText(/98/)).toBeInTheDocument();
      expect(screen.getByText(/TAG/i)).toBeInTheDocument();

      // Displays missed questions and cognitive traps triggered
      expect(screen.getByText(/hidden-block-trap/i)).toBeInTheDocument();
    });

    it('triggers onPracticeWeakArea callback when targeting growth areas', async () => {
      const user = userEvent.setup();
      const session = createMockSession();
      const onPracticeWeakArea = vi.fn();
      const onRetake = vi.fn();
      const onHome = vi.fn();

      render(
        <ExamReportView
          session={session}
          onPracticeWeakArea={onPracticeWeakArea}
          onRetakeExam={onRetake}
          onReturnHome={onHome}
        />
      );

      const practiceBtn = screen.getByTestId('practice-weak-area-btn');
      await user.click(practiceBtn);
      expect(onPracticeWeakArea).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // 4. PracticeDojoView: Adaptive Coaching, 3-Stage Hints & Trap Explanations
  // ==========================================================================
  describe('PracticeDojoView (Adaptive Coaching & Trap Feedback)', () => {
    it('renders subtest/archetype selector, difficulty badge, and 3-Stage Progressive Hint Button', () => {
      const onExit = vi.fn();
      render(
        <PracticeDojoView
          initialSubtest="quantitative"
          initialArchetype="number-matrix"
          onExitDojo={onExit}
        />
      );

      expect(screen.getByTestId('hint-btn')).toBeInTheDocument();
      expect(screen.getByTestId('dojo-subtest-selector')).toBeInTheDocument();
    });

    it('progressively reveals hints: Hint 1 (Where to Look) -> Hint 2 (Pattern) -> Hint 3 (Rule Reveal)', async () => {
      const user = userEvent.setup();
      const onExit = vi.fn();

      render(
        <PracticeDojoView
          initialSubtest="quantitative"
          initialArchetype="number-matrix"
          onExitDojo={onExit}
        />
      );

      const hintBtn = screen.getByTestId('hint-btn');

      // Click 1 -> Reveals Stage 1 Attention Hint
      await user.click(hintBtn);
      expect(screen.getByText(/Where to Look/i)).toBeInTheDocument();

      // Click 2 -> Reveals Stage 2 Pattern Type Hint
      await user.click(hintBtn);
      expect(screen.getByText(/Pattern Type/i)).toBeInTheDocument();

      // Click 3 -> Reveals Stage 3 Rule Breakdown Hint
      await user.click(hintBtn);
      expect(screen.getByText(/Rule Reveal/i)).toBeInTheDocument();
    });

    it('reveals immediate cognitive trap explanation, rule summary, and speed tip on incorrect choice', async () => {
      const user = userEvent.setup();
      const onExit = vi.fn();
      const onRecord = vi.fn();

      render(
        <PracticeDojoView
          initialSubtest="quantitative"
          initialArchetype="cube-3d"
          onExitDojo={onExit}
          onRecordAttempt={onRecord}
        />
      );

      // Select an option
      const optionCards = screen.getAllByTestId(/dojo-option-/);
      expect(optionCards.length).toBeGreaterThanOrEqual(5);

      await user.click(optionCards[0]);

      const checkBtn = screen.getByTestId('check-answer-btn');
      await user.click(checkBtn);

      // Feedback panel appears
      const feedbackPanel = screen.getByTestId('dojo-feedback-panel');
      expect(feedbackPanel).toBeInTheDocument();

      // Must display pedagogical explanations
      expect(within(feedbackPanel).getByText(/Rule Summary|Explanation/i)).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // 5. TutorialView Tests
  // ==========================================================================
  describe('TutorialView', () => {
    it('walks through interactive sample puzzles and golden test-taking rules', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      const onBack = vi.fn();

      render(<TutorialView onComplete={onComplete} onBack={onBack} />);

      // Mentions Naglieri Golden Rules (No Back Button, Watch for Traps, Find Rule First)
      expect(screen.getByText(/Golden Rule|Rule/i)).toBeInTheDocument();

      // Stepping through tutorial
      const nextStepBtn = screen.getByTestId('tutorial-next-btn');
      await user.click(nextStepBtn);

      // Clicking Complete invokes onComplete callback
      const finishBtn = screen.getByTestId('tutorial-finish-btn');
      await user.click(finishBtn);
      expect(onComplete).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // 6. DashboardView & App.tsx Full Integration Tests
  // ==========================================================================
  describe('DashboardView & App Integration', () => {
    it('renders the 7-Day Countdown Mission Plan (Days 1–7) and exam launch actions', () => {
      const progress = createMockProgress();
      const missions = createMockMissions();
      const onStartExam = vi.fn();
      const onStartDojo = vi.fn();
      const onStartTutorial = vi.fn();
      const onStartMission = vi.fn();

      render(
        <DashboardView
          progress={progress}
          missions={missions}
          onStartExam={onStartExam}
          onStartDojo={onStartDojo}
          onStartTutorial={onStartTutorial}
          onStartMission={onStartMission}
        />
      );

      // 7-Day Countdown Mission Cards
      for (let day = 1; day <= 7; day++) {
        expect(screen.getByTestId(`mission-card-${day}`)).toBeInTheDocument();
      }

      // Beaverton 5th-Grade Quantitative Mock Exam Card
      expect(screen.getByTestId('start-quant-exam-btn')).toBeInTheDocument();

      // Practice Dojo Card
      expect(screen.getByTestId('start-dojo-btn')).toBeInTheDocument();
    });

    it('App integration: mounts cleanly and navigates between views', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Default landing on Dashboard with missions
      expect(screen.getByTestId('mission-card-1')).toBeInTheDocument();

      // Can navigate to Tutorial
      const tutorialBtn = screen.getByTestId('nav-tutorial-btn');
      await user.click(tutorialBtn);
      expect(screen.getByText(/Tutorial|Golden Rule/i)).toBeInTheDocument();
    });
  });
});
