import { describe, it, expect } from 'vitest';
import {
  DifficultyLevel,
  NGATQuestion,
  VerbalGridData,
} from '../../types/ngat';
import {
  generateVerbalQuestion,
  getAllVerbalQuestions,
} from '../verbal/verbalQuestionBank';

const DIFFICULTIES: DifficultyLevel[] = [1, 2, 3, 4];
const SEEDS = [1, 2, 3, 4, 5];

function assertCommonVerbalInvariants(q: NGATQuestion): void {
  expect(q.id).toBeDefined();
  expect(typeof q.id).toBe('string');
  expect(q.id.trim().length).toBeGreaterThan(0);

  expect(q.subtest).toBe('verbal');
  expect(q.archetype).toBe('verbal-classification');
  expect([1, 2, 3, 4]).toContain(q.difficulty);

  // Beaverton/MHS NGAT Verbal Subtest Invariant: EXACTLY 6 options labeled A through F
  expect(q.options).toBeDefined();
  expect(q.options).toHaveLength(6);
  expect(q.options.map((o) => o.label)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);

  // All 6 option visuals must be unique
  const visualStrings = q.options.map((o) => JSON.stringify(o.visual));
  const uniqueVisuals = new Set(visualStrings);
  expect(uniqueVisuals.size).toBe(6);

  // Correct index bounds (0 to 5 for verbal 6-grid)
  expect(q.correctIndex).toBeGreaterThanOrEqual(0);
  expect(q.correctIndex).toBeLessThanOrEqual(5);

  const correctOption = q.options[q.correctIndex];
  expect(correctOption.trapType).toBe('correct');

  // Distractors must have non-'correct' trapType and thorough trap explanations
  q.options.forEach((opt, idx) => {
    if (idx !== q.correctIndex) {
      expect(opt.trapType).not.toBe('correct');
      expect(typeof opt.trapExplanation).toBe('string');
      expect(opt.trapExplanation.trim().length).toBeGreaterThan(15);
    }
  });

  // Stimulus structure: verbal-grid with 6 pictorial / semantic word items
  expect(q.stimulus.type).toBe('verbal-grid');
  const stim = q.stimulus as VerbalGridData;
  expect(stim.items).toBeDefined();
  expect(stim.items).toHaveLength(6);

  stim.items.forEach((item) => {
    expect(item.id).toBeDefined();
    expect(typeof item.word).toBe('string');
    expect(item.word.trim().length).toBeGreaterThan(0);
    expect(typeof item.category).toBe('string');
    expect(item.category.trim().length).toBeGreaterThan(0);
  });

  // Exactly one outlier item in the verbal classification stimulus
  const outlierItems = stim.items.filter((item) => item.isOutlier);
  expect(outlierItems.length).toBe(1);

  expect(typeof stim.sharedRule).toBe('string');
  expect(stim.sharedRule.trim().length).toBeGreaterThan(0);

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

describe('Verbal Question Bank & Generator', () => {
  describe('getAllVerbalQuestions', () => {
    it('returns a comprehensive question bank of at least 30 calibrated 5th-grade questions', () => {
      const bank = getAllVerbalQuestions();
      expect(Array.isArray(bank)).toBe(true);
      expect(bank.length).toBeGreaterThanOrEqual(30);

      // Verify all IDs are completely unique
      const ids = bank.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(bank.length);

      // Verify all difficulty levels are covered in the bank
      const difficultiesCovered = new Set(bank.map((q) => q.difficulty));
      expect(difficultiesCovered.has(1)).toBe(true);
      expect(difficultiesCovered.has(2)).toBe(true);
      expect(difficultiesCovered.has(3)).toBe(true);
      expect(difficultiesCovered.has(4)).toBe(true);

      // Verify every single question in the bank meets all verbal invariants
      bank.forEach((q) => {
        assertCommonVerbalInvariants(q);
      });
    });
  });

  describe('generateVerbalQuestion', () => {
    it.each(DIFFICULTIES)(
      'generates or selects valid verbal questions for difficulty %i across seeds',
      (difficulty) => {
        for (const seed of SEEDS) {
          const q = generateVerbalQuestion(difficulty, seed);
          assertCommonVerbalInvariants(q);
          expect(q.difficulty).toBe(difficulty);
        }
      }
    );

    it('produces deterministic output when given the same seed and difficulty', () => {
      const q1 = generateVerbalQuestion(2, 42);
      const q2 = generateVerbalQuestion(2, 42);
      expect(JSON.stringify(q1)).toBe(JSON.stringify(q2));
    });

    it('provides default difficulty level 2 when called without arguments', () => {
      const q = generateVerbalQuestion();
      expect(q.difficulty).toBe(2);
      expect(q.subtest).toBe('verbal');
      expect(q.options).toHaveLength(6);
    });
  });
});
