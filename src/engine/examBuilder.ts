import {
  DifficultyLevel,
  NGATQuestion,
  NonverbalArchetype,
  QuantitativeArchetype,
  QuestionArchetype,
  SubtestType,
} from '../types/ngat';
import { PRNG } from './utils/prng';
import { generateNumberMatrixQuestion } from './quantitative/numberMatrixGenerator';
import { generateBalanceScaleQuestion } from './quantitative/balanceScaleGenerator';
import { generateShapeQuantityQuestion } from './quantitative/shapeQuantityGenerator';
import { generateSequenceQuestion } from './quantitative/sequenceAndDiceGenerator';
import { generateCube3DQuestion } from './quantitative/cube3DGenerator';
import { generateNonverbalQuestion } from './nonverbal/nonverbalGenerator';
import { generateVerbalQuestion } from './verbal/verbalQuestionBank';

const QUANTITATIVE_ARCHETYPES: QuantitativeArchetype[] = [
  'number-matrix',
  'balance-scale',
  'shape-quantity',
  'sequence-series',
  'cube-3d',
];

const NONVERBAL_ARCHETYPES: NonverbalArchetype[] = [
  'pattern-completion',
  'matrix-analogy',
  'serial-reasoning',
  'spatial-visualization',
];

/**
 * Builds a full-length or targeted NGAT exam session with calibrated difficulty and subtest balance.
 * Implements cognitive difficulty ramp (warmup -> core -> gifted -> TAG challenge).
 */
export function buildNGATExam(
  subtest: SubtestType | 'mixed',
  count: number = 30,
  seed?: number
): NGATQuestion[] {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());
  const questions: NGATQuestion[] = [];

  for (let i = 0; i < count; i++) {
    // Calibrated progression across quartiles:
    // First 25%: mostly Difficulty 1 & 2
    // Middle 50%: mostly Difficulty 2 & 3
    // Final 25%: mostly Difficulty 3 & 4 (ensuring all 1..4 difficulties are covered)
    const progress = i / count;
    let diff: DifficultyLevel;
    if (progress < 0.25) {
      diff = (i % 3 === 0 ? 1 : 2) as DifficultyLevel;
    } else if (progress < 0.6) {
      diff = (i % 2 === 0 ? 2 : 3) as DifficultyLevel;
    } else if (progress < 0.8) {
      diff = 3 as DifficultyLevel;
    } else {
      diff = (i % 2 === 0 ? 4 : 3) as DifficultyLevel;
    }

    // Ensure all 4 difficulties are definitely included
    if (i === 0) diff = 1;
    if (i === Math.floor(count * 0.3)) diff = 2;
    if (i === Math.floor(count * 0.7)) diff = 3;
    if (i === count - 1) diff = 4;

    const itemSeed = prng.nextInt(10000, 999999) + i * 1000;
    let q: NGATQuestion;

    if (subtest === 'quantitative') {
      const arch = QUANTITATIVE_ARCHETYPES[i % QUANTITATIVE_ARCHETYPES.length];
      q = generateAdaptiveQuestion('quantitative', diff, arch, itemSeed);
    } else if (subtest === 'nonverbal') {
      const arch = NONVERBAL_ARCHETYPES[i % NONVERBAL_ARCHETYPES.length];
      q = generateAdaptiveQuestion('nonverbal', diff, arch, itemSeed);
    } else if (subtest === 'verbal') {
      q = generateVerbalQuestion(diff, itemSeed);
    } else {
      // Mixed: rotate through quantitative, nonverbal, verbal
      const mode = i % 3;
      if (mode === 0) {
        const arch = QUANTITATIVE_ARCHETYPES[Math.floor(i / 3) % QUANTITATIVE_ARCHETYPES.length];
        q = generateAdaptiveQuestion('quantitative', diff, arch, itemSeed);
      } else if (mode === 1) {
        const arch = NONVERBAL_ARCHETYPES[Math.floor(i / 3) % NONVERBAL_ARCHETYPES.length];
        q = generateAdaptiveQuestion('nonverbal', diff, arch, itemSeed);
      } else {
        q = generateVerbalQuestion(diff, itemSeed);
      }
    }

    // Guarantee unique IDs across the entire exam
    const uniqueId = `exam-${subtest}-q${i + 1}-${q.id}`;
    questions.push({
      ...q,
      id: uniqueId,
    });
  }

  return questions;
}

/**
 * Dynamically selects or generates the next adaptive question based on student performance.
 */
export function generateAdaptiveQuestion(
  subtest: SubtestType,
  difficulty: DifficultyLevel = 2,
  archetype?: QuestionArchetype,
  seed?: number
): NGATQuestion {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());

  if (subtest === 'quantitative') {
    let chosenArch: QuantitativeArchetype;
    if (archetype && QUANTITATIVE_ARCHETYPES.includes(archetype as QuantitativeArchetype)) {
      chosenArch = archetype as QuantitativeArchetype;
    } else {
      chosenArch = prng.pick(QUANTITATIVE_ARCHETYPES);
    }

    switch (chosenArch) {
      case 'number-matrix':
        return generateNumberMatrixQuestion(difficulty, seed);
      case 'balance-scale':
        return generateBalanceScaleQuestion(difficulty, seed);
      case 'shape-quantity':
        return generateShapeQuantityQuestion(difficulty, seed);
      case 'sequence-series':
        return generateSequenceQuestion(difficulty, seed);
      case 'cube-3d':
        return generateCube3DQuestion(difficulty, seed);
    }
  } else if (subtest === 'nonverbal') {
    let chosenArch: NonverbalArchetype;
    if (archetype && NONVERBAL_ARCHETYPES.includes(archetype as NonverbalArchetype)) {
      chosenArch = archetype as NonverbalArchetype;
    } else {
      chosenArch = prng.pick(NONVERBAL_ARCHETYPES);
    }
    return generateNonverbalQuestion(difficulty, chosenArch, seed);
  } else {
    return generateVerbalQuestion(difficulty, seed);
  }
}
