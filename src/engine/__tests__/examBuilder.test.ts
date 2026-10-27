import { describe, it, expect } from 'vitest';
import {
  DifficultyLevel,
  QuantitativeArchetype,
  NonverbalArchetype,
} from '../../types/ngat';
import {
  buildNGATExam,
  generateAdaptiveQuestion,
} from '../examBuilder';

describe('Exam Builder & Adaptive Engine', () => {
  describe('buildNGATExam for Quantitative subtest (Beaverton 5th Grade 40-question exam)', () => {
    it('generates a 40-question exam with 40 unique IDs', () => {
      const exam = buildNGATExam('quantitative', 40, 42);
      expect(exam).toHaveLength(40);

      const uniqueIds = new Set(exam.map((q) => q.id));
      expect(uniqueIds.size).toBe(40);
    });

    it('ensures all questions in the quantitative exam have subtest === "quantitative"', () => {
      const exam = buildNGATExam('quantitative', 40, 42);
      exam.forEach((q) => {
        expect(q.subtest).toBe('quantitative');
        expect(q.options).toHaveLength(5);
        expect(q.options.map((o) => o.label)).toEqual(['A', 'B', 'C', 'D', 'E']);
      });
    });

    it('spans all 5 quantitative archetypes', () => {
      const exam = buildNGATExam('quantitative', 40, 42);
      const archetypes = new Set(exam.map((q) => q.archetype));

      const expectedArchetypes: QuantitativeArchetype[] = [
        'number-matrix',
        'balance-scale',
        'shape-quantity',
        'sequence-series',
        'cube-3d',
      ];

      expectedArchetypes.forEach((expected) => {
        expect(archetypes.has(expected)).toBe(true);
      });
    });

    it('spans all 4 difficulty levels and demonstrates difficulty progression', () => {
      const exam = buildNGATExam('quantitative', 40, 42);
      const difficulties = new Set(exam.map((q) => q.difficulty));

      expect(difficulties.has(1)).toBe(true);
      expect(difficulties.has(2)).toBe(true);
      expect(difficulties.has(3)).toBe(true);
      expect(difficulties.has(4)).toBe(true);

      // Exam difficulty progression: first quartile should be easier on average than last quartile
      const firstQuartile = exam.slice(0, 10);
      const lastQuartile = exam.slice(30, 40);

      const avgFirst =
        firstQuartile.reduce((sum, q) => sum + q.difficulty, 0) / firstQuartile.length;
      const avgLast =
        lastQuartile.reduce((sum, q) => sum + q.difficulty, 0) / lastQuartile.length;

      expect(avgLast).toBeGreaterThan(avgFirst);
    });
  });

  describe('buildNGATExam for Nonverbal subtest', () => {
    it('generates a 40-question nonverbal exam with unique IDs and balanced archetypes', () => {
      const exam = buildNGATExam('nonverbal', 40, 42);
      expect(exam).toHaveLength(40);

      const uniqueIds = new Set(exam.map((q) => q.id));
      expect(uniqueIds.size).toBe(40);

      const archetypes = new Set(exam.map((q) => q.archetype));
      const expectedArchetypes: NonverbalArchetype[] = [
        'pattern-completion',
        'matrix-analogy',
        'serial-reasoning',
        'spatial-visualization',
      ];
      expectedArchetypes.forEach((expected) => {
        expect(archetypes.has(expected)).toBe(true);
      });

      exam.forEach((q) => {
        expect(q.subtest).toBe('nonverbal');
        expect(q.options).toHaveLength(5);
        expect(q.options.map((o) => o.label)).toEqual(['A', 'B', 'C', 'D', 'E']);
      });
    });
  });

  describe('buildNGATExam for Verbal subtest', () => {
    it('generates a 30-question verbal exam with unique IDs and 6 options per question', () => {
      const exam = buildNGATExam('verbal', 30, 42);
      expect(exam).toHaveLength(30);

      const uniqueIds = new Set(exam.map((q) => q.id));
      expect(uniqueIds.size).toBe(30);

      exam.forEach((q) => {
        expect(q.subtest).toBe('verbal');
        expect(q.archetype).toBe('verbal-classification');
        expect(q.options).toHaveLength(6);
        expect(q.options.map((o) => o.label)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
      });
    });
  });

  describe('buildNGATExam for Mixed subtest', () => {
    it('generates a balanced mixed exam including quantitative, nonverbal, and verbal items', () => {
      const exam = buildNGATExam('mixed', 20, 42);
      expect(exam).toHaveLength(20);

      const uniqueIds = new Set(exam.map((q) => q.id));
      expect(uniqueIds.size).toBe(20);

      const subtests = new Set(exam.map((q) => q.subtest));
      expect(subtests.has('quantitative')).toBe(true);
      expect(subtests.has('nonverbal')).toBe(true);
      expect(subtests.has('verbal')).toBe(true);
    });

    it('produces deterministic exams when using the same seed', () => {
      const examA = buildNGATExam('mixed', 15, 777);
      const examB = buildNGATExam('mixed', 15, 777);
      expect(JSON.stringify(examA)).toBe(JSON.stringify(examB));
    });

    it('defaults to 30 questions when count is not specified', () => {
      const exam = buildNGATExam('quantitative');
      expect(exam).toHaveLength(30);
    });
  });

  describe('generateAdaptiveQuestion for practice dojo drills', () => {
    const DIFFICULTIES: DifficultyLevel[] = [1, 2, 3, 4];

    it.each(DIFFICULTIES)(
      'generates quantitative adaptive questions for difficulty %i',
      (difficulty) => {
        const q = generateAdaptiveQuestion('quantitative', difficulty, 'number-matrix');
        expect(q.subtest).toBe('quantitative');
        expect(q.difficulty).toBe(difficulty);
        expect(q.archetype).toBe('number-matrix');
        expect(q.options).toHaveLength(5);
        expect(q.hints).toHaveLength(3);
      }
    );

    it.each(DIFFICULTIES)(
      'generates nonverbal adaptive questions for difficulty %i',
      (difficulty) => {
        const q = generateAdaptiveQuestion('nonverbal', difficulty, 'pattern-completion');
        expect(q.subtest).toBe('nonverbal');
        expect(q.difficulty).toBe(difficulty);
        expect(q.archetype).toBe('pattern-completion');
        expect(q.options).toHaveLength(5);
        expect(q.hints).toHaveLength(3);
      }
    );

    it.each(DIFFICULTIES)(
      'generates verbal adaptive questions for difficulty %i',
      (difficulty) => {
        const q = generateAdaptiveQuestion('verbal', difficulty);
        expect(q.subtest).toBe('verbal');
        expect(q.difficulty).toBe(difficulty);
        expect(q.archetype).toBe('verbal-classification');
        expect(q.options).toHaveLength(6);
        expect(q.hints).toHaveLength(3);
      }
    );

    it('selects a valid archetype automatically if archetype is omitted', () => {
      const qQuant = generateAdaptiveQuestion('quantitative', 2);
      expect(qQuant.subtest).toBe('quantitative');
      expect([
        'number-matrix',
        'balance-scale',
        'shape-quantity',
        'sequence-series',
        'cube-3d',
      ]).toContain(qQuant.archetype);

      const qNonverbal = generateAdaptiveQuestion('nonverbal', 3);
      expect(qNonverbal.subtest).toBe('nonverbal');
      expect([
        'pattern-completion',
        'matrix-analogy',
        'serial-reasoning',
        'spatial-visualization',
      ]).toContain(qNonverbal.archetype);
    });
  });
});
