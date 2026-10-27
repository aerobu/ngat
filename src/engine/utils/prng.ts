/**
 * Deterministic pseudo-random number generator (Mulberry32).
 * Guarantees reproducible question generation for any numeric seed.
 */
export class PRNG {
  private s: number;

  constructor(seed: number = Date.now()) {
    // Ensure non-zero 32-bit integer seed
    this.s = (seed ^ 0x6d2b79f5) >>> 0;
    if (this.s === 0) this.s = 1;
  }

  /** Returns uniform float in [0, 1) */
  next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns uniform integer in [min, max] inclusive */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Picks one element uniformly at random from array */
  pick<T>(array: readonly T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    return array[this.nextInt(0, array.length - 1)];
  }

  /** Shuffles a copy of the array using Fisher-Yates */
  shuffle<T>(array: readonly T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /** Samples k distinct items from array */
  sample<T>(array: readonly T[], k: number): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(k, shuffled.length));
  }
}

/** Official Naglieri high-contrast palette */
export const NAGLIERI_PALETTE = {
  blue: '#1E5AA8',
  yellow: '#FFD100',
  white: '#FFFFFF',
  charcoal: '#111827',
  gray: '#6B7280',
} as const;
