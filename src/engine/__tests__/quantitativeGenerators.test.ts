import { describe, it, expect } from 'vitest';
import {
  DifficultyLevel,
  NGATQuestion,
  QuantitativeArchetype,
  MatrixGridData,
  BalanceScaleData,
  SequenceData,
  Cube3DData,
} from '../../types/ngat';
import { generateNumberMatrixQuestion } from '../quantitative/numberMatrixGenerator';
import { generateBalanceScaleQuestion } from '../quantitative/balanceScaleGenerator';
import { generateShapeQuantityQuestion } from '../quantitative/shapeQuantityGenerator';
import { generateSequenceQuestion } from '../quantitative/sequenceAndDiceGenerator';
import { generateCube3DQuestion } from '../quantitative/cube3DGenerator';

/**
 * Universal assertions for all Quantitative subtest questions.
 * Enforces NGAT 5th-grade exam standards:
 * - Exactly 5 choices labeled A, B, C, D, E with unique visuals
 * - Verified cognitive trap classifications on all distractors
 * - 3-stage progressive hints (attention -> pattern -> rule reveal)
 * - Calibrated explanations and speed tips
 */
function assertCommonQuantitativeInvariants(
  q: NGATQuestion,
  expectedArchetype: QuantitativeArchetype,
  expectedDifficulty: DifficultyLevel
): void {
  expect(q.id).toBeDefined();
  expect(typeof q.id).toBe('string');
  expect(q.id.trim().length).toBeGreaterThan(0);

  expect(q.subtest).toBe('quantitative');
  expect(q.archetype).toBe(expectedArchetype);
  expect(q.difficulty).toBe(expectedDifficulty);

  // Exactly 5 options labeled A, B, C, D, E
  expect(q.options).toBeDefined();
  expect(q.options).toHaveLength(5);
  expect(q.options.map((o) => o.label)).toEqual(['A', 'B', 'C', 'D', 'E']);

  // All 5 options must have unique visual representations (no duplicate choices)
  const visualStrings = q.options.map((o) => JSON.stringify(o.visual));
  const uniqueVisuals = new Set(visualStrings);
  expect(uniqueVisuals.size).toBe(5);

  // Correct index bounds and valid trap marker
  expect(q.correctIndex).toBeGreaterThanOrEqual(0);
  expect(q.correctIndex).toBeLessThanOrEqual(4);

  const correctOption = q.options[q.correctIndex];
  expect(correctOption.trapType).toBe('correct');

  // Distractor options must identify a specific cognitive trap with detailed 5th-grade explanation
  q.options.forEach((opt, idx) => {
    if (idx !== q.correctIndex) {
      expect(opt.trapType).not.toBe('correct');
      expect(typeof opt.trapExplanation).toBe('string');
      expect(opt.trapExplanation.trim().length).toBeGreaterThan(15);
    }
  });

  // 3-stage progressive hint scaffolding
  expect(Array.isArray(q.hints)).toBe(true);
  expect(q.hints).toHaveLength(3);
  q.hints.forEach((hint) => {
    expect(typeof hint).toBe('string');
    expect(hint.trim().length).toBeGreaterThan(0);
  });

  // Pedagogical explanations & speed tips
  expect(typeof q.ruleSummary).toBe('string');
  expect(q.ruleSummary.trim().length).toBeGreaterThan(0);

  expect(Array.isArray(q.stepByStepExplanation)).toBe(true);
  expect(q.stepByStepExplanation.length).toBeGreaterThanOrEqual(2);
  q.stepByStepExplanation.forEach((step) => {
    expect(typeof step).toBe('string');
    expect(step.trim().length).toBeGreaterThan(0);
  });

  expect(typeof q.speedTip).toBe('string');
  expect(q.speedTip.trim().length).toBeGreaterThan(0);

  expect(q.estimatedSeconds).toBeGreaterThan(0);
}

const DIFFICULTIES: DifficultyLevel[] = [1, 2, 3, 4];
const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe('Quantitative Generators', () => {
  describe('generateNumberMatrixQuestion', () => {
    it.each(DIFFICULTIES)(
      'generates valid number matrix questions across difficulty %i with seeds 1..10',
      (difficulty) => {
        for (const seed of SEEDS) {
          const q = generateNumberMatrixQuestion(difficulty, seed);
          assertCommonQuantitativeInvariants(q, 'number-matrix', difficulty);

          // Stimulus invariants
          expect(q.stimulus.type).toBe('matrix-grid');
          const stim = q.stimulus as MatrixGridData;
          expect(stim.rows).toBeGreaterThanOrEqual(2);
          expect(stim.cols).toBeGreaterThanOrEqual(2);
          expect(stim.cells).toHaveLength(stim.rows);
          expect(stim.cells[0]).toHaveLength(stim.cols);

          // Question cell position must contain question-mark
          expect(stim.questionRow).toBeGreaterThanOrEqual(0);
          expect(stim.questionRow).toBeLessThan(stim.rows);
          expect(stim.questionCol).toBeGreaterThanOrEqual(0);
          expect(stim.questionCol).toBeLessThan(stim.cols);

          const qCell = stim.cells[stim.questionRow][stim.questionCol];
          expect(qCell.type).toBe('question-mark');
        }
      }
    );

    it('produces deterministic output with the same seed and different output with different seeds', () => {
      const q1 = generateNumberMatrixQuestion(2, 42);
      const q2 = generateNumberMatrixQuestion(2, 42);
      expect(JSON.stringify(q1)).toBe(JSON.stringify(q2));

      const q3 = generateNumberMatrixQuestion(2, 99);
      expect(q1.id).not.toBe(q3.id);
    });

    it('provides default difficulty level 2 when called without arguments', () => {
      const q = generateNumberMatrixQuestion();
      expect(q.difficulty).toBe(2);
      expect(q.subtest).toBe('quantitative');
    });
  });

  describe('generateBalanceScaleQuestion', () => {
    it.each(DIFFICULTIES)(
      'generates valid balance scale questions across difficulty %i with seeds 1..10',
      (difficulty) => {
        for (const seed of SEEDS) {
          const q = generateBalanceScaleQuestion(difficulty, seed);
          assertCommonQuantitativeInvariants(q, 'balance-scale', difficulty);

          // Stimulus invariants
          expect(q.stimulus.type).toBe('balance-scale');
          const stim = q.stimulus as BalanceScaleData;
          expect(stim.scales.length).toBeGreaterThanOrEqual(2);
          expect(stim.targetScaleIndex).toBeGreaterThanOrEqual(0);
          expect(stim.targetScaleIndex).toBeLessThan(stim.scales.length);
          expect(['left', 'right']).toContain(stim.targetPan);

          // Each scale must have pans with items
          stim.scales.forEach((scale) => {
            expect(scale.id).toBeDefined();
            expect(Array.isArray(scale.leftPan)).toBe(true);
            expect(Array.isArray(scale.rightPan)).toBe(true);
            expect(['balanced', 'tilted-left', 'tilted-right', 'unknown']).toContain(scale.status);
          });
        }
      }
    );

    it('produces deterministic output for balance scale with fixed seed', () => {
      const q1 = generateBalanceScaleQuestion(3, 77);
      const q2 = generateBalanceScaleQuestion(3, 77);
      expect(JSON.stringify(q1)).toBe(JSON.stringify(q2));
    });

    it('provides default difficulty level 2 when called without arguments', () => {
      const q = generateBalanceScaleQuestion();
      expect(q.difficulty).toBe(2);
      expect(q.subtest).toBe('quantitative');
    });
  });

  describe('generateShapeQuantityQuestion', () => {
    it.each(DIFFICULTIES)(
      'generates valid shape quantity questions across difficulty %i with seeds 1..10',
      (difficulty) => {
        for (const seed of SEEDS) {
          const q = generateShapeQuantityQuestion(difficulty, seed);
          assertCommonQuantitativeInvariants(q, 'shape-quantity', difficulty);

          // Stimulus invariants
          expect(q.stimulus.type).toBe('matrix-grid');
          const stim = q.stimulus as MatrixGridData;
          expect(stim.cells.length).toBeGreaterThanOrEqual(2);
          expect(stim.cells[stim.questionRow][stim.questionCol].type).toBe('question-mark');
        }
      }
    );

    it('produces deterministic output with fixed seed', () => {
      const q1 = generateShapeQuantityQuestion(1, 101);
      const q2 = generateShapeQuantityQuestion(1, 101);
      expect(JSON.stringify(q1)).toBe(JSON.stringify(q2));
    });

    it('provides default difficulty level 2 when called without arguments', () => {
      const q = generateShapeQuantityQuestion();
      expect(q.difficulty).toBe(2);
      expect(q.subtest).toBe('quantitative');
    });
  });

  describe('generateSequenceQuestion', () => {
    it.each(DIFFICULTIES)(
      'generates valid sequence/dice questions across difficulty %i with seeds 1..10',
      (difficulty) => {
        for (const seed of SEEDS) {
          const q = generateSequenceQuestion(difficulty, seed);
          assertCommonQuantitativeInvariants(q, 'sequence-series', difficulty);

          // Stimulus invariants
          expect(q.stimulus.type).toBe('sequence-series');
          const stim = q.stimulus as SequenceData;
          expect(stim.frames.length).toBeGreaterThanOrEqual(3);
          expect(stim.questionIndex).toBeGreaterThanOrEqual(0);
          expect(stim.questionIndex).toBeLessThan(stim.frames.length);

          const qFrame = stim.frames[stim.questionIndex];
          expect(qFrame.type).toBe('question-mark');
        }
      }
    );

    it('produces deterministic output with fixed seed', () => {
      const q1 = generateSequenceQuestion(2, 555);
      const q2 = generateSequenceQuestion(2, 555);
      expect(JSON.stringify(q1)).toBe(JSON.stringify(q2));
    });

    it('provides default difficulty level 2 when called without arguments', () => {
      const q = generateSequenceQuestion();
      expect(q.difficulty).toBe(2);
      expect(q.subtest).toBe('quantitative');
    });
  });

  describe('generateCube3DQuestion', () => {
    it.each(DIFFICULTIES)(
      'generates valid 3D cube questions across difficulty %i with seeds 1..10',
      (difficulty) => {
        for (const seed of SEEDS) {
          const q = generateCube3DQuestion(difficulty, seed);
          assertCommonQuantitativeInvariants(q, 'cube-3d', difficulty);

          // Stimulus invariants
          expect(q.stimulus.type).toBe('cube-3d');
          const stim = q.stimulus as Cube3DData;
          expect(stim.totalCubes).toBeGreaterThan(0);
          expect(stim.visibleCubes).toBeGreaterThan(0);
          expect(stim.hiddenCubes).toBeGreaterThanOrEqual(0);
          expect(stim.totalCubes).toBe(stim.visibleCubes + stim.hiddenCubes);
          expect(Array.isArray(stim.grid)).toBe(true);
          expect(stim.grid.length).toBeGreaterThanOrEqual(2);
        }
      }
    );

    it('produces deterministic output with fixed seed', () => {
      const q1 = generateCube3DQuestion(4, 987);
      const q2 = generateCube3DQuestion(4, 987);
      expect(JSON.stringify(q1)).toBe(JSON.stringify(q2));
    });

    it('provides default difficulty level 2 when called without arguments', () => {
      const q = generateCube3DQuestion();
      expect(q.difficulty).toBe(2);
      expect(q.subtest).toBe('quantitative');
    });
  });
});
