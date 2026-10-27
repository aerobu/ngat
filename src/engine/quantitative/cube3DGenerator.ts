import {
  DifficultyLevel,
  NGATQuestion,
  ChoiceOption,
  Cube3DData,
  CellVisual,
  CognitiveTrapType,
} from '../../types/ngat';
import { PRNG } from '../utils/prng';

export function generateCube3DQuestion(
  difficulty: DifficultyLevel = 2,
  seed?: number
): NGATQuestion {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());

  const rows = difficulty === 1 ? 2 : 3;
  const cols = difficulty === 1 ? 2 : 3;

  // Generate column height grid
  // To ensure hidden cubes exist on higher difficulties, make back columns tall and front columns slightly shorter
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const rowHeights: number[] = [];
    for (let c = 0; c < cols; c++) {
      let h = 0;
      if (difficulty === 1) {
        h = prng.nextInt(1, 3);
      } else if (difficulty === 2) {
        h = prng.nextInt(1, 4);
      } else {
        // Difficulty 3 & 4: higher stacks to create hidden supporting cubes
        h = prng.nextInt(1, 5);
      }
      rowHeights.push(h);
    }
    grid.push(rowHeights);
  }

  // Ensure at least one positive height
  if (grid[0][0] === 0) grid[0][0] = 1;

  // Compute total, visible, and hidden cubes
  let totalCubes = 0;
  let visibleCubes = 0;
  let hiddenCubes = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const colHeight = grid[r][c];
      totalCubes += colHeight;

      for (let z = 1; z <= colHeight; z++) {
        // A cube at layer z in column (r, c) is visible if:
        // 1. Top face is visible: it is the top of this column (z === colHeight)
        // 2. Front face is visible: no taller block directly in front (r === rows - 1 || z > grid[r + 1][c])
        // 3. Right face is visible: no taller block directly to its right (c === cols - 1 || z > grid[r][c + 1])
        const topVisible = z === colHeight;
        const frontVisible = r === rows - 1 || z > grid[r + 1][c];
        const rightVisible = c === cols - 1 || z > grid[r][c + 1];

        if (topVisible || frontVisible || rightVisible) {
          visibleCubes++;
        } else {
          hiddenCubes++;
        }
      }
    }
  }

  // Choose question type based on difficulty
  let questionType: 'total-cubes' | 'hidden-cubes' | 'visible-cubes' = 'total-cubes';
  if (difficulty === 3 && hiddenCubes > 0) {
    questionType = 'hidden-cubes';
  } else if (difficulty === 4 && hiddenCubes > 0) {
    questionType = prng.next() > 0.5 ? 'hidden-cubes' : 'total-cubes';
  }

  const correctAnswer =
    questionType === 'total-cubes'
      ? totalCubes
      : questionType === 'hidden-cubes'
      ? hiddenCubes
      : visibleCubes;

  const targetLabel =
    questionType === 'total-cubes'
      ? 'total cubes'
      : questionType === 'hidden-cubes'
      ? 'hidden supporting cubes'
      : 'visible cubes';

  let ruleSummary = '';
  let steps: string[] = [];

  if (questionType === 'total-cubes') {
    ruleSummary = `Total Cubes = sum of all column heights = ${totalCubes} cubes (${visibleCubes} visible + ${hiddenCubes} hidden).`;
    steps = [
      `Count each vertical column from back to front: sum of heights = ${totalCubes}.`,
      `Remember that taller upper blocks require underlying cubes to support them.`,
      `Total = ${visibleCubes} visible cubes + ${hiddenCubes} hidden supporting cubes = ${totalCubes}.`,
    ];
  } else if (questionType === 'hidden-cubes') {
    ruleSummary = `Hidden Cubes = Total Cubes (${totalCubes}) - Visible Cubes (${visibleCubes}) = ${hiddenCubes} hidden cubes.`;
    steps = [
      `Calculate total blocks across all columns: ${totalCubes} blocks.`,
      `Identify the cubes visible from top, front, and right perspectives: ${visibleCubes} visible.`,
      `Subtract visible from total: ${totalCubes} - ${visibleCubes} = ${hiddenCubes} hidden supporting cubes.`,
    ];
  } else {
    ruleSummary = `Visible Cubes = ${visibleCubes} blocks with at least one exposed face.`;
    steps = [
      `Count the blocks that show at least one face (top, front, or side).`,
      `Excluding internal supporting blocks gives ${visibleCubes} visible cubes.`,
    ];
  }

  // Generate 4 distinct distractors
  const distractors: { value: number; trap: CognitiveTrapType; explanation: string }[] = [];
  const usedValues = new Set<number>([correctAnswer]);

  const candidateTraps: { compute: () => number; trap: CognitiveTrapType; explanation: string }[] = [];

  if (questionType === 'total-cubes') {
    candidateTraps.push(
      {
        compute: () => visibleCubes,
        trap: 'hidden-block-trap',
        explanation: 'Counted only visible cubes and completely ignored the hidden supporting blocks underneath.',
      },
      {
        compute: () => totalCubes + 1,
        trap: 'off-by-one',
        explanation: 'Off by +1 from double-counting a corner column where two outer faces meet.',
      },
      {
        compute: () => Math.max(1, totalCubes - 1),
        trap: 'off-by-one',
        explanation: 'Off by -1 from missing one of the internal supporting cubes under the tallest stack.',
      },
      {
        compute: () => rows * cols * Math.max(...grid.flat()),
        trap: 'wrong-operation',
        explanation: 'Calculated the full rectangular prism bounding box instead of counting actual blocks.',
      }
    );
  } else if (questionType === 'hidden-cubes') {
    candidateTraps.push(
      {
        compute: () => totalCubes,
        trap: 'wrong-operation',
        explanation: 'Reported the total cube count instead of isolating the hidden supporting blocks.',
      },
      {
        compute: () => visibleCubes,
        trap: 'visual-surface-trap',
        explanation: 'Confused visible cubes with hidden cubes, reporting the count of exposed faces.',
      },
      {
        compute: () => hiddenCubes + 1,
        trap: 'off-by-one',
        explanation: 'Off by +1 by assuming an additional supporting cube under an exposed column.',
      },
      {
        compute: () => Math.max(0, hiddenCubes - 1),
        trap: 'off-by-one',
        explanation: 'Off by -1 by overlooking a supporting cube directly behind the center stack.',
      }
    );
  } else {
    candidateTraps.push(
      {
        compute: () => totalCubes,
        trap: 'hidden-block-trap',
        explanation: 'Included hidden supporting cubes that are not visible from the given viewing angle.',
      },
      {
        compute: () => visibleCubes + 1,
        trap: 'off-by-one',
        explanation: 'Off by +1 from double counting a corner cube visible from two sides.',
      },
      {
        compute: () => Math.max(1, visibleCubes - 1),
        trap: 'off-by-one',
        explanation: 'Off by -1 by missing an exposed side face on the lowest front layer.',
      },
      {
        compute: () => rows * cols,
        trap: 'visual-surface-trap',
        explanation: 'Counted only the base footprint rather than the full 3D visible height.',
      }
    );
  }

  for (const candidate of candidateTraps) {
    if (distractors.length >= 4) break;
    const val = candidate.compute();
    if (!usedValues.has(val) && val >= 0) {
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
        explanation: 'Plausible count error resulting from misjudging the column height layers.',
      });
      if (distractors.length >= 4) break;
    }
    const valMinus = correctAnswer - offset;
    if (valMinus >= 0 && !usedValues.has(valMinus)) {
      usedValues.add(valMinus);
      distractors.push({
        value: valMinus,
        trap: 'distractor',
        explanation: 'Plausible count error resulting from misjudging the column height layers.',
      });
      if (distractors.length >= 4) break;
    }
    offset++;
  }

  const rawChoices = [
    {
      visual: { type: 'number', value: correctAnswer, label: targetLabel } as CellVisual,
      trapType: 'correct' as CognitiveTrapType,
      trapExplanation: '',
      isCorrect: true,
    },
    ...distractors.map((d) => ({
      visual: { type: 'number', value: d.value, label: targetLabel } as CellVisual,
      trapType: d.trap,
      trapExplanation: d.explanation,
      isCorrect: false,
    })),
  ];

  const shuffledChoices = prng.shuffle(rawChoices);
  const correctIndex = shuffledChoices.findIndex((c) => c.isCorrect);

  const labels: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
  const options: ChoiceOption[] = shuffledChoices.map((c, i) => ({
    id: `opt-c3d-${i}-${c.visual.type === 'number' ? c.visual.value : i}`,
    label: labels[i],
    visual: c.visual,
    trapType: c.trapType,
    trapExplanation: c.trapExplanation,
  }));

  const stimulus: Cube3DData = {
    type: 'cube-3d',
    grid,
    totalCubes,
    visibleCubes,
    hiddenCubes,
    questionType,
  };

  const id = `quant-c3d-d${difficulty}-s${seed ?? prng.nextInt(1000, 9999)}`;

  return {
    id,
    subtest: 'quantitative',
    archetype: 'cube-3d',
    difficulty,
    stimulus,
    options,
    correctIndex,
    hints: [
      `Analyze the structure column by column: write down the height of each column on your scratchpad.`,
      `Remember: A block on layer 3 requires blocks on layer 1 and layer 2 underneath it to stand!`,
      `Final calculation: ${ruleSummary}`,
    ],
    ruleSummary,
    stepByStepExplanation: steps,
    speedTip: 'Count by columns from back to front: write height numbers in a 2D grid, then sum them up.',
    estimatedSeconds: difficulty * 25 + 30,
  };
}
