import {
  DifficultyLevel,
  NGATQuestion,
  ChoiceOption,
  BalanceScaleData,
  BalanceScaleSingle,
  CellVisual,
  CognitiveTrapType,
  ShapeType,
} from '../../types/ngat';
import { PRNG, NAGLIERI_PALETTE } from '../utils/prng';

export function generateBalanceScaleQuestion(
  difficulty: DifficultyLevel = 2,
  seed?: number
): NGATQuestion {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());

  // Shapes and weights
  const shapePool: { shape: ShapeType; color: string; name: string }[] = [
    { shape: 'circle', color: NAGLIERI_PALETTE.blue, name: 'Circle' },
    { shape: 'square', color: NAGLIERI_PALETTE.yellow, name: 'Square' },
    { shape: 'triangle', color: NAGLIERI_PALETTE.charcoal, name: 'Triangle' },
    { shape: 'diamond', color: '#10B981', name: 'Diamond' },
  ];

  const pickedShapes = prng.sample(shapePool, 3);
  const [shapeA, shapeB, shapeC] = pickedShapes;

  let scales: BalanceScaleSingle[] = [];
  let correctAnswer = 0;
  let ruleSummary = '';
  let steps: string[] = [];
  let unitName = '';

  if (difficulty === 1) {
    // 2 Scales: 1 A = K B's; Target: M A's = ? B's
    const ratio = prng.nextInt(2, 4);
    const targetMultiplier = prng.nextInt(2, 3);
    correctAnswer = ratio * targetMultiplier;
    unitName = `${shapeB.name}s`;

    const scale1: BalanceScaleSingle = {
      id: 'scale-1',
      leftPan: [
        {
          id: 's1-l',
          shape: shapeA.shape,
          color: shapeA.color,
          count: 1,
          weight: ratio,
          label: `1 ${shapeA.name}`,
        },
      ],
      rightPan: [
        {
          id: 's1-r',
          shape: shapeB.shape,
          color: shapeB.color,
          count: ratio,
          weight: ratio,
          label: `${ratio} ${shapeB.name}s`,
        },
      ],
      status: 'balanced',
    };

    const scale2: BalanceScaleSingle = {
      id: 'scale-2',
      leftPan: [
        {
          id: 's2-l',
          shape: shapeA.shape,
          color: shapeA.color,
          count: targetMultiplier,
          weight: correctAnswer,
          label: `${targetMultiplier} ${shapeA.name}s`,
        },
      ],
      rightPan: [
        {
          id: 's2-r-target',
          shape: shapeB.shape,
          color: shapeB.color,
          count: 0,
          weight: 0,
          label: '?',
        },
      ],
      status: 'unknown',
      isTargetScale: true,
    };

    scales = [scale1, scale2];
    ruleSummary = `Each ${shapeA.name} balances ${ratio} ${shapeB.name}s. Therefore, ${targetMultiplier} ${shapeA.name}s = ${correctAnswer} ${shapeB.name}s.`;
    steps = [
      `Scale 1 shows that 1 ${shapeA.name} is equal in weight to ${ratio} ${shapeB.name}s.`,
      `On Scale 2, there are ${targetMultiplier} ${shapeA.name}s on the left.`,
      `Substitute ${ratio} ${shapeB.name}s for each ${shapeA.name}: ${targetMultiplier} × ${ratio} = ${correctAnswer} ${shapeB.name}s.`,
    ];
  } else if (difficulty === 2) {
    // 2 Scales: 1 A = K B's; Target: 1 A + M B's = ? B's
    const ratio = prng.nextInt(2, 4);
    const addedB = prng.nextInt(1, 3);
    correctAnswer = ratio + addedB;
    unitName = `${shapeB.name}s`;

    const scale1: BalanceScaleSingle = {
      id: 'scale-1',
      leftPan: [
        {
          id: 's1-l',
          shape: shapeA.shape,
          color: shapeA.color,
          count: 1,
          weight: ratio,
          label: `1 ${shapeA.name}`,
        },
      ],
      rightPan: [
        {
          id: 's1-r',
          shape: shapeB.shape,
          color: shapeB.color,
          count: ratio,
          weight: ratio,
          label: `${ratio} ${shapeB.name}s`,
        },
      ],
      status: 'balanced',
    };

    const scale2: BalanceScaleSingle = {
      id: 'scale-2',
      leftPan: [
        {
          id: 's2-l1',
          shape: shapeA.shape,
          color: shapeA.color,
          count: 1,
          weight: ratio,
          label: `1 ${shapeA.name}`,
        },
        {
          id: 's2-l2',
          shape: shapeB.shape,
          color: shapeB.color,
          count: addedB,
          weight: addedB,
          label: `${addedB} ${shapeB.name}s`,
        },
      ],
      rightPan: [
        {
          id: 's2-r-target',
          shape: shapeB.shape,
          color: shapeB.color,
          count: 0,
          weight: 0,
          label: '?',
        },
      ],
      status: 'unknown',
      isTargetScale: true,
    };

    scales = [scale1, scale2];
    ruleSummary = `Replace the ${shapeA.name} with ${ratio} ${shapeB.name}s, then add the ${addedB} ${shapeB.name}s to get ${correctAnswer} total.`;
    steps = [
      `From Scale 1, we know 1 ${shapeA.name} = ${ratio} ${shapeB.name}s.`,
      `Scale 2 contains 1 ${shapeA.name} and ${addedB} ${shapeB.name}s on the left pan.`,
      `Replace 1 ${shapeA.name} with ${ratio} ${shapeB.name}s: ${ratio} + ${addedB} = ${correctAnswer} ${shapeB.name}s.`,
    ];
  } else if (difficulty === 3) {
    // 3 Scales: Two-step transitive substitution
    // Scale 1: 1 A = 2 B's
    // Scale 2: 1 B = 2 C's (or 3 C's)
    // Scale 3: 1 A + 1 B = ? C's
    const ratioAB = 2;
    const ratioBC = prng.nextInt(2, 3);
    const weightA_in_C = ratioAB * ratioBC;
    const weightB_in_C = ratioBC;
    correctAnswer = weightA_in_C + weightB_in_C;
    unitName = `${shapeC.name}s`;

    const scale1: BalanceScaleSingle = {
      id: 'scale-1',
      leftPan: [{ id: 's1-l', shape: shapeA.shape, color: shapeA.color, count: 1, weight: ratioAB, label: `1 ${shapeA.name}` }],
      rightPan: [{ id: 's1-r', shape: shapeB.shape, color: shapeB.color, count: ratioAB, weight: ratioAB, label: `${ratioAB} ${shapeB.name}s` }],
      status: 'balanced',
    };

    const scale2: BalanceScaleSingle = {
      id: 'scale-2',
      leftPan: [{ id: 's2-l', shape: shapeB.shape, color: shapeB.color, count: 1, weight: ratioBC, label: `1 ${shapeB.name}` }],
      rightPan: [{ id: 's2-r', shape: shapeC.shape, color: shapeC.color, count: ratioBC, weight: ratioBC, label: `${ratioBC} ${shapeC.name}s` }],
      status: 'balanced',
    };

    const scale3: BalanceScaleSingle = {
      id: 'scale-3',
      leftPan: [
        { id: 's3-l1', shape: shapeA.shape, color: shapeA.color, count: 1, weight: weightA_in_C, label: `1 ${shapeA.name}` },
        { id: 's3-l2', shape: shapeB.shape, color: shapeB.color, count: 1, weight: weightB_in_C, label: `1 ${shapeB.name}` },
      ],
      rightPan: [{ id: 's3-r-target', shape: shapeC.shape, color: shapeC.color, count: 0, weight: 0, label: '?' }],
      status: 'unknown',
      isTargetScale: true,
    };

    scales = [scale1, scale2, scale3];
    ruleSummary = `Convert all shapes to ${shapeC.name}s: 1 ${shapeA.name} = ${weightA_in_C} ${shapeC.name}s, and 1 ${shapeB.name} = ${weightB_in_C} ${shapeC.name}s. Total = ${correctAnswer}.`;
    steps = [
      `Scale 2 indicates 1 ${shapeB.name} = ${ratioBC} ${shapeC.name}s.`,
      `Scale 1 indicates 1 ${shapeA.name} = ${ratioAB} ${shapeB.name}s = ${ratioAB} × ${ratioBC} = ${weightA_in_C} ${shapeC.name}s.`,
      `On Scale 3, combine (1 ${shapeA.name} + 1 ${shapeB.name}): ${weightA_in_C} + ${weightB_in_C} = ${correctAnswer} ${shapeC.name}s.`,
    ];
  } else {
    // Difficulty 4 (TAG Challenge, 97th percentile)
    // 3 Scales with algebraic combination:
    // Scale 1: 1 A + 1 B = 7 (or proportional)
    // Scale 2: 1 A = 1 B + 3
    // Scale 3: 2 A's = ? units
    const weightB = prng.nextInt(2, 4);
    const diff = prng.nextInt(2, 4);
    const weightA = weightB + diff;
    correctAnswer = 2 * weightA;
    unitName = 'units';

    const scale1: BalanceScaleSingle = {
      id: 'scale-1',
      leftPan: [
        { id: 's1-l1', shape: shapeA.shape, color: shapeA.color, count: 1, weight: weightA, label: `1 ${shapeA.name}` },
        { id: 's1-l2', shape: shapeB.shape, color: shapeB.color, count: 1, weight: weightB, label: `1 ${shapeB.name}` },
      ],
      rightPan: [
        { id: 's1-r', shape: 'square', color: NAGLIERI_PALETTE.gray, count: weightA + weightB, weight: weightA + weightB, label: `${weightA + weightB} weight blocks` },
      ],
      status: 'balanced',
    };

    const scale2: BalanceScaleSingle = {
      id: 'scale-2',
      leftPan: [{ id: 's2-l', shape: shapeA.shape, color: shapeA.color, count: 1, weight: weightA, label: `1 ${shapeA.name}` }],
      rightPan: [
        { id: 's2-r1', shape: shapeB.shape, color: shapeB.color, count: 1, weight: weightB, label: `1 ${shapeB.name}` },
        { id: 's2-r2', shape: 'square', color: NAGLIERI_PALETTE.gray, count: diff, weight: diff, label: `${diff} weight blocks` },
      ],
      status: 'balanced',
    };

    const scale3: BalanceScaleSingle = {
      id: 'scale-3',
      leftPan: [{ id: 's3-l', shape: shapeA.shape, color: shapeA.color, count: 2, weight: correctAnswer, label: `2 ${shapeA.name}s` }],
      rightPan: [{ id: 's3-r-target', shape: 'square', color: NAGLIERI_PALETTE.gray, count: 0, weight: 0, label: '?' }],
      status: 'unknown',
      isTargetScale: true,
    };

    scales = [scale1, scale2, scale3];
    ruleSummary = `Solve the system: ${shapeA.name} = ${weightA}, ${shapeB.name} = ${weightB}. 2 ${shapeA.name}s balance ${correctAnswer} weight units.`;
    steps = [
      `Scale 2 shows: 1 ${shapeA.name} = 1 ${shapeB.name} + ${diff}.`,
      `Substitute into Scale 1: (1 ${shapeB.name} + ${diff}) + 1 ${shapeB.name} = ${weightA + weightB}. Thus 2 ${shapeB.name}s = ${2 * weightB}, so 1 ${shapeB.name} = ${weightB}.`,
      `Therefore 1 ${shapeA.name} = ${weightA}. Scale 3 asks for 2 ${shapeA.name}s: 2 × ${weightA} = ${correctAnswer}.`,
    ];
  }

  const targetScaleIndex = scales.length - 1;

  // Generate 4 unique distractors
  const distractors: { value: number; trap: CognitiveTrapType; explanation: string }[] = [];
  const usedValues = new Set<number>([correctAnswer]);

  const candidateTraps: { compute: () => number; trap: CognitiveTrapType; explanation: string }[] = [
    {
      compute: () => correctAnswer - 1,
      trap: 'off-by-one',
      explanation: 'Calculation was off by one due to a minor counting or arithmetic slip.',
    },
    {
      compute: () => correctAnswer + 1,
      trap: 'off-by-one',
      explanation: 'Calculation was off by one by miscounting the number of balanced units on the pan.',
    },
    {
      compute: () => Math.max(1, Math.round(correctAnswer / 2)),
      trap: 'wrong-operation',
      explanation: 'Divided instead of multiplying when substituting the shape equivalent values.',
    },
    {
      compute: () => correctAnswer + 2,
      trap: 'row-only-trap',
      explanation: 'Looked only at the first scale relationship without applying the full multi-scale substitution.',
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
        explanation: 'Plausible near-miss distractor arising from incorrect weight balance estimation.',
      });
      if (distractors.length >= 4) break;
    }
    const valMinus = correctAnswer - offset;
    if (valMinus > 0 && !usedValues.has(valMinus)) {
      usedValues.add(valMinus);
      distractors.push({
        value: valMinus,
        trap: 'distractor',
        explanation: 'Plausible near-miss distractor arising from incorrect weight balance estimation.',
      });
      if (distractors.length >= 4) break;
    }
    offset++;
  }

  const rawChoices = [
    {
      visual: { type: 'number', value: correctAnswer, label: unitName } as CellVisual,
      trapType: 'correct' as CognitiveTrapType,
      trapExplanation: '',
      isCorrect: true,
    },
    ...distractors.map((d) => ({
      visual: { type: 'number', value: d.value, label: unitName } as CellVisual,
      trapType: d.trap,
      trapExplanation: d.explanation,
      isCorrect: false,
    })),
  ];

  const shuffledChoices = prng.shuffle(rawChoices);
  const correctIndex = shuffledChoices.findIndex((c) => c.isCorrect);

  const labels: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
  const options: ChoiceOption[] = shuffledChoices.map((c, i) => ({
    id: `opt-bs-${i}-${c.visual.type === 'number' ? c.visual.value : i}`,
    label: labels[i],
    visual: c.visual,
    trapType: c.trapType,
    trapExplanation: c.trapExplanation,
  }));

  const stimulus: BalanceScaleData = {
    type: 'balance-scale',
    scales,
    targetScaleIndex,
    targetPan: 'right',
    targetUnknownWeight: correctAnswer,
  };

  const id = `quant-bs-d${difficulty}-s${seed ?? prng.nextInt(1000, 9999)}`;

  return {
    id,
    subtest: 'quantitative',
    archetype: 'balance-scale',
    difficulty,
    stimulus,
    options,
    correctIndex,
    hints: [
      `Look at the first balanced scale to discover the conversion rate between the shapes.`,
      `Use algebraic substitution: replace each shape on the target pan with its equivalent count from the earlier scales.`,
      `Final step: ${ruleSummary}`,
    ],
    ruleSummary,
    stepByStepExplanation: steps,
    speedTip: 'Express all shapes in terms of the smallest unit shape (like currency cents) to make balance math effortless.',
    estimatedSeconds: difficulty * 25 + 30,
  };
}
