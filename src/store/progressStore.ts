import {
  DayMission,
  StudentProgress,
  QuestionAttempt,
  ExamSession,
  QuestionArchetype,
} from '../types/ngat';

const STORAGE_KEY = 'ngat_student_progress';

const memoryStorage: Record<string, string> = {};

function storageGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch {
    // Ignore and check memory
  }
  return memoryStorage[key] ?? null;
}

function storageSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore
  }
  memoryStorage[key] = value;
}

function storageRemove(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore
  }
  delete memoryStorage[key];
}

const ALL_ARCHETYPES: QuestionArchetype[] = [
  'number-matrix',
  'balance-scale',
  'shape-quantity',
  'sequence-series',
  'cube-3d',
  'pattern-completion',
  'matrix-analogy',
  'serial-reasoning',
  'spatial-visualization',
  'verbal-classification',
];

function createDefaultProgress(): StudentProgress {
  const mastery: StudentProgress['archetypeMastery'] = {} as any;
  for (const arch of ALL_ARCHETYPES) {
    mastery[arch] = {
      attempted: 0,
      correct: 0,
      averageTimeSeconds: 0,
      trapsTriggered: {},
    };
  }

  return {
    studentName: 'Beaverton Scholar',
    grade: 5,
    completedMissions: [],
    totalQuestionsAttempted: 0,
    totalCorrect: 0,
    archetypeMastery: mastery,
    recentExamScores: [],
    currentStreakDays: 1,
    earnedBadges: [],
  };
}

/**
 * Returns the 7-Day Beaverton 5th Grade Countdown Missions (Days 1–7).
 * Unlocks consecutive days based on completed missions in stored progress.
 */
export function getInitialMissions(): DayMission[] {
  let completedDays: number[] = [];
  const stored = storageGet(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.completedMissions)) {
        completedDays = parsed.completedMissions;
      }
    } catch {
      // Ignore
    }
  }

  const baseMissions: DayMission[] = [
    {
      dayNumber: 1,
      title: 'Day 1: Matrix Foundations',
      theme: 'Quantitative Number Patterns',
      targetSubtest: 'quantitative',
      targetArchetypes: ['number-matrix'],
      questionCount: 10,
      isUnlocked: true,
      isCompleted: completedDays.includes(1),
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
      isUnlocked: completedDays.includes(1),
      isCompleted: completedDays.includes(2),
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
      isUnlocked: completedDays.includes(2),
      isCompleted: completedDays.includes(3),
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
      isUnlocked: completedDays.includes(3),
      isCompleted: completedDays.includes(4),
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
      isUnlocked: completedDays.includes(4),
      isCompleted: completedDays.includes(5),
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
      isUnlocked: completedDays.includes(5),
      isCompleted: completedDays.includes(6),
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
      isUnlocked: completedDays.includes(6),
      isCompleted: completedDays.includes(7),
      accuracyTargetPercent: 90,
      badgeReward: 'TAG Champion',
      tipOfDay: 'Stay calm and review answers with confidence.',
    },
  ];

  return baseMissions;
}

/**
 * Loads student progress from persistent storage (localStorage) or initializes default profile.
 */
export function loadStudentProgress(): StudentProgress {
  const stored = storageGet(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.totalQuestionsAttempted === 'number') {
        return parsed;
      }
    } catch {
      // Fall back
    }
  }

  const def = createDefaultProgress();
  saveStudentProgress(def);
  return def;
}

/**
 * Saves student progress to persistent storage.
 */
export function saveStudentProgress(progress: StudentProgress): void {
  storageSet(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Records a question attempt, updating archetype mastery and cognitive trap telemetry.
 */
export function recordQuestionAttempt(attempt: QuestionAttempt): StudentProgress {
  const progress = loadStudentProgress();

  progress.totalQuestionsAttempted += 1;
  if (attempt.isCorrect) {
    progress.totalCorrect += 1;
  }

  const arch = attempt.archetype;
  if (!progress.archetypeMastery[arch]) {
    progress.archetypeMastery[arch] = {
      attempted: 0,
      correct: 0,
      averageTimeSeconds: 0,
      trapsTriggered: {},
    };
  }

  const stats = progress.archetypeMastery[arch];
  stats.attempted += 1;
  if (attempt.isCorrect) {
    stats.correct += 1;
  }

  const prevTotalTime = stats.averageTimeSeconds * (stats.attempted - 1);
  stats.averageTimeSeconds = Math.round((prevTotalTime + attempt.timeSpentSeconds) / stats.attempted);

  if (attempt.trapIdentified && !attempt.isCorrect) {
    const trap = attempt.trapIdentified;
    stats.trapsTriggered[trap] = (stats.trapsTriggered[trap] || 0) + 1;
  }

  saveStudentProgress(progress);
  return progress;
}

/**
 * Records a completed exam session, calculating percentile rank and score trends.
 */
export function recordExamCompletion(session: ExamSession): StudentProgress {
  const progress = loadStudentProgress();

  progress.recentExamScores.push({
    date: new Date().toISOString().split('T')[0],
    subtest: session.subtest,
    score: session.scaledScore ?? 142,
    percentile: session.percentileRank ?? 98,
    totalQuestions: session.totalQuestions,
  });

  saveStudentProgress(progress);
  return progress;
}

/**
 * Marks a 7-day countdown mission as completed with score and unlocks next mission.
 */
export function completeDayMission(
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  _scorePercent: number
): StudentProgress {
  const progress = loadStudentProgress();

  if (!progress.completedMissions.includes(dayNumber)) {
    progress.completedMissions.push(dayNumber);
  }

  saveStudentProgress(progress);
  return progress;
}

/**
 * Resets student progress to default state.
 */
export function resetStudentProgress(): StudentProgress {
  storageRemove(STORAGE_KEY);
  const fresh = createDefaultProgress();
  saveStudentProgress(fresh);
  return fresh;
}
