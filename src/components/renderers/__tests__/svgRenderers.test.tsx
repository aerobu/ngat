import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  CellVisual,
  ShapeType,
  FillType,
  MatrixGridData,
  SpatialCompletionData,
  SequenceData,
  BalanceScaleData,
  Cube3DData,
  VerbalGridData,
} from '../../../types/ngat';
import { GeometricShapeSVG } from '../GeometricShapeSVG';
import { MatrixGridSVG } from '../MatrixGridSVG';
import { BalanceScaleSVG } from '../BalanceScaleSVG';
import { IsometricCubeSVG } from '../IsometricCubeSVG';
import { VerbalIllustrationSVG } from '../VerbalIllustrationSVG';
import { StimulusRenderer } from '../StimulusRenderer';

import { generateNumberMatrixQuestion } from '../../../engine/quantitative/numberMatrixGenerator';
import { generateBalanceScaleQuestion } from '../../../engine/quantitative/balanceScaleGenerator';
import { generateShapeQuantityQuestion } from '../../../engine/quantitative/shapeQuantityGenerator';
import { generateSequenceQuestion } from '../../../engine/quantitative/sequenceAndDiceGenerator';
import { generateCube3DQuestion } from '../../../engine/quantitative/cube3DGenerator';
import { generateNonverbalQuestion } from '../../../engine/nonverbal/nonverbalGenerator';
import { generateVerbalQuestion } from '../../../engine/verbal/verbalQuestionBank';

describe('Precision SVG Renderers Suite', () => {
  // ==========================================================================
  // 1. GeometricShapeSVG Component Tests
  // ==========================================================================
  describe('GeometricShapeSVG', () => {
    it('renders an SVG container with data-testid="geometric-shape-svg" and valid viewBox', () => {
      const visual: CellVisual = {
        type: 'shape',
        shape: 'circle',
        fill: 'solid',
        color: '#1E5AA8',
      };
      render(<GeometricShapeSVG visual={visual} size={100} />);
      const svg = screen.getByTestId('geometric-shape-svg');
      expect(svg).toBeInTheDocument();
      expect(svg.tagName.toLowerCase()).toBe('svg');
      expect(svg.getAttribute('viewBox')).toBeTruthy();
    });

    const SHAPES: ShapeType[] = [
      'circle',
      'square',
      'triangle',
      'pentagon',
      'hexagon',
      'star',
      'diamond',
      'arrow-up',
      'semicircle',
      'cross',
    ];

    it.each(SHAPES)('renders geometric shape "%s" with proper SVG geometry', (shape) => {
      const visual: CellVisual = {
        type: 'shape',
        shape,
        fill: 'solid',
        color: '#FF6F00',
      };
      const { container } = render(<GeometricShapeSVG visual={visual} />);
      const svg = screen.getByTestId('geometric-shape-svg');
      expect(svg).toBeInTheDocument();
      // Should contain at least one geometric element: path, polygon, rect, circle, etc.
      const hasGeometry = container.querySelector('path, polygon, rect, circle, ellipse');
      expect(hasGeometry).not.toBeNull();
    });

    const FILLS: FillType[] = [
      'solid',
      'empty',
      'striped-h',
      'striped-v',
      'dotted',
      'checkerboard',
    ];

    it.each(FILLS)('renders fill pattern "%s" correctly', (fill) => {
      const visual: CellVisual = {
        type: 'shape',
        shape: 'square',
        fill,
        color: '#1E5AA8',
      };
      const { container } = render(<GeometricShapeSVG visual={visual} />);
      const svg = screen.getByTestId('geometric-shape-svg');
      expect(svg).toBeInTheDocument();

      if (['striped-h', 'striped-v', 'dotted', 'checkerboard'].includes(fill)) {
        // Pattern fills must register SVG pattern definitions inside <defs>
        const pattern = container.querySelector('pattern');
        expect(pattern).not.toBeNull();
      }
    });

    it('applies rotation transform when rotation property is set', () => {
      const visual: CellVisual = {
        type: 'shape',
        shape: 'triangle',
        fill: 'solid',
        color: '#00897B',
        rotation: 90,
      };
      const { container } = render(<GeometricShapeSVG visual={visual} />);
      const rotatedElement = container.querySelector('[transform*="rotate(90"]');
      expect(rotatedElement).not.toBeNull();
    });

    it('renders type: "number" with numeric value and optional subtext label', () => {
      const visual: CellVisual = {
        type: 'number',
        value: 42,
        subtext: 'Double value',
        color: '#111827',
      };
      render(<GeometricShapeSVG visual={visual} />);
      expect(screen.getByTestId('geometric-shape-svg')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Double value')).toBeInTheDocument();
    });

    it.each([1, 2, 3, 4, 5, 6])(
      'renders type: "dice" with exactly %i pip circles with data-testid="dice-pip"',
      (pips) => {
        const visual: CellVisual = {
          type: 'dice',
          pips,
          color: '#FFFFFF',
          pipColor: '#111827',
        };
        render(<GeometricShapeSVG visual={visual} />);
        expect(screen.getByTestId('geometric-shape-svg')).toBeInTheDocument();
        const pipElements = screen.getAllByTestId('dice-pip');
        expect(pipElements).toHaveLength(pips);
      }
    );

    it('renders type: "question-mark" displaying "?" with data-testid="question-mark-cell"', () => {
      const visual: CellVisual = {
        type: 'question-mark',
        color: '#E53E3E',
      };
      render(<GeometricShapeSVG visual={visual} />);
      const qMark = screen.getByTestId('question-mark-cell');
      expect(qMark).toBeInTheDocument();
      expect(qMark.textContent).toContain('?');
    });

    it('renders type: "verbal-word" utilizing verbal illustration styling', () => {
      const visual: CellVisual = {
        type: 'verbal-word',
        word: 'PENGUIN',
        category: 'Birds',
        iconName: 'bird',
      };
      render(<GeometricShapeSVG visual={visual} />);
      expect(screen.getByText('PENGUIN')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // 2. MatrixGridSVG Component Tests
  // ==========================================================================
  describe('MatrixGridSVG', () => {
    it('renders a 2x2 matrix-grid with data-testid="matrix-grid-svg" and individual cells', () => {
      const data: MatrixGridData = {
        type: 'matrix-grid',
        rows: 2,
        cols: 2,
        cells: [
          [
            { type: 'number', value: 3 },
            { type: 'number', value: 6 },
          ],
          [
            { type: 'number', value: 9 },
            { type: 'question-mark' },
          ],
        ],
        questionRow: 1,
        questionCol: 1,
      };

      render(<MatrixGridSVG data={data} />);
      expect(screen.getByTestId('matrix-grid-svg')).toBeInTheDocument();
      expect(screen.getByTestId('matrix-cell-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('matrix-cell-0-1')).toBeInTheDocument();
      expect(screen.getByTestId('matrix-cell-1-0')).toBeInTheDocument();
      expect(screen.getByTestId('matrix-cell-1-1')).toBeInTheDocument();

      // Question cell at [1][1]
      const questionCell = screen.getByTestId('matrix-cell-1-1');
      expect(questionCell.querySelector('[data-testid="question-mark-cell"]')).toBeInTheDocument();
    });

    it('renders a 3x3 matrix-grid with all 9 cells', () => {
      const data: MatrixGridData = {
        type: 'matrix-grid',
        rows: 3,
        cols: 3,
        cells: [
          [{ type: 'shape', shape: 'circle', fill: 'solid', color: '#1E5AA8' }, { type: 'shape', shape: 'circle', fill: 'empty', color: '#1E5AA8' }, { type: 'shape', shape: 'circle', fill: 'striped-h', color: '#1E5AA8' }],
          [{ type: 'shape', shape: 'square', fill: 'solid', color: '#1E5AA8' }, { type: 'shape', shape: 'square', fill: 'empty', color: '#1E5AA8' }, { type: 'shape', shape: 'square', fill: 'striped-h', color: '#1E5AA8' }],
          [{ type: 'shape', shape: 'triangle', fill: 'solid', color: '#1E5AA8' }, { type: 'shape', shape: 'triangle', fill: 'empty', color: '#1E5AA8' }, { type: 'question-mark' }],
        ],
        questionRow: 2,
        questionCol: 2,
      };

      render(<MatrixGridSVG data={data} />);
      expect(screen.getByTestId('matrix-grid-svg')).toBeInTheDocument();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          expect(screen.getByTestId(`matrix-cell-${r}-${c}`)).toBeInTheDocument();
        }
      }
    });

    it('renders matrix rule highlight indicators when showHighlight={true}', () => {
      const data: MatrixGridData = {
        type: 'matrix-grid',
        rows: 2,
        cols: 2,
        cells: [
          [{ type: 'number', value: 2 }, { type: 'number', value: 4 }],
          [{ type: 'number', value: 6 }, { type: 'question-mark' }],
        ],
        questionRow: 1,
        questionCol: 1,
        highlightRow: 0,
      };

      const { rerender } = render(<MatrixGridSVG data={data} showHighlight={false} />);
      expect(screen.queryByTestId('matrix-rule-highlight')).not.toBeInTheDocument();

      rerender(<MatrixGridSVG data={data} showHighlight={true} />);
      expect(screen.getByTestId('matrix-rule-highlight')).toBeInTheDocument();
    });

    it('renders spatial-completion stimulus with data-testid="spatial-completion-svg"', () => {
      const data: SpatialCompletionData = {
        type: 'spatial-completion',
        matrixSize: 2,
        gridCells: [
          [{ type: 'shape', shape: 'star', fill: 'solid', color: '#FFD100' }, { type: 'shape', shape: 'star', fill: 'empty', color: '#FFD100' }],
          [{ type: 'shape', shape: 'star', fill: 'striped-diagonal', color: '#FFD100' }, { type: 'question-mark' }],
        ],
        cutoutRow: 1,
        cutoutCol: 1,
      };

      render(<MatrixGridSVG data={data} />);
      expect(screen.getByTestId('spatial-completion-svg')).toBeInTheDocument();
    });

    it('renders sequence-series stimulus with data-testid="sequence-series-svg" and individual frames', () => {
      const data: SequenceData = {
        type: 'sequence-series',
        frames: [
          { type: 'dice', pips: 1, color: '#FFFFFF', pipColor: '#111827' },
          { type: 'dice', pips: 2, color: '#FFFFFF', pipColor: '#111827' },
          { type: 'dice', pips: 3, color: '#FFFFFF', pipColor: '#111827' },
          { type: 'question-mark' },
        ],
        questionIndex: 3,
      };

      render(<MatrixGridSVG data={data} />);
      expect(screen.getByTestId('sequence-series-svg')).toBeInTheDocument();
      expect(screen.getByTestId('sequence-frame-0')).toBeInTheDocument();
      expect(screen.getByTestId('sequence-frame-1')).toBeInTheDocument();
      expect(screen.getByTestId('sequence-frame-2')).toBeInTheDocument();
      expect(screen.getByTestId('sequence-frame-3')).toBeInTheDocument();
      expect(screen.getByTestId('sequence-frame-3').querySelector('[data-testid="question-mark-cell"]')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // 3. BalanceScaleSVG Component Tests
  // ==========================================================================
  describe('BalanceScaleSVG', () => {
    it('renders data-testid="balance-scale-svg" with scale units, fulcrums, beams, and target pan question', () => {
      const data: BalanceScaleData = {
        type: 'balance-scale',
        scales: [
          {
            id: 'scale-1',
            leftPan: [{ id: 'item-1', shape: 'circle', color: '#1E5AA8', count: 2 }],
            rightPan: [{ id: 'item-2', shape: 'square', color: '#FF6F00', count: 1 }],
            status: 'balanced',
          },
          {
            id: 'scale-2',
            leftPan: [{ id: 'item-3', shape: 'square', color: '#FF6F00', count: 2 }],
            rightPan: [],
            status: 'unknown',
            isTargetScale: true,
          },
        ],
        targetScaleIndex: 1,
        targetPan: 'right',
      };

      render(<BalanceScaleSVG data={data} />);
      expect(screen.getByTestId('balance-scale-svg')).toBeInTheDocument();
      expect(screen.getByTestId('scale-unit-0')).toBeInTheDocument();
      expect(screen.getByTestId('scale-unit-1')).toBeInTheDocument();
      expect(screen.getByTestId('target-pan-question')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // 4. IsometricCubeSVG Component Tests
  // ==========================================================================
  describe('IsometricCubeSVG', () => {
    const cubeData: Cube3DData = {
      type: 'cube-3d',
      grid: [
        [2, 1],
        [1, 0],
      ],
      totalCubes: 4,
      visibleCubes: 3,
      hiddenCubes: 1,
      questionType: 'total-cubes',
    };

    it('renders data-testid="isometric-cube-svg" and displays prompt badge for question type', () => {
      render(<IsometricCubeSVG data={cubeData} />);
      expect(screen.getByTestId('isometric-cube-svg')).toBeInTheDocument();
      // Badge displaying question objective: total cubes
      expect(screen.getByText(/Total Cubes/i)).toBeInTheDocument();
    });

    it('highlights hidden supporting cubes with data-testid="hidden-cube-xray" when showHiddenXRay={true}', () => {
      const { rerender } = render(<IsometricCubeSVG data={cubeData} showHiddenXRay={false} />);
      expect(screen.queryByTestId('hidden-cube-xray')).not.toBeInTheDocument();

      rerender(<IsometricCubeSVG data={cubeData} showHiddenXRay={true} />);
      expect(screen.getByTestId('hidden-cube-xray')).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // 5. VerbalIllustrationSVG Component Tests
  // ==========================================================================
  describe('VerbalIllustrationSVG', () => {
    const verbalItem: VerbalGridData['items'][number] = {
      id: 'item-whale',
      word: 'WHALE',
      category: 'Mammals',
      iconName: 'whale',
      isOutlier: false,
    };

    it('renders data-testid="verbal-illustration-svg" with vector icon and word text label by default', () => {
      render(<VerbalIllustrationSVG item={verbalItem} />);
      expect(screen.getByTestId('verbal-illustration-svg')).toBeInTheDocument();
      expect(screen.getByText('WHALE')).toBeInTheDocument();
    });

    it('hides word label when showWordLabel={false} for language-free pure visual presentation', () => {
      render(<VerbalIllustrationSVG item={verbalItem} showWordLabel={false} />);
      expect(screen.getByTestId('verbal-illustration-svg')).toBeInTheDocument();
      expect(screen.queryByText('WHALE')).not.toBeInTheDocument();
    });
  });

  // ==========================================================================
  // 6. StimulusRenderer Integration Tests Across All 7 Engine Generators
  // ==========================================================================
  describe('StimulusRenderer Integration', () => {
    it('correctly renders number matrix stimulus', () => {
      const q = generateNumberMatrixQuestion(2, 42);
      render(<StimulusRenderer question={q} />);
      expect(screen.getByTestId('matrix-grid-svg')).toBeInTheDocument();
    });

    it('correctly renders balance scale stimulus', () => {
      const q = generateBalanceScaleQuestion(2, 42);
      render(<StimulusRenderer question={q} />);
      expect(screen.getByTestId('balance-scale-svg')).toBeInTheDocument();
    });

    it('correctly renders shape quantity equation stimulus', () => {
      const q = generateShapeQuantityQuestion(2, 42);
      render(<StimulusRenderer question={q} />);
      expect(screen.getByTestId('matrix-grid-svg')).toBeInTheDocument();
    });

    it('correctly renders sequence & dice series stimulus', () => {
      const q = generateSequenceQuestion(2, 42);
      render(<StimulusRenderer question={q} />);
      expect(screen.getByTestId('sequence-series-svg')).toBeInTheDocument();
    });

    it('correctly renders 3D isometric cube stimulus', () => {
      const q = generateCube3DQuestion(2, 42);
      render(<StimulusRenderer question={q} />);
      expect(screen.getByTestId('isometric-cube-svg')).toBeInTheDocument();
    });

    it('correctly renders nonverbal pattern/analogy stimulus', () => {
      const q = generateNonverbalQuestion(2, 'pattern-completion', 42);
      render(<StimulusRenderer question={q} />);
      const stimulusElement =
        screen.queryByTestId('matrix-grid-svg') ||
        screen.queryByTestId('spatial-completion-svg');
      expect(stimulusElement).not.toBeNull();
    });

    it('correctly renders verbal classification stimulus', () => {
      const q = generateVerbalQuestion(2, 42);
      render(<StimulusRenderer question={q} />);
      // Stimulus should render the 6 verbal classification items
      const verbalIllustrations = screen.getAllByTestId('verbal-illustration-svg');
      expect(verbalIllustrations).toHaveLength(6);
    });
  });
});
