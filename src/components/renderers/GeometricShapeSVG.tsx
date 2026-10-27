import React from 'react';
import { CellVisual, FillType, ShapeType } from '../../types/ngat';
import { VerbalIllustrationSVG } from './VerbalIllustrationSVG';
import { IsometricCubeSVG } from './IsometricCubeSVG';

export interface GeometricShapeSVGProps {
  visual: CellVisual;
  size?: number | string;
  className?: string;
  showLabel?: boolean;
}

export const GeometricShapeSVG: React.FC<GeometricShapeSVGProps> = ({
  visual,
  size = '100%',
  className = '',
  showLabel = true,
}) => {
  const reactId = React.useId();
  const patternId = reactId.replace(/:/g, '');

  if (!visual) {
    return null;
  }

  // Handle verbal-word delegation
  if (visual.type === 'verbal-word') {
    return (
      <VerbalIllustrationSVG
        visual={visual}
        size={typeof size === 'number' ? size : 100}
        showWordLabel={showLabel}
      />
    );
  }

  // Handle Question Mark cell
  if (visual.type === 'question-mark') {
    const qColor = visual.color ?? '#D97706';
    return (
      <svg
        data-testid="geometric-shape-svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`w-full h-full select-none ${className}`}
      >
        <g data-testid="question-mark-cell">
          <rect
            x="12"
            y="12"
            width="76"
            height="76"
            rx="14"
            fill="#FFFBEB"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeDasharray="5 5"
          />
          <text
            x="50"
            y="54"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="46"
            fontWeight="900"
            fill={qColor}
            fontFamily="system-ui, sans-serif"
          >
            {visual.text ?? '?'}
          </text>
        </g>
      </svg>
    );
  }

  // Handle Number cell
  if (visual.type === 'number') {
    const textColor = visual.color ?? '#111827';
    const hasSubtext = Boolean(visual.subtext || (showLabel && visual.label));
    const subtextContent = visual.subtext ?? (showLabel ? visual.label : '');

    return (
      <svg
        data-testid="geometric-shape-svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`w-full h-full select-none ${className}`}
      >
        <text
          x="50"
          y={hasSubtext ? 44 : 52}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={visual.fontSize ?? (String(visual.value).length > 2 ? 32 : 38)}
          fontWeight="800"
          fill={textColor}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {visual.value}
        </text>
        {hasSubtext && (
          <text
            x="50"
            y="76"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fontWeight="600"
            fill="#4B5563"
            fontFamily="system-ui, sans-serif"
          >
            {subtextContent}
          </text>
        )}
      </svg>
    );
  }

  // Handle Dice cell
  if (visual.type === 'dice') {
    const pips = Math.min(6, Math.max(1, visual.pips ?? 1));
    const dieBg = visual.color ?? '#FFFFFF';
    const pipFill = visual.pipColor ?? '#111827';

    const pipPositions: Record<number, [number, number][]> = {
      1: [[50, 50]],
      2: [[30, 30], [70, 70]],
      3: [[30, 30], [50, 50], [70, 70]],
      4: [[30, 30], [70, 30], [30, 70], [70, 70]],
      5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
      6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]],
    };

    const activePositions = pipPositions[pips] || [[50, 50]];

    return (
      <svg
        data-testid="geometric-shape-svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`w-full h-full select-none ${className}`}
      >
        <rect
          x="12"
          y="12"
          width="76"
          height="76"
          rx="16"
          fill={dieBg}
          stroke="#111827"
          strokeWidth="3.5"
        />
        {activePositions.map(([cx, cy], idx) => (
          <circle
            key={idx}
            data-testid="dice-pip"
            cx={cx}
            cy={cy}
            r="6.5"
            fill={pipFill}
          />
        ))}
      </svg>
    );
  }

  // Handle Empty cell
  if (visual.type === 'empty') {
    return (
      <svg
        data-testid="geometric-shape-svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`w-full h-full ${className}`}
      >
        <rect width="100" height="100" fill="transparent" />
      </svg>
    );
  }

  // Handle 3D isometric cube cell
  if (visual.type === 'cube-isometric') {
    return (
      <div data-testid="geometric-shape-svg" className={`w-full h-full flex items-center justify-center ${className}`}>
        <IsometricCubeSVG
          data={{
            type: 'cube-3d',
            grid: visual.grid,
            totalCubes: visual.grid.flat().reduce((a, b) => a + b, 0),
            visibleCubes: 0,
            hiddenCubes: 0,
            questionType: 'total-cubes',
          }}
          showHiddenXRay={visual.highlightHidden}
          className="w-full h-full"
        />
      </div>
    );
  }

  // Handle custom SVG path
  if (visual.type === 'svg-path') {
    return (
      <svg
        data-testid="geometric-shape-svg"
        viewBox={visual.viewBox ?? '0 0 100 100'}
        width={size}
        height={size}
        className={`w-full h-full select-none ${className}`}
      >
        <path
          d={visual.path}
          fill={visual.fill ?? '#1E5AA8'}
          stroke={visual.stroke ?? '#111827'}
          strokeWidth={visual.strokeWidth ?? 2.5}
        />
      </svg>
    );
  }

  // Helper: Pattern fill definitions across given colors
  const renderDefsForColors = (colors: string[]) => (
    <defs>
      {colors.map((c) => {
        const cKey = c.replace(/[^a-zA-Z0-9]/g, '');
        return (
          <React.Fragment key={cKey}>
            {/* Striped Horizontal */}
            <pattern
              id={`${patternId}-${cKey}-striped-h`}
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect width="12" height="12" fill="#FFFFFF" />
              <line x1="0" y1="6" x2="12" y2="6" stroke={c} strokeWidth="4" />
            </pattern>

            {/* Striped Vertical */}
            <pattern
              id={`${patternId}-${cKey}-striped-v`}
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect width="12" height="12" fill="#FFFFFF" />
              <line x1="6" y1="0" x2="6" y2="12" stroke={c} strokeWidth="4" />
            </pattern>

            {/* Striped Diagonal */}
            <pattern
              id={`${patternId}-${cKey}-striped-diagonal`}
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <rect width="14" height="14" fill="#FFFFFF" />
              <line x1="0" y1="0" x2="14" y2="14" stroke={c} strokeWidth="4" />
            </pattern>

            {/* Dotted */}
            <pattern
              id={`${patternId}-${cKey}-dotted`}
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <rect width="14" height="14" fill="#FFFFFF" />
              <circle cx="7" cy="7" r="3" fill={c} />
            </pattern>

            {/* Checkerboard */}
            <pattern
              id={`${patternId}-${cKey}-checkerboard`}
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill={c} />
              <rect x="8" y="0" width="8" height="8" fill="#FFFFFF" />
              <rect x="0" y="8" width="8" height="8" fill="#FFFFFF" />
              <rect x="8" y="8" width="8" height="8" fill={c} />
            </pattern>

            {/* Half Gradients */}
            <linearGradient id={`${patternId}-${cKey}-half-top`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor={c} />
              <stop offset="50%" stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id={`${patternId}-${cKey}-half-bottom`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor={c} />
            </linearGradient>
            <linearGradient id={`${patternId}-${cKey}-half-left`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="50%" stopColor={c} />
              <stop offset="50%" stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id={`${patternId}-${cKey}-half-right`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor={c} />
            </linearGradient>
          </React.Fragment>
        );
      })}
    </defs>
  );

  const getComputedFill = (f: FillType, color: string): string => {
    const cKey = color.replace(/[^a-zA-Z0-9]/g, '');
    switch (f) {
      case 'empty':
        return '#FFFFFF';
      case 'striped-h':
        return `url(#${patternId}-${cKey}-striped-h)`;
      case 'striped-v':
        return `url(#${patternId}-${cKey}-striped-v)`;
      case 'striped-diagonal':
        return `url(#${patternId}-${cKey}-striped-diagonal)`;
      case 'dotted':
        return `url(#${patternId}-${cKey}-dotted)`;
      case 'checkerboard':
        return `url(#${patternId}-${cKey}-checkerboard)`;
      case 'half-top':
        return `url(#${patternId}-${cKey}-half-top)`;
      case 'half-bottom':
        return `url(#${patternId}-${cKey}-half-bottom)`;
      case 'half-left':
        return `url(#${patternId}-${cKey}-half-left)`;
      case 'half-right':
        return `url(#${patternId}-${cKey}-half-right)`;
      case 'solid':
      default:
        return color;
    }
  };

  // Shape Geometries (centered at 50, 50 with radius/extent ~ 36-38)
  const renderShapeGeometry = (s: ShapeType, fill: string, stroke: string, sw: number) => {
    switch (s) {
      case 'circle':
        return <circle cx="50" cy="50" r="37" fill={fill} stroke={stroke} strokeWidth={sw} />;
      case 'square':
        return <rect x="14" y="14" width="72" height="72" rx="4" fill={fill} stroke={stroke} strokeWidth={sw} />;
      case 'triangle':
        return <polygon points="50,14 87,84 13,84" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'diamond':
        return <polygon points="50,12 88,50 50,88 12,50" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'pentagon':
        return <polygon points="50,12 88,39 74,86 26,86 12,39" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'hexagon':
        return <polygon points="23,15 77,15 92,50 77,85 23,85 8,50" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'star':
        return (
          <polygon
            points="50,11 61,36 88,36 66,53 74,79 50,63 26,79 34,53 12,36 39,36"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );
      case 'cross':
        return (
          <polygon
            points="36,14 64,14 64,36 86,36 86,64 64,64 64,86 36,86 36,64 14,64 14,36 36,36"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );
      case 'heart':
        return (
          <path
            d="M 50,30 A 18,18 0 0,0 20,48 C 20,70 50,86 50,86 C 50,86 80,70 80,48 A 18,18 0 0,0 50,30 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );
      case 'trapezoid':
        return <polygon points="26,22 74,22 88,78 12,78" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'arrow-up':
        return <polygon points="50,12 84,46 62,46 62,86 38,86 38,46 16,46" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'arrow-right':
        return <polygon points="88,50 54,16 54,38 14,38 14,62 54,62 54,84" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'arrow-down':
        return <polygon points="50,88 16,54 38,54 38,14 62,14 62,54 84,54" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'arrow-left':
        return <polygon points="12,50 46,84 46,62 86,62 86,38 46,38 46,16" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'semicircle':
        return <path d="M 14,50 A 36,36 0 0,1 86,50 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'cube-block':
      default:
        return <rect x="16" y="16" width="68" height="68" rx="8" fill={fill} stroke={stroke} strokeWidth={sw} />;
    }
  };

  // Handle Composite cell
  if (visual.type === 'composite') {
    const elements = visual.elements || [];
    const compositeColors = elements.flatMap((el) => [el.color, el.innerColor]).filter(Boolean) as string[];
    const uniqueColors = Array.from(new Set(compositeColors.length > 0 ? compositeColors : ['#1E5AA8']));

    return (
      <svg
        data-testid="geometric-shape-svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`w-full h-full select-none ${className}`}
      >
        {renderDefsForColors(uniqueColors)}
        {visual.background && (
          <rect width="100" height="100" fill={visual.background} />
        )}
        {elements.map((el, idx) => {
          const elScale = el.scale ?? 1;
          const elX = el.x !== undefined ? el.x : 50;
          const elY = el.y !== undefined ? el.y : 50;
          const elRot = el.rotation ?? 0;
          const elColor = el.color ?? '#1E5AA8';
          const elFill = getComputedFill(el.fill ?? 'solid', elColor);
          const elStroke = el.strokeColor ?? '#111827';
          const elStrokeW = el.strokeWidth ?? 2.5;

          return (
            <g
              key={el.id ?? idx}
              transform={`translate(${elX}, ${elY}) rotate(${elRot}) scale(${elScale}) translate(-50, -50)`}
            >
              {renderShapeGeometry(el.shape, elFill, elStroke, elStrokeW)}
              {el.innerShape && (
                <g transform="translate(50, 50) scale(0.48) translate(-50, -50)">
                  {renderShapeGeometry(
                    el.innerShape,
                    getComputedFill(el.innerFill ?? 'solid', el.innerColor ?? '#111827'),
                    '#111827',
                    elStrokeW
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // Handle Single Shape
  const shapeType: ShapeType = visual.shape;
  const fillType: FillType = visual.fill;
  const mainColor: string = visual.color;
  const strokeColor: string = visual.strokeColor ?? '#111827';
  const rotation: number = visual.rotation ?? 0;
  const count: number = visual.count ?? 1;

  const uniqueColors = Array.from(new Set([mainColor, visual.innerColor].filter(Boolean) as string[]));
  const computedFill = getComputedFill(fillType, mainColor);
  const strokeW = 3;

  const sizeMultiplier =
    typeof visual.size === 'number'
      ? visual.size
      : visual.size === 'sm'
      ? 0.75
      : visual.size === 'lg'
      ? 1.15
      : 1.0;

  const sizeTransform = sizeMultiplier !== 1.0 ? `translate(50, 50) scale(${sizeMultiplier}) translate(-50, -50)` : '';
  const transformAttr = rotation !== 0 ? `rotate(${rotation}, 50, 50)` : undefined;

  return (
    <svg
      data-testid="geometric-shape-svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`w-full h-full select-none ${className}`}
    >
      {renderDefsForColors(uniqueColors)}

      <g transform={sizeTransform || undefined}>
        {count > 1 ? (
          // Multi-shape layout
          <g transform={transformAttr}>
            {rotation !== 0 && React.createElement('rotate', { transform: transformAttr, style: { display: 'none' } })}
            {count === 2 && (
              <>
                <g transform="translate(-16, 0) scale(0.65) translate(25, 25)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
                <g transform="translate(16, 0) scale(0.65) translate(25, 25)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
              </>
            )}
            {count === 3 && (
              <>
                <g transform="translate(0, -18) scale(0.55) translate(35, 35)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
                <g transform="translate(-18, 16) scale(0.55) translate(35, 35)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
                <g transform="translate(18, 16) scale(0.55) translate(35, 35)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
              </>
            )}
            {count >= 4 && (
              <>
                <g transform="translate(-18, -18) scale(0.5) translate(40, 40)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
                <g transform="translate(18, -18) scale(0.5) translate(40, 40)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
                <g transform="translate(-18, 18) scale(0.5) translate(40, 40)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
                <g transform="translate(18, 18) scale(0.5) translate(40, 40)">
                  {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}
                </g>
              </>
            )}
          </g>
        ) : (
          <g transform={transformAttr}>
            {rotation !== 0 && React.createElement('rotate', { transform: transformAttr, style: { display: 'none' } })}
            {renderShapeGeometry(shapeType, computedFill, strokeColor, strokeW)}

            {/* Inner shape overlay with precise center alignment and fill */}
            {visual.type === 'shape' && visual.innerShape && (
              <g transform="translate(50, 50) scale(0.48) translate(-50, -50)">
                {renderShapeGeometry(
                  visual.innerShape,
                  getComputedFill(visual.innerFill ?? 'solid', visual.innerColor ?? '#111827'),
                  visual.strokeColor ?? '#111827',
                  strokeW
                )}
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
};
