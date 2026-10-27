import {
  DifficultyLevel,
  NGATQuestion,
  ChoiceOption,
  NonverbalArchetype,
  QuestionArchetype,
  VisualStimulus,
  CellVisual,
  CognitiveTrapType,
  ShapeType,
  FillType,
} from '../../types/ngat';
import { PRNG, NAGLIERI_PALETTE } from '../utils/prng';

const ALL_NONVERBAL_ARCHETYPES: NonverbalArchetype[] = [
  'pattern-completion',
  'matrix-analogy',
  'serial-reasoning',
  'spatial-visualization',
];

export function generateNonverbalQuestion(
  difficulty: DifficultyLevel = 2,
  archetype?: QuestionArchetype,
  seed?: number
): NGATQuestion {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());

  // Determine actual archetype
  let chosenArchetype: NonverbalArchetype;
  if (archetype && ALL_NONVERBAL_ARCHETYPES.includes(archetype as NonverbalArchetype)) {
    chosenArchetype = archetype as NonverbalArchetype;
  } else {
    chosenArchetype = prng.pick(ALL_NONVERBAL_ARCHETYPES);
  }

  const shapes: ShapeType[] = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star', 'arrow-up'];

  let stimulus: VisualStimulus;
  let correctVisual: CellVisual;
  let ruleSummary = '';
  let steps: string[] = [];
  let distractors: { visual: CellVisual; trap: CognitiveTrapType; explanation: string }[] = [];

  if (chosenArchetype === 'matrix-analogy') {
    // 2x2 Matrix Analogy: A is to B as C is to [ ? ]
    const shapeA = prng.pick(['triangle', 'diamond', 'square', 'star'] as ShapeType[]);
    const shapeC = prng.pick(['circle', 'hexagon', 'arrow-up'] as ShapeType[]);
    const baseColor = NAGLIERI_PALETTE.blue;
    const transformedColor = NAGLIERI_PALETTE.yellow;

    const rotStep = difficulty >= 3 ? 90 : 45;
    const baseRot = 0;
    const targetRot = (baseRot + rotStep) % 360;

    const cellA: CellVisual = { type: 'shape', shape: shapeA, fill: 'solid', color: baseColor, rotation: baseRot, size: 'md' };
    const cellB: CellVisual = { type: 'shape', shape: shapeA, fill: 'striped-diagonal', color: transformedColor, rotation: targetRot, size: 'md' };
    const cellC: CellVisual = { type: 'shape', shape: shapeC, fill: 'solid', color: baseColor, rotation: baseRot, size: 'md' };
    const cellQ: CellVisual = { type: 'question-mark' };

    stimulus = {
      type: 'matrix-grid',
      rows: 2,
      cols: 2,
      cells: [
        [cellA, cellB],
        [cellC, cellQ],
      ],
      questionRow: 1,
      questionCol: 1,
      highlightRuleExplanation: `Transform rule: Rotate ${rotStep}° clockwise, change fill to striped, and color to Yellow.`,
    };

    correctVisual = {
      type: 'shape',
      shape: shapeC,
      fill: 'striped-diagonal',
      color: transformedColor,
      rotation: targetRot,
      size: 'md',
    };

    ruleSummary = `Apply the same transformation from Row 1 to Row 2: Rotate the shape ${rotStep}° clockwise and change its fill to striped-diagonal.`;
    steps = [
      `Examine Row 1: The ${shapeA} turns ${rotStep}° clockwise, and changes from solid Blue to striped Yellow.`,
      `Apply this exact rule to Row 2: The ${shapeC} must rotate ${rotStep}° clockwise and become striped Yellow.`,
    ];

    distractors = [
      {
        visual: { type: 'shape', shape: shapeC, fill: 'striped-diagonal', color: transformedColor, rotation: (360 - rotStep) % 360, size: 'md' },
        trap: 'rotation-direction-trap',
        explanation: `Rotated ${rotStep}° counter-clockwise instead of clockwise, flipping the angular orientation.`,
      },
      {
        visual: { type: 'shape', shape: shapeC, fill: 'solid', color: baseColor, rotation: baseRot, size: 'md' },
        trap: 'visual-surface-trap',
        explanation: 'Copied the left-hand cell directly without applying the row transformation rule.',
      },
      {
        visual: { type: 'shape', shape: shapeA, fill: 'striped-diagonal', color: transformedColor, rotation: targetRot, size: 'md' },
        trap: 'col-only-trap',
        explanation: 'Kept the top shape instead of applying the transformation to the lower row shape.',
      },
      {
        visual: { type: 'shape', shape: shapeC, fill: 'empty', color: NAGLIERI_PALETTE.charcoal, rotation: (targetRot + 180) % 360, size: 'md' },
        trap: 'wrong-operation',
        explanation: 'Applied an erroneous fill and 180° rotation not supported by the analogy.',
      },
    ];
  } else if (chosenArchetype === 'serial-reasoning') {
    // Sequence of 4 frames with rotational progression (e.g. 0° -> 45° -> 90° -> [ ? 135° ])
    const shape = prng.pick(['arrow-up', 'triangle', 'diamond'] as ShapeType[]);
    const rotInc = difficulty === 1 ? 90 : 45;
    const baseRot = prng.nextInt(0, 3) * 45;

    const frames: CellVisual[] = [
      { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: baseRot, size: 'md' },
      { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: (baseRot + rotInc) % 360, size: 'md' },
      { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: (baseRot + 2 * rotInc) % 360, size: 'md' },
      { type: 'question-mark' },
    ];

    const correctRot = (baseRot + 3 * rotInc) % 360;
    correctVisual = {
      type: 'shape',
      shape,
      fill: 'solid',
      color: NAGLIERI_PALETTE.blue,
      rotation: correctRot,
      size: 'md',
    };

    stimulus = {
      type: 'sequence-series',
      frames,
      questionIndex: 3,
      progressionNote: `Rotates ${rotInc}° clockwise at each progressive step.`,
    };

    ruleSummary = `Continuous clockwise rotation by ${rotInc}° per step: final angle is ${correctRot}°.`;
    steps = [
      `Track the orientation from Frame 1 to Frame 3: angle increases by ${rotInc}° each step.`,
      `Add ${rotInc}° clockwise to Frame 3 (${(baseRot + 2 * rotInc) % 360}°): ${correctRot}°.`,
    ];

    distractors = [
      {
        visual: { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: (baseRot + 2 * rotInc - rotInc + 360) % 360, size: 'md' },
        trap: 'rotation-direction-trap',
        explanation: 'Reversed direction by rotating counter-clockwise instead of continuing clockwise.',
      },
      {
        visual: { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: (baseRot + 2 * rotInc) % 360, size: 'md' },
        trap: 'visual-surface-trap',
        explanation: 'Repeated the preceding frame orientation without adding the next rotational step.',
      },
      {
        visual: { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: (correctRot + 90) % 360, size: 'md' },
        trap: 'off-by-one',
        explanation: 'Over-rotated by an extra 90 degrees past the target sequence progression.',
      },
      {
        visual: { type: 'shape', shape, fill: 'striped-diagonal', color: NAGLIERI_PALETTE.yellow, rotation: correctRot, size: 'md' },
        trap: 'wrong-operation',
        explanation: 'Altered color and fill pattern when the puzzle rule strictly concerns angular rotation.',
      },
    ];
  } else if (chosenArchetype === 'spatial-visualization') {
    // Spatial reflection across vertical or horizontal mirror
    const shape = prng.pick(['arrow-right', 'semicircle', 'trapezoid'] as ShapeType[]);
    const isHorizontalReflection = prng.next() > 0.5;

    const cell1: CellVisual = { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: 0, size: 'md' };
    const cell2: CellVisual = { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: isHorizontalReflection ? 180 : 90, size: 'md' };
    const cell3: CellVisual = { type: 'shape', shape, fill: 'striped-v', color: NAGLIERI_PALETTE.yellow, rotation: 0, size: 'md' };
    const cell4: CellVisual = { type: 'question-mark' };

    correctVisual = {
      type: 'shape',
      shape,
      fill: 'striped-v',
      color: NAGLIERI_PALETTE.yellow,
      rotation: isHorizontalReflection ? 180 : 90,
      size: 'md',
    };

    stimulus = {
      type: 'matrix-grid',
      rows: 2,
      cols: 2,
      cells: [
        [cell1, cell2],
        [cell3, cell4],
      ],
      questionRow: 1,
      questionCol: 1,
      highlightRuleExplanation: 'Mirror reflection across the vertical line of symmetry.',
    };

    ruleSummary = `Spatial reflection: reflect the shape ${isHorizontalReflection ? '180° upside-down' : '90° sideways'} across the axis.`;
    steps = [
      `Row 1 shows an object reflected across the central symmetry line.`,
      `Applying the identical spatial reflection to Row 2 gives the correctly oriented figure.`,
    ];

    distractors = [
      {
        visual: { type: 'shape', shape, fill: 'striped-v', color: NAGLIERI_PALETTE.yellow, rotation: 0, size: 'md' },
        trap: 'visual-surface-trap',
        explanation: 'Unreflected original shape copied directly without performing the spatial mirror operation.',
      },
      {
        visual: { type: 'shape', shape, fill: 'striped-v', color: NAGLIERI_PALETTE.yellow, rotation: isHorizontalReflection ? 90 : 180, size: 'md' },
        trap: 'rotation-direction-trap',
        explanation: 'Reflected across the incorrect axis (horizontal instead of vertical reflection).',
      },
      {
        visual: { type: 'shape', shape, fill: 'solid', color: NAGLIERI_PALETTE.blue, rotation: isHorizontalReflection ? 180 : 90, size: 'md' },
        trap: 'col-only-trap',
        explanation: 'Matched spatial orientation but failed to maintain the yellow striped pattern.',
      },
      {
        visual: { type: 'shape', shape, fill: 'empty', color: NAGLIERI_PALETTE.charcoal, rotation: 270, size: 'md' },
        trap: 'wrong-operation',
        explanation: 'Arbitrary 270° rotation and empty outline that does not match the mirror symmetry.',
      },
    ];
  } else {
    // Pattern Completion (spatial completion or matrix grid tessellation)
    const shapeA = prng.pick(shapes);
    const shapeB = prng.pick(shapes.filter((s) => s !== shapeA));
    const fillA: FillType = 'solid';
    const fillB: FillType = 'striped-h';

    // 2x2 or 3x3 alternating checkerboard pattern
    const size = difficulty === 1 ? 2 : 3;
    const cells: CellVisual[][] = [];

    for (let r = 0; r < size; r++) {
      const rowList: CellVisual[] = [];
      for (let c = 0; c < size; c++) {
        if (r === size - 1 && c === size - 1) {
          rowList.push({ type: 'question-mark' });
        } else {
          const isEven = (r + c) % 2 === 0;
          rowList.push({
            type: 'shape',
            shape: isEven ? shapeA : shapeB,
            fill: isEven ? fillA : fillB,
            color: isEven ? NAGLIERI_PALETTE.blue : NAGLIERI_PALETTE.yellow,
            size: 'md',
          });
        }
      }
      cells.push(rowList);
    }

    const isQuestionEven = (2 * (size - 1)) % 2 === 0;
    correctVisual = {
      type: 'shape',
      shape: isQuestionEven ? shapeA : shapeB,
      fill: isQuestionEven ? fillA : fillB,
      color: isQuestionEven ? NAGLIERI_PALETTE.blue : NAGLIERI_PALETTE.yellow,
      size: 'md',
    };

    stimulus = {
      type: 'spatial-completion',
      matrixSize: size as 2 | 3,
      gridCells: cells,
      cutoutRow: size - 1,
      cutoutCol: size - 1,
      backgroundPattern: 'geometric',
    };

    ruleSummary = `Tessellation rule: Alternating checkerboard pattern between Blue ${shapeA} and Yellow ${shapeB}.`;
    steps = [
      `Look at the grid diagonals and rows: shapes alternate between Blue ${shapeA} and Yellow ${shapeB}.`,
      `The missing corner cell must be a ${isQuestionEven ? `Blue ${shapeA}` : `Yellow ${shapeB}`} to complete the pattern.`,
    ];

    distractors = [
      {
        visual: {
          type: 'shape',
          shape: isQuestionEven ? shapeB : shapeA,
          fill: isQuestionEven ? fillB : fillA,
          color: isQuestionEven ? NAGLIERI_PALETTE.yellow : NAGLIERI_PALETTE.blue,
          size: 'md',
        },
        trap: 'row-only-trap',
        explanation: 'Selected the opposite alternating pattern element, breaking checkerboard symmetry.',
      },
      {
        visual: {
          type: 'shape',
          shape: isQuestionEven ? shapeA : shapeB,
          fill: 'empty',
          color: NAGLIERI_PALETTE.charcoal,
          size: 'md',
        },
        trap: 'wrong-operation',
        explanation: 'Selected an empty uncolored shape that does not match the solid and striped fills.',
      },
      {
        visual: {
          type: 'shape',
          shape: 'diamond',
          fill: 'striped-diagonal',
          color: NAGLIERI_PALETTE.charcoal,
          size: 'md',
        },
        trap: 'distractor',
        explanation: 'Introduced an extraneous geometric shape absent from the tessellation matrix.',
      },
      {
        visual: {
          type: 'shape',
          shape: isQuestionEven ? shapeA : shapeB,
          fill: isQuestionEven ? fillA : fillB,
          color: NAGLIERI_PALETTE.charcoal,
          rotation: 90,
          size: 'md',
        },
        trap: 'rotation-direction-trap',
        explanation: 'Wrong rotation and charcoal coloring applied to the matching shape.',
      },
    ];
  }

  // Ensure all 5 choice visuals are completely unique
  const rawChoices = [
    {
      visual: correctVisual,
      trapType: 'correct' as CognitiveTrapType,
      trapExplanation: '',
      isCorrect: true,
    },
    ...distractors.slice(0, 4).map((d) => ({
      visual: d.visual,
      trapType: d.trap,
      trapExplanation: d.explanation,
      isCorrect: false,
    })),
  ];

  // Guarantee uniqueness of JSON.stringify(visual)
  const usedVisuals = new Set<string>();
  usedVisuals.add(JSON.stringify(correctVisual));

  const uniqueChoices: typeof rawChoices = [rawChoices[0]];
  for (let i = 1; i < rawChoices.length; i++) {
    let candidate = rawChoices[i];
    let candidateKey = JSON.stringify(candidate.visual);
    let attempt = 0;
    while (usedVisuals.has(candidateKey) && attempt < 10) {
      // Modify rotation or color to guarantee uniqueness
      if (candidate.visual.type === 'shape') {
        candidate = {
          ...candidate,
          visual: {
            ...candidate.visual,
            rotation: ((candidate.visual.rotation ?? 0) + 45 * (attempt + 1)) % 360,
          },
        };
      }
      candidateKey = JSON.stringify(candidate.visual);
      attempt++;
    }
    usedVisuals.add(candidateKey);
    uniqueChoices.push(candidate);
  }

  const shuffledChoices = prng.shuffle(uniqueChoices);
  const correctIndex = shuffledChoices.findIndex((c) => c.isCorrect);

  const labels: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
  const options: ChoiceOption[] = shuffledChoices.map((c, i) => ({
    id: `opt-nv-${i}-${i}`,
    label: labels[i],
    visual: c.visual,
    trapType: c.trapType,
    trapExplanation: c.trapExplanation,
  }));

  const id = `nonverbal-${chosenArchetype}-d${difficulty}-s${seed ?? prng.nextInt(1000, 9999)}`;

  return {
    id,
    subtest: 'nonverbal',
    archetype: chosenArchetype,
    difficulty,
    stimulus,
    options,
    correctIndex,
    hints: [
      `Look closely at the orientation, color, and fill transitions between adjacent figures.`,
      `Identify the geometric rule: is it rotating, reflecting, alternating, or scaling?`,
      `Apply the confirmed rule: ${ruleSummary}`,
    ],
    ruleSummary,
    stepByStepExplanation: steps,
    speedTip: 'On nonverbal puzzles, isolate one feature at a time: first shape, then color/fill, then rotation angle.',
    estimatedSeconds: difficulty * 20 + 20,
  };
}
