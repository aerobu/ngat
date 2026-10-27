/**
 * NGAT (Naglieri General Ability Tests) 5th Grade Prep Suite
 * Comprehensive Type Definitions for Nonverbal, Quantitative, and Verbal Subtests.
 */

// ============================================================================
// Core Taxonomy & Subtests
// ============================================================================

export type SubtestType = 'quantitative' | 'nonverbal' | 'verbal';

export type QuantitativeArchetype =
  | 'number-matrix'
  | 'balance-scale'
  | 'shape-quantity'
  | 'sequence-series'
  | 'cube-3d';

export type NonverbalArchetype =
  | 'pattern-completion'
  | 'matrix-analogy'
  | 'serial-reasoning'
  | 'spatial-visualization';

export type VerbalArchetype =
  | 'verbal-classification';

export type QuestionArchetype =
  | QuantitativeArchetype
  | NonverbalArchetype
  | VerbalArchetype;

/**
 * 1: Fundamental / Warm-up (grade level baseline)
 * 2: Intermediate (typical NGAT 5th grade level)
 * 3: Advanced (gifted / high cognitive load)
 * 4: TAG Challenge (97th+ percentile talent & gifted challenge)
 */
export type DifficultyLevel = 1 | 2 | 3 | 4;

export type CognitiveTrapType =
  | 'correct'
  | 'row-only-trap'
  | 'col-only-trap'
  | 'wrong-operation'
  | 'off-by-one'
  | 'visual-surface-trap'
  | 'hidden-block-trap'
  | 'rotation-direction-trap'
  | 'superficial-category-trap'
  | 'distractor';

// ============================================================================
// Visual Shapes, Fills, & Cell Visual Payloads (for SVG Rendering)
// ============================================================================

export type ShapeType =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'hexagon'
  | 'star'
  | 'cross'
  | 'pentagon'
  | 'heart'
  | 'trapezoid'
  | 'arrow-up'
  | 'arrow-right'
  | 'arrow-down'
  | 'arrow-left'
  | 'semicircle'
  | 'cube-block';

export type FillType =
  | 'solid'
  | 'empty'
  | 'striped-h'
  | 'striped-v'
  | 'striped-diagonal'
  | 'dotted'
  | 'half-top'
  | 'half-bottom'
  | 'half-left'
  | 'half-right'
  | 'checkerboard';

export interface VisualElement {
  id?: string;
  shape: ShapeType;
  fill?: FillType;
  color?: string; // Hex color, e.g. #1E5AA8, #FFD100, #111827
  strokeColor?: string;
  strokeWidth?: number;
  rotation?: number; // 0, 45, 90, 180, 270, etc.
  scale?: number; // relative size multiplier
  x?: number; // percentage offset (0-100)
  y?: number; // percentage offset (0-100)
  innerShape?: ShapeType;
  innerFill?: FillType;
  innerColor?: string;
  innerCount?: number;
}

export type CellVisual =
  | {
      type: 'shape';
      shape: ShapeType;
      fill: FillType;
      color: string;
      strokeColor?: string;
      rotation?: number;
      count?: number;
      size?: 'sm' | 'md' | 'lg' | number;
      innerShape?: ShapeType;
      innerFill?: FillType;
      innerColor?: string;
    }
  | {
      type: 'number';
      value: number | string;
      label?: string;
      color?: string;
      fontSize?: number;
      subtext?: string;
    }
  | {
      type: 'dice';
      pips: number; // 1 to 6
      color?: string;
      pipColor?: string;
      orientation?: number;
    }
  | {
      type: 'question-mark';
      color?: string;
      text?: string;
    }
  | {
      type: 'empty';
    }
  | {
      type: 'composite';
      elements: VisualElement[];
      background?: string;
    }
  | {
      type: 'svg-path';
      path: string;
      viewBox?: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
    }
  | {
      type: 'cube-isometric';
      grid: number[][]; // height map (e.g. 2x2 or 3x3 array of stack heights)
      highlightHidden?: boolean;
    }
  | {
      type: 'verbal-word';
      word: string;
      category?: string;
      iconName?: string;
      phoneticHint?: string;
    };

// ============================================================================
// Stimulus Payloads for Specific Question Archetypes
// ============================================================================

export interface MatrixGridData {
  type: 'matrix-grid';
  rows: number; // 2 or 3
  cols: number; // 2 or 3
  cells: CellVisual[][];
  questionRow: number;
  questionCol: number;
  highlightRow?: number;
  highlightCol?: number;
  highlightRuleExplanation?: string;
}

export interface BalanceScaleItem {
  id: string;
  shape: ShapeType;
  color: string;
  fill?: FillType;
  weight?: number;
  count: number;
  label?: string;
}

export interface BalanceScaleSingle {
  id: string;
  leftPan: BalanceScaleItem[];
  rightPan: BalanceScaleItem[];
  status: 'balanced' | 'tilted-left' | 'tilted-right' | 'unknown';
  isTargetScale?: boolean;
}

export interface BalanceScaleData {
  type: 'balance-scale';
  scales: BalanceScaleSingle[];
  targetScaleIndex: number;
  targetPan: 'left' | 'right';
  targetUnknownWeight?: number;
}

export interface SequenceData {
  type: 'sequence-series';
  frames: CellVisual[];
  questionIndex: number; // typically the last frame or a middle frame
  stepLabels?: string[];
  progressionNote?: string;
}

export interface Cube3DData {
  type: 'cube-3d';
  grid: number[][]; // 2D matrix of column heights (e.g. 3x3)
  totalCubes: number;
  visibleCubes: number;
  hiddenCubes: number;
  questionType: 'total-cubes' | 'hidden-cubes' | 'visible-cubes' | 'top-view';
  topViewMatrix?: number[][];
}

export interface SpatialCompletionData {
  type: 'spatial-completion';
  matrixSize: 2 | 3;
  gridCells: CellVisual[][];
  cutoutRow: number;
  cutoutCol: number;
  backgroundPattern?: 'stripes' | 'dots' | 'grid' | 'geometric';
}

export interface VerbalGridData {
  type: 'verbal-grid';
  items: {
    id: string;
    word: string;
    category: string;
    iconName: string;
    isOutlier: boolean;
    definitionHint?: string;
  }[];
  sharedRule: string;
  archetypeVariant: 'odd-one-out' | 'verbal-analogy' | 'relational-matrix';
  outlierReason?: string;
}

export type VisualStimulus =
  | MatrixGridData
  | BalanceScaleData
  | SequenceData
  | Cube3DData
  | SpatialCompletionData
  | VerbalGridData;

// ============================================================================
// Choice Options & Complete NGAT Question
// ============================================================================

export type OptionLabel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ChoiceOption {
  id: string;
  label: OptionLabel;
  visual: CellVisual;
  trapType: CognitiveTrapType;
  trapExplanation: string;
}

export interface NGATQuestion {
  id: string;
  subtest: SubtestType;
  archetype: QuestionArchetype;
  difficulty: DifficultyLevel;
  stimulus: VisualStimulus;
  options: ChoiceOption[]; // 5 options A-E for quant/nonverbal, 6 options A-F for verbal
  correctIndex: number;
  /**
   * Exact 3-stage progressive hints:
   * [0]: Where to look (focus attention)
   * [1]: Pattern type (e.g. arithmetic, rotational, categorical)
   * [2]: Rule reveal (full breakdown of the exact formula/relationship)
   */
  hints: [string, string, string];
  ruleSummary: string;
  stepByStepExplanation: string[];
  speedTip: string;
  estimatedSeconds: number;
}

// ============================================================================
// Student Progress, Session, & 7-Day Countdown Mission
// ============================================================================

export interface QuestionAttempt {
  questionId: string;
  subtest: SubtestType;
  archetype: QuestionArchetype;
  difficulty: DifficultyLevel;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  hintsUsed: number; // 0, 1, 2, or 3
  trapIdentified?: CognitiveTrapType;
  timestamp: number;
}

export interface ExamSession {
  id: string;
  subtest: SubtestType | 'full-mock';
  startTime: number;
  endTime?: number;
  totalQuestions: number;
  currentIndex: number;
  questions: NGATQuestion[];
  attempts: Record<string, QuestionAttempt>;
  flaggedQuestionIds: string[];
  isCompleted: boolean;
  timeLimitSeconds: number;
  scaledScore?: number; // 100 to 160 scale
  percentileRank?: number; // 1 to 99 percentile
  strengths: string[];
  growthAreas: string[];
}

export interface DayMission {
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  theme: string;
  targetSubtest: SubtestType | 'all';
  targetArchetypes: QuestionArchetype[];
  questionCount: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  accuracyTargetPercent: number;
  bestScore?: number;
  badgeReward: string;
  tipOfDay: string;
}

export interface ArchetypeMasteryStats {
  attempted: number;
  correct: number;
  averageTimeSeconds: number;
  trapsTriggered: Partial<Record<CognitiveTrapType, number>>;
}

export interface StudentProgress {
  studentName: string;
  grade: 5;
  completedMissions: number[]; // e.g. [1, 2]
  totalQuestionsAttempted: number;
  totalCorrect: number;
  archetypeMastery: Record<QuestionArchetype, ArchetypeMasteryStats>;
  recentExamScores: {
    date: string;
    subtest: SubtestType | 'full-mock';
    score: number;
    percentile: number;
    totalQuestions: number;
  }[];
  currentStreakDays: number;
  earnedBadges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate: string;
  }[];
}
