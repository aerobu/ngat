import { describe, it, expect } from 'vitest';
import {
  DifficultyLevel,
  NGATQuestion,
  NonverbalArchetype,
  MatrixGridData,
  SpatialCompletionData,
  SequenceData,
} from '../../types/ngat';
import { generateNonverbalQuestion } from '../nonverbal/nonverbalGenerator';

const NONVERBAL_ARCHETYPES: NonverbalArchetype[] = [
  'pattern-completion',
  'matrix-analogy',
  'serial-reasoning',
  'spatial-visualization',
];

const DIFFICULTIES: DifficultyLevel[] = [1, 2, 3, 4];
const SEEDS = [1, 2, 3, 4, 5];

function assertCommonNonverbalInvariants(
  q: NGATQuestion,
  expectedArchetype: NonverbalArchetype,
  expectedDifficulty: DifficultyLevel
): void {
  expect(q.id).toBeDefined();
  expect(typeof q.id).toBe('string');
  expect(q.id.trim().length).toBeGreaterThan(0);

  expect(q.subtest).toBe('nonverbal');
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

describe('Nonverbal Generator', () => {
  describe('generateNonverbalQuestion across archetypes & difficulties', () => {
    NONVERBAL_ARCHETYPES.forEach((archetype) => {
      describe(`archetype: ${archetype}`, () => {
        it.each(DIFFICULTIES)(
          `generates valid nonverbal ${archetype} questions for difficulty %i`,
          (difficulty) => {
            for (const seed of SEEDS) {
              const q = generateNonverbalQuestion(difficulty, archetype, seed);
              assertCommonNonverbalInvariants(q, archetype, difficulty);

              // Specific stimulus validation depending on archetype
              if (archetype === 'pattern-completion') {
                expect(['matrix-grid', 'spatial-completion']).toContain(q.stimulus.type);
                if (q.stimulus.type === 'spatial-completion') {
                  const stim = q.stimulus as SpatialCompletionData;
                  expect([2, 3]).toContain(stim.matrixSize);
                  expect(stim.cutoutRow).toBeGreaterThanOrEqual(0);
                  expect(stim.cutoutCol).toBeGreaterThanOrEqual(0);
                } else {
                  const stim = q.stimulus as MatrixGridData;
                  expect(stim.cells[stim.questionRow][stim.questionCol].type).toBe('question-mark');
                }
              } else if (archetype === 'matrix-analogy') {
                expect(q.stimulus.type).toBe('matrix-grid');
                const stim = q.stimulus as MatrixGridData;
                expect(stim.rows).toBeGreaterThanOrEqual(2);
                expect(stim.cols).toBeGreaterThanOrEqual(2);
                expect(stim.cells[stim.questionRow][stim.questionCol].type).toBe('question-mark');
              } else if (archetype === 'serial-reasoning') {
                expect(['sequence-series', 'matrix-grid']).toContain(q.stimulus.type);
                if (q.stimulus.type === 'sequence-series') {
                  const stim = q.stimulus as SequenceData;
                  expect(stim.frames.length).toBeGreaterThanOrEqual(3);
                  expect(stim.frames[stim.questionIndex].type).toBe('question-mark');
                }
              } else if (archetype === 'spatial-visualization') {
                expect(['spatial-completion', 'matrix-grid']).toContain(q.stimulus.type);
              }
            }
          }
        );
      });
    });

    it('produces deterministic output with the same seed and archetype', () => {
      const q1 = generateNonverbalQuestion(2, 'matrix-analogy', 42);
      const q2 = generateNonverbalQuestion(2, 'matrix-analogy', 42);
      expect(JSON.stringify(q1)).toBe(JSON.stringify(q2));

      const q3 = generateNonverbalQuestion(2, 'matrix-analogy', 99);
      expect(q1.id).not.toBe(q3.id);
    });

    it('defaults to difficulty 2 and a valid nonverbal archetype when parameters are omitted', () => {
      const q = generateNonverbalQuestion();
      expect(q.difficulty).toBe(2);
      expect(q.subtest).toBe('nonverbal');
      expect(NONVERBAL_ARCHETYPES).toContain(q.archetype);
    });

    it('cycles or chooses a valid nonverbal archetype if archetype parameter is undefined', () => {
      const q = generateNonverbalQuestion(3, undefined, 123);
      expect(q.subtest).toBe('nonverbal');
      expect(q.difficulty).toBe(3);
      expect(NONVERBAL_ARCHETYPES).toContain(q.archetype);
    });
  });
});
