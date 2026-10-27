import {
  DifficultyLevel,
  NGATQuestion,
  ChoiceOption,
  MatrixGridData,
  CellVisual,
  CognitiveTrapType,
} from '../../types/ngat';
import { PRNG } from '../utils/prng';

interface PatternRule {
  computeCell: (r: number, c: number, base: number, step1: number, step2: number) => number;
  description: string;
  ruleSummary: string;
  steps: (r: number, c: number, base: number, step1: number, step2: number, ans: number) => string[];
  rowTrap?: (r: number, c: number, base: number, step1: number, step2: number) => number;
  colTrap?: (r: number, c: number, base: number, step1: number, step2: number) => number;
  wrongOpTrap?: (r: number, c: number, base: number, step1: number, step2: number) => number;
}

export function generateNumberMatrixQuestion(
  difficulty: DifficultyLevel = 2,
  seed?: number
): NGATQuestion {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());
  const rows = difficulty === 1 ? 2 : 3;
  const cols = difficulty === 1 ? 2 : 3;
  const questionRow = rows - 1;
  const questionCol = cols - 1;

  // Pattern parameters tuned by difficulty
  let base = prng.nextInt(2, 6);
  let step1 = prng.nextInt(1, 4);
  let step2 = prng.nextInt(2, 5);

  let rule: PatternRule;

  if (difficulty === 1) {
    // 2x2 Simple Addition or Row Step
    const mode = prng.nextInt(0, 1);
    if (mode === 0) {
      rule = {
        computeCell: (r, c) => base + r * step2 + c * step1,
        description: `Each row increases by ${step1} from left to right.`,
        ruleSummary: `Add ${step1} across each row: Row 2 is ${base + step2} + ${step1}.`,
        steps: (_r, _c, _b, _s1, _s2, ans) => [
          `Examine Row 1: ${base} + ${step1} = ${base + step1}.`,
          `Examine Row 2: ${base + step2} + ${step1} = ${ans}.`,
        ],
        rowTrap: () => base + step2 + step1 + 1,
        colTrap: () => base + step2 * 2,
        wrongOpTrap: () => (base + step2) * step1,
      };
    } else {
      rule = {
        computeCell: (r, c) => (base + r * step1) * (c === 0 ? 1 : 2),
        description: 'Each column doubles the value of the first cell in that row.',
        ruleSummary: 'Double each number from column 1 to column 2.',
        steps: (_r, _c, _b, _s1, _s2, ans) => [
          `In Row 1, ${base} is multiplied by 2 to get ${base * 2}.`,
          `In Row 2, ${base + step1} is multiplied by 2 to give ${ans}.`,
        ],
        rowTrap: () => (base + step1) + 2,
        colTrap: () => (base + step1) * 3,
        wrongOpTrap: () => (base + step1) + step1,
      };
    }
  } else if (difficulty === 2) {
    const mode = prng.nextInt(0, 1);
    if (mode === 0) {
      base = prng.nextInt(2, 7);
      step1 = prng.nextInt(1, 4);
      step2 = prng.nextInt(3, 8);
      rule = {
        computeCell: (r, c) => {
          const c0 = base + r * 2;
          const c1 = step2 + r * 3;
          if (c === 0) return c0;
          if (c === 1) return c1;
          return c0 + c1;
        },
        description: 'In each row, Column 1 plus Column 2 equals Column 3.',
        ruleSummary: 'Column 1 + Column 2 = Column 3 across every row.',
        steps: (_r, _c, _b, _s1, _s2, ans) => [
          `Check Row 1: Column 1 + Column 2 equals Column 3.`,
          `Check Row 2: The same addition rule holds.`,
          `Row 3: Add the two given numbers together to find ? = ${ans}.`,
        ],
        rowTrap: (r) => (base + r * 2) + (step2 + r * 3) + 2,
        colTrap: (r) => (step2 + r * 3) * 2,
        wrongOpTrap: (r) => Math.abs((base + r * 2) - (step2 + r * 3)),
      };
    } else {
      rule = {
        computeCell: (r, c) => base + r * step2 + c * step1,
        description: `Each row increases by ${step1} across, and down by ${step2}.`,
        ruleSummary: `Add ${step1} horizontally and ${step2} vertically.`,
        steps: (_r, _c, _b, _s1, _s2, ans) => [
          `Look across Row 1: each number increases by ${step1}.`,
          `Look down Column 3: each number increases by ${step2}.`,
          `Applying both checks gives ? = ${ans}.`,
        ],
        rowTrap: () => base + 2 * step2 + step1,
        colTrap: () => base + step2 + 2 * step1,
        wrongOpTrap: () => (base + 2 * step2) * step1,
      };
    }
  } else if (difficulty === 3) {
    base = prng.nextInt(2, 5);
    step1 = prng.nextInt(2, 4);
    rule = {
      computeCell: (r, c) => {
        const c0 = base + r;
        const c1 = step1 + r;
        if (c === 0) return c0;
        if (c === 1) return c1;
        return c0 * 2 + c1;
      },
      description: 'Column 3 is obtained by doubling Column 1 and adding Column 2.',
      ruleSummary: 'Rule: 2 × (Column 1) + (Column 2) = Column 3.',
      steps: (_r, _c, _b, _s1, _s2, ans) => [
        `In Row 1: 2 × (${base}) + (${step1}) = ${base * 2 + step1}.`,
        `In Row 2: 2 × (${base + 1}) + (${step1 + 1}) = ${(base + 1) * 2 + step1 + 1}.`,
        `In Row 3: 2 × (${base + 2}) + (${step1 + 2}) = ${ans}.`,
      ],
      rowTrap: () => (base + 2) + (step1 + 2),
      colTrap: () => (base + 2) * (step1 + 2),
      wrongOpTrap: () => (base + 2) * 2 - (step1 + 2),
    };
  } else {
    // Difficulty 4 (TAG Challenge, 97th percentile)
    base = prng.nextInt(3, 6);
    step1 = prng.nextInt(1, 3);
    rule = {
      computeCell: (r, c) => {
        const c0 = base + r;
        const c1 = step1 + r * 2;
        if (c === 0) return c0;
        if (c === 1) return c1;
        return c0 * c1 - (r + 1);
      },
      description: 'Column 3 = (Column 1 × Column 2) minus (Row number).',
      ruleSummary: 'TAG Rule: (Col 1 × Col 2) - (Row index) = Col 3.',
      steps: (_r, _c, _b, _s1, _s2, ans) => [
        `Row 1: (${base} × ${step1}) - 1 = ${base * step1 - 1}.`,
        `Row 2: (${base + 1} × ${step1 + 2}) - 2 = ${(base + 1) * (step1 + 2) - 2}.`,
        `Row 3: (${base + 2} × ${step1 + 4}) - 3 = ${ans}.`,
      ],
      rowTrap: () => (base + 2) * (step1 + 4),
      colTrap: () => (base + 2) + (step1 + 4),
      wrongOpTrap: () => (base + 2) * (step1 + 4) + 3,
    };
  }

  // Populate matrix grid
  const cells: CellVisual[][] = [];
  for (let r = 0; r < rows; r++) {
    const rowCells: CellVisual[] = [];
    for (let c = 0; c < cols; c++) {
      if (r === questionRow && c === questionCol) {
        rowCells.push({ type: 'question-mark' });
      } else {
        const val = rule.computeCell(r, c, base, step1, step2);
        rowCells.push({
          type: 'number',
          value: val,
        });
      }
    }
    cells.push(rowCells);
  }

  const correctAnswer = rule.computeCell(questionRow, questionCol, base, step1, step2);

  // Generate distinct distractors
  const distractors: { value: number; trap: CognitiveTrapType; explanation: string }[] = [];
  const usedValues = new Set<number>([correctAnswer]);

  const candidateTraps: {
    compute: () => number;
    trap: CognitiveTrapType;
    explanation: string;
  }[] = [
    {
      compute: () => (rule.rowTrap ? rule.rowTrap(questionRow, questionCol, base, step1, step2) : correctAnswer + step1),
      trap: 'row-only-trap',
      explanation: 'Calculated using only the horizontal row progression while ignoring the column relationship.',
    },
    {
      compute: () => (rule.colTrap ? rule.colTrap(questionRow, questionCol, base, step1, step2) : correctAnswer + step2),
      trap: 'col-only-trap',
      explanation: 'Applied the vertical column pattern only without confirming the horizontal row rule.',
    },
    {
      compute: () => (rule.wrongOpTrap ? rule.wrongOpTrap(questionRow, questionCol, base, step1, step2) : correctAnswer - 2),
      trap: 'wrong-operation',
      explanation: 'Used an incorrect arithmetic operation (such as adding instead of multiplying or vice versa).',
    },
    {
      compute: () => correctAnswer + (prng.next() > 0.5 ? 1 : -1),
      trap: 'off-by-one',
      explanation: 'Off-by-one calculation error from an arithmetic slip during multi-step evaluation.',
    },
    {
      compute: () => {
        const cell = cells[0][0];
        return cell.type === 'number' ? (typeof cell.value === 'number' ? cell.value : 10) : 10;
      },
      trap: 'visual-surface-trap',
      explanation: 'Selected a surface number directly visible elsewhere in the grid instead of solving the formula.',
    },
  ];

  for (const candidate of candidateTraps) {
    if (distractors.length >= 4) break;
    const val = Math.round(candidate.compute());
    if (!usedValues.has(val) && val > 0) {
      usedValues.add(val);
      distractors.push({
        value: val,
        trap: candidate.trap,
        explanation: candidate.explanation,
      });
    }
  }

  // Fallback to fill up to 4 distractors if needed
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
    id: `opt-nm-${i}-${c.visual.type === 'number' ? c.visual.value : i}`,
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
    highlightRuleExplanation: rule.ruleSummary,
  };

  const id = `quant-nm-d${difficulty}-s${seed ?? prng.nextInt(1000, 9999)}`;

  return {
    id,
    subtest: 'quantitative',
    archetype: 'number-matrix',
    difficulty,
    stimulus,
    options,
    correctIndex,
    hints: [
      `Scan each row from left to right, then scan each column from top to bottom to check for constant changes.`,
      `Look for an arithmetic relationship: ${rule.description}`,
      `The precise formula is: ${rule.ruleSummary} Solving for the missing cell yields ${correctAnswer}.`,
    ],
    ruleSummary: rule.ruleSummary,
    stepByStepExplanation: rule.steps(questionRow, questionCol, base, step1, step2, correctAnswer),
    speedTip: 'On matrix puzzles, test row 1 first. If the row rule also holds for row 2, apply it directly to find ?.',
    estimatedSeconds: difficulty * 20 + 25,
  };
}
