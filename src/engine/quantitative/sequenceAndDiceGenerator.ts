import {
  DifficultyLevel,
  NGATQuestion,
  ChoiceOption,
  SequenceData,
  CellVisual,
  CognitiveTrapType,
} from '../../types/ngat';
import { PRNG, NAGLIERI_PALETTE } from '../utils/prng';

export function generateSequenceQuestion(
  difficulty: DifficultyLevel = 2,
  seed?: number
): NGATQuestion {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());

  let sequence: number[] = [];
  let ruleSummary = '';
  let steps: string[] = [];
  let isDice = false;

  if (difficulty === 1) {
    // Dice pips (1, 2, 3, 4, ?) or Simple Arithmetic ribbon (+2, +3, +4)
    const mode = prng.nextInt(0, 1);
    if (mode === 0) {
      isDice = true;
      const startPip = prng.nextInt(1, 2);
      sequence = [startPip, startPip + 1, startPip + 2, startPip + 3];
      ruleSummary = `Each die face increases by exactly 1 pip from left to right. The next die has ${sequence[3]} pips.`;
      steps = [
        `First frame shows ${sequence[0]} pip(s), second shows ${sequence[1]}, third shows ${sequence[2]}.`,
        `Each step adds 1 pip: ${sequence[2]} + 1 = ${sequence[3]} pips.`,
      ];
    } else {
      const step = prng.nextInt(2, 5);
      const start = prng.nextInt(3, 10);
      sequence = [start, start + step, start + 2 * step, start + 3 * step];
      ruleSummary = `Each number increases by ${step}: ${sequence[2]} + ${step} = ${sequence[3]}.`;
      steps = [
        `Look at difference between numbers: ${sequence[1]} - ${sequence[0]} = +${step}.`,
        `Apply the +${step} rule to the final number: ${sequence[2]} + ${step} = ${sequence[3]}.`,
      ];
    }
  } else if (difficulty === 2) {
    // Second-order differences (+2, +3, +4, +5) or alternating (+4, -1, +4, -1)
    const mode = prng.nextInt(0, 1);
    if (mode === 0) {
      // Second order: +2, +3, +4, +5
      const start = prng.nextInt(2, 6);
      const diff1 = prng.nextInt(2, 3);
      const s0 = start;
      const s1 = s0 + diff1;
      const s2 = s1 + diff1 + 1;
      const s3 = s2 + diff1 + 2;
      const s4 = s3 + diff1 + 3;
      sequence = [s0, s1, s2, s3, s4];
      ruleSummary = `The step size grows by +1 each time: +${diff1}, +${diff1 + 1}, +${diff1 + 2}, +${diff1 + 3}.`;
      steps = [
        `Find differences between successive terms: (${s1 - s0}), (${s2 - s1}), (${s3 - s2}).`,
        `The difference increases by 1 each step. Next step is +${diff1 + 3}.`,
        `Calculate ${s3} + ${diff1 + 3} = ${s4}.`,
      ];
    } else {
      // Alternating sequence: +stepA, -stepB
      const start = prng.nextInt(5, 12);
      const stepA = prng.nextInt(4, 6);
      const stepB = prng.nextInt(1, 2);
      const s0 = start;
      const s1 = s0 + stepA;
      const s2 = s1 - stepB;
      const s3 = s2 + stepA;
      const s4 = s3 - stepB;
      sequence = [s0, s1, s2, s3, s4];
      ruleSummary = `Alternating pattern: add ${stepA}, then subtract ${stepB}. Next step is -${stepB}.`;
      steps = [
        `Step 1: ${s0} + ${stepA} = ${s1}.`,
        `Step 2: ${s1} - ${stepB} = ${s2}.`,
        `Step 3: ${s2} + ${stepA} = ${s3}.`,
        `Step 4: ${s3} - ${stepB} = ${s4}.`,
      ];
    }
  } else if (difficulty === 3) {
    // Fibonacci style: each term is sum of preceding two terms
    const a = prng.nextInt(1, 3);
    const b = prng.nextInt(2, 4);
    const s0 = a;
    const s1 = b;
    const s2 = s0 + s1;
    const s3 = s1 + s2;
    const s4 = s2 + s3;
    const s5 = s3 + s4;
    sequence = [s0, s1, s2, s3, s4, s5];
    ruleSummary = `Each term is the sum of the two preceding numbers: ${s3} + ${s4} = ${s5}.`;
    steps = [
      `Check relationships: ${s0} + ${s1} = ${s2}, and ${s1} + ${s2} = ${s3}.`,
      `Each number is the sum of the previous two numbers (Fibonacci pattern).`,
      `Calculate the missing term: ${s3} + ${s4} = ${s5}.`,
    ];
  } else {
    // Difficulty 4 (TAG Challenge, 97th percentile):
    // Multiplicative progression with alternating subtraction: ×2 - 1, ×2 - 2, ×2 - 3
    const start = prng.nextInt(2, 4);
    const s0 = start;
    const s1 = s0 * 2 - 1;
    const s2 = s1 * 2 - 2;
    const s3 = s2 * 2 - 3;
    const s4 = s3 * 2 - 4;
    sequence = [s0, s1, s2, s3, s4];
    ruleSummary = `TAG Rule: Multiply by 2, then subtract step index: (${s3} × 2) - 4 = ${s4}.`;
    steps = [
      `Step 1: (${s0} × 2) - 1 = ${s1}.`,
      `Step 2: (${s1} × 2) - 2 = ${s2}.`,
      `Step 3: (${s2} × 2) - 3 = ${s3}.`,
      `Step 4: Multiply by 2 and subtract 4: (${s3} × 2) - 4 = ${s4}.`,
    ];
  }

  const questionIndex = sequence.length - 1;
  const correctAnswer = sequence[questionIndex];

  // Construct frames
  const frames: CellVisual[] = sequence.map((val, idx) => {
    if (idx === questionIndex) {
      return { type: 'question-mark' };
    }
    if (isDice) {
      return { type: 'dice', pips: val, color: NAGLIERI_PALETTE.blue };
    }
    return { type: 'number', value: val };
  });

  // Distractors
  const distractors: { value: number; trap: CognitiveTrapType; explanation: string }[] = [];
  const usedValues = new Set<number>([correctAnswer]);

  if (isDice) {
    // Unique dice pips 1 to 6
    const allPips = [1, 2, 3, 4, 5, 6].filter((p) => p !== correctAnswer);
    const pickedPips = prng.sample(allPips, 4);
    pickedPips.forEach((p) => {
      distractors.push({
        value: p,
        trap: p === correctAnswer + 1 || p === correctAnswer - 1 ? 'off-by-one' : 'distractor',
        explanation: `Die face showing ${p} pips does not follow the continuous single-step progression.`,
      });
    });
  } else {
    const candidateTraps: { compute: () => number; trap: CognitiveTrapType; explanation: string }[] = [
      {
        compute: () => correctAnswer + 1,
        trap: 'off-by-one',
        explanation: 'Off by +1 due to an arithmetic addition slip in the final step.',
      },
      {
        compute: () => Math.max(1, correctAnswer - 1),
        trap: 'off-by-one',
        explanation: 'Off by -1 from misapplying the growth increment to the penultimate term.',
      },
      {
        compute: () => sequence[questionIndex - 1] + 2,
        trap: 'row-only-trap',
        explanation: 'Applied a fixed constant difference (+2) instead of the accelerating rule.',
      },
      {
        compute: () => Math.max(2, sequence[questionIndex - 1] * 2),
        trap: 'wrong-operation',
        explanation: 'Multiplied the previous term directly instead of applying the mixed operation formula.',
      },
    ];

    for (const candidate of candidateTraps) {
      if (distractors.length >= 4) break;
      const val = candidate.compute();
      if (!usedValues.has(val) && val > 0) {
        usedValues.add(val);
        distractors.push({
          value: val,
          trap: candidate.trap,
          explanation: candidate.explanation,
        });
      }
    }

    let offset = 1;
    while (distractors.length < 4) {
      const valPlus = correctAnswer + offset;
      if (!usedValues.has(valPlus)) {
        usedValues.add(valPlus);
        distractors.push({
          value: valPlus,
          trap: 'distractor',
          explanation: 'Plausible near-miss value resulting from an unverified pattern guess.',
        });
        if (distractors.length >= 4) break;
      }
      const valMinus = correctAnswer - offset;
      if (valMinus > 0 && !usedValues.has(valMinus)) {
        usedValues.add(valMinus);
        distractors.push({
          value: valMinus,
          trap: 'distractor',
          explanation: 'Plausible near-miss value resulting from an unverified pattern guess.',
        });
        if (distractors.length >= 4) break;
      }
      offset++;
    }
  }

  const rawChoices = [
    {
      visual: isDice
        ? ({ type: 'dice', pips: correctAnswer, color: NAGLIERI_PALETTE.blue } as CellVisual)
        : ({ type: 'number', value: correctAnswer } as CellVisual),
      trapType: 'correct' as CognitiveTrapType,
      trapExplanation: '',
      isCorrect: true,
    },
    ...distractors.map((d) => ({
      visual: isDice
        ? ({ type: 'dice', pips: d.value, color: NAGLIERI_PALETTE.blue } as CellVisual)
        : ({ type: 'number', value: d.value } as CellVisual),
      trapType: d.trap,
      trapExplanation: d.explanation,
      isCorrect: false,
    })),
  ];

  const shuffledChoices = prng.shuffle(rawChoices);
  const correctIndex = shuffledChoices.findIndex((c) => c.isCorrect);

  const labels: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
  const options: ChoiceOption[] = shuffledChoices.map((c, i) => ({
    id: `opt-seq-${i}-${c.visual.type === 'number' ? c.visual.value : c.visual.type === 'dice' ? c.visual.pips : i}`,
    label: labels[i],
    visual: c.visual,
    trapType: c.trapType,
    trapExplanation: c.trapExplanation,
  }));

  const stimulus: SequenceData = {
    type: 'sequence-series',
    frames,
    questionIndex,
    progressionNote: ruleSummary,
  };

  const id = `quant-seq-d${difficulty}-s${seed ?? prng.nextInt(1000, 9999)}`;

  return {
    id,
    subtest: 'quantitative',
    archetype: 'sequence-series',
    difficulty,
    stimulus,
    options,
    correctIndex,
    hints: [
      `Write out the step differences between each successive frame in the ribbon.`,
      `Determine whether the step differences are constant, alternating, or growing.`,
      `Final calculation: ${ruleSummary}`,
    ],
    ruleSummary,
    stepByStepExplanation: steps,
    speedTip: 'Calculate differences between terms 1 & 2, then terms 2 & 3. If they change, look for 2nd order growth.',
    estimatedSeconds: difficulty * 20 + 20,
  };
}
