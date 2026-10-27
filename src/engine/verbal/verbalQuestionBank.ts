import { DifficultyLevel, NGATQuestion } from '../../types/ngat';

/**
 * Question bank and generator for Verbal Classification and Verbal Analogy questions.
 * Features 5-to-1 odd-one-out categories and relational verbal matrices.
 */
export function generateVerbalQuestion(
  _difficulty: DifficultyLevel = 2,
  _seed?: number
): NGATQuestion {
  throw new Error('Not implemented yet - TDD Red Phase');
}

/**
 * Returns the entire curated set of calibrated verbal questions.
 */
export function getAllVerbalQuestions(): NGATQuestion[] {
  throw new Error('Not implemented yet - TDD Red Phase');
}
