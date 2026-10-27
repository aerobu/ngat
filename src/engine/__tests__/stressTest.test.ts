import { describe, it, expect } from 'vitest';
import { generateNumberMatrixQuestion } from '../quantitative/numberMatrixGenerator';
import { generateBalanceScaleQuestion } from '../quantitative/balanceScaleGenerator';
import { generateShapeQuantityQuestion } from '../quantitative/shapeQuantityGenerator';
import { generateSequenceQuestion } from '../quantitative/sequenceAndDiceGenerator';
import { generateCube3DQuestion } from '../quantitative/cube3DGenerator';
import { generateNonverbalQuestion } from '../nonverbal/nonverbalGenerator';
import { generateVerbalQuestion } from '../verbal/verbalQuestionBank';
import { buildNGATExam } from '../examBuilder';
import { DifficultyLevel, NGATQuestion, NonverbalArchetype } from '../../types/ngat';

function assertDeepNoNaNOrUndefined(obj: any, path = ''): void {
  if (obj === null || obj === undefined) {
    if (obj === undefined) {
      throw new Error(`Found undefined at path: ${path}`);
    }
    return;
  }
  if (typeof obj === 'number') {
    if (Number.isNaN(obj)) {
      throw new Error(`Found NaN at path: ${path}`);
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => assertDeepNoNaNOrUndefined(item, `${path}[${idx}]`));
    return;
  }
  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      assertDeepNoNaNOrUndefined(obj[key], `${path}.${key}`);
    }
  }
}

function validateQuestionContract(q: NGATQuestion, expectedSubtest?: string): void {
  // Deep check for NaN or undefined
  assertDeepNoNaNOrUndefined(q, q.id);

  // Subtest check
  if (expectedSubtest) {
    expect(q.subtest).toBe(expectedSubtest);
  }

  // Options count
  const expectedOptionCount = q.subtest === 'verbal' ? 6 : 5;
  expect(q.options).toHaveLength(expectedOptionCount);

  // Correct index validity
  expect(q.correctIndex).toBeGreaterThanOrEqual(0);
  expect(q.correctIndex).toBeLessThan(expectedOptionCount);

  // Exactly one correct trapType
  const correctOptions = q.options.filter((o) => o.trapType === 'correct');
  expect(correctOptions).toHaveLength(1);
  expect(q.options[q.correctIndex].trapType).toBe('correct');

  // Option labels
  const expectedLabels = q.subtest === 'verbal' ? ['A', 'B', 'C', 'D', 'E', 'F'] : ['A', 'B', 'C', 'D', 'E'];
  expect(q.options.map((o) => o.label)).toEqual(expectedLabels);

  // Option uniqueness (no collisions)
  const optionKeys = q.options.map((o) => JSON.stringify(o.visual));
  const uniqueOptionKeys = new Set(optionKeys);
  expect(uniqueOptionKeys.size).toBe(expectedOptionCount);

  // Hints
  expect(q.hints).toHaveLength(3);
  q.hints.forEach((h) => {
    expect(typeof h).toBe('string');
    expect(h.trim().length).toBeGreaterThan(5);
  });

  // Explanations and tips
  expect(q.ruleSummary.trim().length).toBeGreaterThan(5);
  expect(q.stepByStepExplanation.length).toBeGreaterThanOrEqual(1);
  expect(q.speedTip.trim().length).toBeGreaterThan(5);
  expect(q.estimatedSeconds).toBeGreaterThan(0);
}

describe('Engine 50-Seed Stress Testing (Seeds 1..50, Difficulties 1..4)', () => {
  const seeds = Array.from({ length: 50 }, (_, i) => i + 1);
  const difficulties: DifficultyLevel[] = [1, 2, 3, 4];

  describe('Number Matrix Generator Stress Test', () => {
    it.each(seeds)('should generate valid number matrix for seed %i across all difficulties', (seed) => {
      for (const diff of difficulties) {
        const q = generateNumberMatrixQuestion(diff, seed);
        validateQuestionContract(q, 'quantitative');
        expect(q.archetype).toBe('number-matrix');
        expect(q.stimulus.type).toBe('matrix-grid');

        // Verify that stimulus cells contain numbers and one question mark
        const grid = q.stimulus as any;
        let qmCount = 0;
        let numCount = 0;
        for (const row of grid.cells) {
          for (const cell of row) {
            if (cell.type === 'question-mark') qmCount++;
            if (cell.type === 'number') {
              numCount++;
              expect(typeof cell.value).toBe('number');
              expect(Number.isFinite(cell.value)).toBe(true);
            }
          }
        }
        expect(qmCount).toBe(1);
        expect(numCount).toBe(grid.rows * grid.cols - 1);
      }
    });
  });

  describe('Balance Scale Generator Stress Test', () => {
    it.each(seeds)('should generate valid balance scale for seed %i across all difficulties', (seed) => {
      for (const diff of difficulties) {
        const q = generateBalanceScaleQuestion(diff, seed);
        validateQuestionContract(q, 'quantitative');
        expect(q.archetype).toBe('balance-scale');
        expect(q.stimulus.type).toBe('balance-scale');

        const bsData = q.stimulus as any;
        expect(bsData.scales.length).toBeGreaterThanOrEqual(2);
        expect(bsData.targetUnknownWeight).toBeGreaterThan(0);

        // Verify correct option value matches targetUnknownWeight
        const correctVisual = q.options[q.correctIndex].visual as any;
        expect(correctVisual.value).toBe(bsData.targetUnknownWeight);
      }
    });
  });

  describe('Shape Quantity Generator Stress Test', () => {
    it.each(seeds)('should generate valid shape quantity for seed %i across all difficulties', (seed) => {
      for (const diff of difficulties) {
        const q = generateShapeQuantityQuestion(diff, seed);
        validateQuestionContract(q, 'quantitative');
        expect(q.archetype).toBe('shape-quantity');
        expect(q.stimulus.type).toBe('matrix-grid');

        const grid = q.stimulus as any;
        let qmCount = 0;
        for (const row of grid.cells) {
          for (const cell of row) {
            if (cell.type === 'question-mark') qmCount++;
          }
        }
        expect(qmCount).toBe(1);
      }
    });
  });

  describe('Sequence and Dice Generator Stress Test', () => {
    it.each(seeds)('should generate valid sequence/dice for seed %i across all difficulties', (seed) => {
      for (const diff of difficulties) {
        const q = generateSequenceQuestion(diff, seed);
        validateQuestionContract(q, 'quantitative');
        expect(q.archetype).toBe('sequence-series');
        expect(q.stimulus.type).toBe('sequence-series');

        const seqData = q.stimulus as any;
        expect(seqData.frames.length).toBeGreaterThanOrEqual(4);
        expect(seqData.frames[seqData.questionIndex].type).toBe('question-mark');
      }
    });
  });

  describe('Cube 3D Generator Stress Test', () => {
    it.each(seeds)('should generate valid cube 3D for seed %i across all difficulties', (seed) => {
      for (const diff of difficulties) {
        const q = generateCube3DQuestion(diff, seed);
        validateQuestionContract(q, 'quantitative');
        expect(q.archetype).toBe('cube-3d');
        expect(q.stimulus.type).toBe('cube-3d');

        const cubeData = q.stimulus as any;
        expect(cubeData.totalCubes).toBe(cubeData.visibleCubes + cubeData.hiddenCubes);
        expect(cubeData.totalCubes).toBeGreaterThan(0);
        expect(cubeData.visibleCubes).toBeGreaterThan(0);
        expect(cubeData.hiddenCubes).toBeGreaterThanOrEqual(0);

        const correctVisual = q.options[q.correctIndex].visual as any;
        if (cubeData.questionType === 'total-cubes') {
          expect(correctVisual.value).toBe(cubeData.totalCubes);
        } else if (cubeData.questionType === 'hidden-cubes') {
          expect(correctVisual.value).toBe(cubeData.hiddenCubes);
        } else {
          expect(correctVisual.value).toBe(cubeData.visibleCubes);
        }
      }
    });
  });

  describe('Nonverbal Generator Stress Test', () => {
    const archetypes: NonverbalArchetype[] = [
      'pattern-completion',
      'matrix-analogy',
      'serial-reasoning',
      'spatial-visualization',
    ];

    it.each(seeds)('should generate valid nonverbal question for seed %i across all archetypes & difficulties', (seed) => {
      for (const arch of archetypes) {
        for (const diff of difficulties) {
          const q = generateNonverbalQuestion(diff, arch, seed);
          validateQuestionContract(q, 'nonverbal');
          expect(q.archetype).toBe(arch);
        }
      }
    });
  });

  describe('Verbal Question Bank Stress Test', () => {
    it.each(seeds)('should generate valid verbal question for seed %i across all difficulties', (seed) => {
      for (const diff of difficulties) {
        const q = generateVerbalQuestion(diff, seed);
        validateQuestionContract(q, 'verbal');
        expect(q.archetype).toBe('verbal-classification');
        expect(q.stimulus.type).toBe('verbal-grid');

        const verbalData = q.stimulus as any;
        expect(verbalData.items).toHaveLength(6);
        const outliers = verbalData.items.filter((item: any) => item.isOutlier);
        expect(outliers).toHaveLength(1);

        // Correct option must match outlier word
        const correctVisual = q.options[q.correctIndex].visual as any;
        expect(correctVisual.type).toBe('verbal-word');
        expect(correctVisual.word).toBe(outliers[0].word);
        expect(correctVisual.iconName).toBeDefined();
        expect(typeof correctVisual.iconName).toBe('string');
        expect(correctVisual.iconName.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Exam Builder Stress Test', () => {
    it.each([1, 7, 13, 25, 42, 50])('should build a 40-question mock exam without errors (seed %i)', (seed) => {
      const exam = buildNGATExam('mixed', 40, seed);
      expect(exam).toHaveLength(40);

      // Verify unique IDs across the entire mock exam
      const idSet = new Set(exam.map((q) => q.id));
      expect(idSet.size).toBe(40);

      // Verify each question
      exam.forEach((q) => validateQuestionContract(q));

      // Verify coverage of difficulties 1, 2, 3, 4
      const diffs = new Set(exam.map((q) => q.difficulty));
      expect(diffs.has(1)).toBe(true);
      expect(diffs.has(2)).toBe(true);
      expect(diffs.has(3)).toBe(true);
      expect(diffs.has(4)).toBe(true);

      // Verify representation of all 3 subtests
      const subtests = new Set(exam.map((q) => q.subtest));
      expect(subtests.has('quantitative')).toBe(true);
      expect(subtests.has('nonverbal')).toBe(true);
      expect(subtests.has('verbal')).toBe(true);
    });
  });
});
