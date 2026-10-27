import {
  DifficultyLevel,
  NGATQuestion,
  ChoiceOption,
  MatrixGridData,
  CellVisual,
  CognitiveTrapType,
  ShapeType,
} from '../../types/ngat';
import { PRNG, NAGLIERI_PALETTE } from '../utils/prng';

interface PolygonInfo {
  shape: ShapeType;
  sides: number;
  name: string;
}

const POLYGONS: PolygonInfo[] = [
  { shape: 'triangle', sides: 3, name: 'Triangle' },
  { shape: 'square', sides: 4, name: 'Square' },
  { shape: 'pentagon', sides: 5, name: 'Pentagon' },
  { shape: 'hexagon', sides: 6, name: 'Hexagon' },
];

export function generateShapeQuantityQuestion(
  difficulty: DifficultyLevel = 2,
  seed?: number
): NGATQuestion {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());

  const rows = difficulty === 1 ? 2 : 3;
  const cols = difficulty === 1 ? 2 : 3;
  const questionRow = rows - 1;
  const questionCol = cols - 1;

  let correctAnswer = 0;
  let ruleSummary = '';
  let steps: string[] = [];

  const cells: CellVisual[][] = [];

  if (difficulty === 1) {
    // 2x2 grid: Left cell has polygon, right cell has polygon sides + multiplier or offset
    const poly1 = POLYGONS[prng.nextInt(0, 1)]; // Triangle (3) or Square (4)
    const poly2 = POLYGONS[poly1.sides === 3 ? 1 : 2]; // Square (4) or Pentagon (5)
    const factor = prng.nextInt(2, 3);
    correctAnswer = poly2.sides * factor;

    ruleSummary = `Each polygon side count is multiplied by ${factor} to yield the adjacent number: ${poly2.name} (${poly2.sides} sides) × ${factor} = ${correctAnswer}.`;
    steps = [
      `Row 1: The ${poly1.name} has ${poly1.sides} sides. Multiplied by ${factor}, it gives ${poly1.sides * factor}.`,
      `Row 2: The ${poly2.name} has ${poly2.sides} sides. Multiplying by ${factor} yields ? = ${correctAnswer}.`,
    ];

    cells.push([
      { type: 'shape', shape: poly1.shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, size: 'md' },
      { type: 'number', value: poly1.sides * factor },
    ]);
    cells.push([
      { type: 'shape', shape: poly2.shape, fill: 'solid', color: NAGLIERI_PALETTE.yellow, size: 'md' },
      { type: 'question-mark' },
    ]);
  } else if (difficulty === 2) {
    // 3x3 grid: Col 0 is Polygon, Col 1 is Multiplier/Number, Col 2 is Product
    const polys = [POLYGONS[0], POLYGONS[1], POLYGONS[2]]; // Triangle (3), Square (4), Pentagon (5)
    const mults = [prng.nextInt(2, 3), prng.nextInt(2, 4), prng.nextInt(3, 5)];
    correctAnswer = polys[2].sides * mults[2];

    ruleSummary = `(Number of sides on the shape) × (Center number) = (Rightmost number). For Row 3: ${polys[2].sides} × ${mults[2]} = ${correctAnswer}.`;
    steps = [
      `Row 1: ${polys[0].name} (${polys[0].sides} sides) × ${mults[0]} = ${polys[0].sides * mults[0]}.`,
      `Row 2: ${polys[1].name} (${polys[1].sides} sides) × ${mults[1]} = ${polys[1].sides * mults[1]}.`,
      `Row 3: ${polys[2].name} (${polys[2].sides} sides) × ${mults[2]} = ${correctAnswer}.`,
    ];

    for (let r = 0; r < 3; r++) {
      const p = polys[r];
      const m = mults[r];
      const rowList: CellVisual[] = [
        { type: 'shape', shape: p.shape, fill: 'solid', color: r === 0 ? NAGLIERI_PALETTE.blue : r === 1 ? NAGLIERI_PALETTE.yellow : NAGLIERI_PALETTE.charcoal, size: 'md' },
        { type: 'number', value: m },
      ];
      if (r === questionRow) {
        rowList.push({ type: 'question-mark' });
      } else {
        rowList.push({ type: 'number', value: p.sides * m });
      }
      cells.push(rowList);
    }
  } else if (difficulty === 3) {
    // 3x3 grid: Two shapes in columns 0 and 1; column 2 is combined side calculation: (Sides A + Sides B) * 2 - offset
    const polyPairs: [PolygonInfo, PolygonInfo][] = [
      [POLYGONS[0], POLYGONS[1]], // 3, 4
      [POLYGONS[1], POLYGONS[2]], // 4, 5
      [POLYGONS[2], POLYGONS[3]], // 5, 6
    ];
    const offset = prng.nextInt(1, 3);
    correctAnswer = (polyPairs[2][0].sides + polyPairs[2][1].sides) * 2 - offset;

    ruleSummary = `Col 3 = 2 × (Sides of Shape 1 + Sides of Shape 2) - ${offset}. For Row 3: 2 × (5 + 6) - ${offset} = ${correctAnswer}.`;
    steps = [
      `Row 1: 2 × (${polyPairs[0][0].sides} + ${polyPairs[0][1].sides}) - ${offset} = ${(polyPairs[0][0].sides + polyPairs[0][1].sides) * 2 - offset}.`,
      `Row 2: 2 × (${polyPairs[1][0].sides} + ${polyPairs[1][1].sides}) - ${offset} = ${(polyPairs[1][0].sides + polyPairs[1][1].sides) * 2 - offset}.`,
      `Row 3: 2 × (${polyPairs[2][0].sides} + ${polyPairs[2][1].sides}) - ${offset} = ${correctAnswer}.`,
    ];

    for (let r = 0; r < 3; r++) {
      const [p1, p2] = polyPairs[r];
      const rowList: CellVisual[] = [
        { type: 'shape', shape: p1.shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, size: 'md' },
        { type: 'shape', shape: p2.shape, fill: 'solid', color: NAGLIERI_PALETTE.yellow, size: 'md' },
      ];
      if (r === questionRow) {
        rowList.push({ type: 'question-mark' });
      } else {
        rowList.push({ type: 'number', value: (p1.sides + p2.sides) * 2 - offset });
      }
      cells.push(rowList);
    }
  } else {
    // Difficulty 4 (TAG Challenge, 97th percentile):
    // 3x3 Non-linear geometric algebra: Col 3 = (Sides A)^2 - (Sides B * Row)
    const polyPairs: [PolygonInfo, PolygonInfo][] = [
      [POLYGONS[0], POLYGONS[1]], // 3, 4
      [POLYGONS[1], POLYGONS[0]], // 4, 3
      [POLYGONS[2], POLYGONS[1]], // 5, 4
    ];
    correctAnswer = polyPairs[2][0].sides * polyPairs[2][0].sides - (polyPairs[2][1].sides * 3);

    ruleSummary = `TAG Rule: (Sides of Shape 1)² - (Sides of Shape 2 × Row number). For Row 3: (5)² - (4 × 3) = 25 - 12 = ${correctAnswer}.`;
    steps = [
      `Row 1: (${polyPairs[0][0].sides})² - (${polyPairs[0][1].sides} × 1) = ${polyPairs[0][0].sides ** 2 - polyPairs[0][1].sides}.`,
      `Row 2: (${polyPairs[1][0].sides})² - (${polyPairs[1][1].sides} × 2) = ${polyPairs[1][0].sides ** 2 - polyPairs[1][1].sides * 2}.`,
      `Row 3: (${polyPairs[2][0].sides})² - (${polyPairs[2][1].sides} × 3) = ${correctAnswer}.`,
    ];

    for (let r = 0; r < 3; r++) {
      const [p1, p2] = polyPairs[r];
      const rowList: CellVisual[] = [
        { type: 'shape', shape: p1.shape, fill: 'solid', color: NAGLIERI_PALETTE.charcoal, size: 'md' },
        { type: 'shape', shape: p2.shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, size: 'md' },
      ];
      if (r === questionRow) {
        rowList.push({ type: 'question-mark' });
      } else {
        const val = p1.sides ** 2 - p2.sides * (r + 1);
        rowList.push({ type: 'number', value: val });
      }
      cells.push(rowList);
    }
  }

  // Generate 4 unique distractors
  const distractors: { value: number; trap: CognitiveTrapType; explanation: string }[] = [];
  const usedValues = new Set<number>([correctAnswer]);

  const candidateTraps: { compute: () => number; trap: CognitiveTrapType; explanation: string }[] = [
    {
      compute: () => correctAnswer + 1,
      trap: 'off-by-one',
      explanation: 'Made an arithmetic counting slip by adding one too many polygon sides.',
    },
    {
      compute: () => Math.max(1, correctAnswer - 1),
      trap: 'off-by-one',
      explanation: 'Under-counted polygon vertices resulting in an off-by-one total calculation.',
    },
    {
      compute: () => correctAnswer + 4,
      trap: 'row-only-trap',
      explanation: 'Extrapolated row addition only without factoring in the shape vertex values.',
    },
    {
      compute: () => Math.max(2, Math.round(correctAnswer / 2)),
      trap: 'wrong-operation',
      explanation: 'Confused addition and multiplication operations while computing shape values.',
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
        explanation: 'Plausible near-miss value resulting from an unverified shape quantity pattern.',
      });
      if (distractors.length >= 4) break;
    }
    const valMinus = correctAnswer - offset;
    if (valMinus > 0 && !usedValues.has(valMinus)) {
      usedValues.add(valMinus);
      distractors.push({
        value: valMinus,
        trap: 'distractor',
        explanation: 'Plausible near-miss value resulting from an unverified shape quantity pattern.',
      });
      if (distractors.length >= 4) break;
    }
    offset++;
  }

  const rawChoices = [
    {
      visual: { type: 'number', value: correctAnswer } as CellVisual,
      trapType: 'correct' as CognitiveTrapType,
      trapExplanation: '',
      isCorrect: true,
    },
    ...distractors.map((d) => ({
      visual: { type: 'number', value: d.value } as CellVisual,
      trapType: d.trap,
      trapExplanation: d.explanation,
      isCorrect: false,
    })),
  ];

  const shuffledChoices = prng.shuffle(rawChoices);
  const correctIndex = shuffledChoices.findIndex((c) => c.isCorrect);

  const labels: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
  const options: ChoiceOption[] = shuffledChoices.map((c, i) => ({
    id: `opt-sq-${i}-${c.visual.type === 'number' ? c.visual.value : i}`,
    label: labels[i],
    visual: c.visual,
    trapType: c.trapType,
    trapExplanation: c.trapExplanation,
  }));

  const stimulus: MatrixGridData = {
    type: 'matrix-grid',
    rows,
    cols,
    cells,
    questionRow,
    questionCol,
    highlightRuleExplanation: ruleSummary,
  };

  const id = `quant-sq-d${difficulty}-s${seed ?? prng.nextInt(1000, 9999)}`;

  return {
    id,
    subtest: 'quantitative',
    archetype: 'shape-quantity',
    difficulty,
    stimulus,
    options,
    correctIndex,
    hints: [
      `Count the number of sides or vertices on each geometric shape in the left column.`,
      `Look for an arithmetic relationship connecting side count to the corresponding numbers.`,
      `Final step: ${ruleSummary}`,
    ],
    ruleSummary,
    stepByStepExplanation: steps,
    speedTip: 'Count sides immediately: Triangle=3, Square=4, Pentagon=5, Hexagon=6, then solve with arithmetic.',
    estimatedSeconds: difficulty * 20 + 25,
  };
}
