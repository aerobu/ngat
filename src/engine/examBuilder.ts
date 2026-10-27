import {
  DifficultyLevel,
  NGATQuestion,
  QuestionArchetype,
  SubtestType,
} from '../types/ngat';

/**
 * Builds a full-length or targeted NGAT exam session with calibrated difficulty and subtest balance.
 */
export function buildNGATExam(
  _subtest: SubtestType | 'mixed',
  _count: number = 30,
  _seed?: number
): NGATQuestion[] {
  throw new Error('Not implemented yet - TDD Red Phase');
}

/**
 * Dynamically selects or generates the next adaptive question based on student performance.
 */
export function generateAdaptiveQuestion(
  _subtest: SubtestType,
  _difficulty: DifficultyLevel,
  _archetype?: QuestionArchetype
): NGATQuestion {
  throw new Error('Not implemented yet - TDD Red Phase');
}
