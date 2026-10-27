import React from 'react';
import { Cube3DData } from '../../types/ngat';

export interface IsometricCubeSVGProps {
  data: Cube3DData;
  showHiddenXRay?: boolean;
  className?: string;
}

export const IsometricCubeSVG: React.FC<IsometricCubeSVGProps> = ({
  data,
  showHiddenXRay = false,
  className = '',
}) => {
  if (!data || !data.grid) return null;

  const grid = data.grid;
  const rows = grid.length;
  const cols = grid[0]?.length || 1;

  // Isometric constants
  const W = 34; // half-width
  const H = 19; // half-height slope
  const L = 28; // layer height

  // SVG dimensions
  const svgWidth = 360;
  const svgHeight = 280;
  const X0 = svgWidth / 2;
  const Y0 = 120;

  // Objective prompt title
  const questionType = data.questionType ?? 'total-cubes';
  const promptTitle =
    questionType === 'hidden-cubes'
      ? 'Count Hidden Supporting Cubes'
      : questionType === 'visible-cubes'
      ? 'Count Visible Cubes'
      : 'Count Total Cubes';

  // Cube items in Painter's algorithm order (back to front, bottom to top)
  interface CubeItem {
    r: number;
    c: number;
    z: number; // 1-indexed
    x: number;
    y: number;
    isHidden: boolean;
  }

  const cubeList: CubeItem[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const colHeight = grid[r][c];
      for (let z = 1; z <= colHeight; z++) {
        // Isometric coordinates
        const x = X0 + (c - r) * W;
        const y = Y0 + (r + c) * H - (z - 1) * L;

        // Visibility determination:
        const topVisible = z === colHeight;
        const frontVisible = r === rows - 1 || z > (grid[r + 1]?.[c] ?? 0);
        const rightVisible = c === cols - 1 || z > (grid[r]?.[c + 1] ?? 0);
        const isHidden = !topVisible && !frontVisible && !rightVisible;

        cubeList.push({ r, c, z, x, y, isHidden });
      }
    }
  }

  // Fallback: If data states hiddenCubes > 0 but none flagged, flag the lowest back cube
  if (data.hiddenCubes > 0 && !cubeList.some((c) => c.isHidden) && cubeList.length > 0) {
    cubeList[0].isHidden = true;
  }

  // Sort back to front: lower (r + c) first; lower z first
  cubeList.sort((a, b) => {
    const depthA = a.r + a.c;
    const depthB = b.r + b.c;
    if (depthA !== depthB) return depthA - depthB;
    return a.z - b.z;
  });

  return (
    <div
      data-testid="isometric-cube-svg"
      className={`flex flex-col items-center justify-center p-3 select-none ${className}`}
    >
      {/* Question Prompt Badge */}
      <div className="mb-2 px-4 py-1.5 bg-blue-100/90 border border-blue-300 rounded-full text-blue-900 text-xs sm:text-sm font-extrabold tracking-wide uppercase shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        <span>{promptTitle}</span>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-[340px] h-auto overflow-visible filter drop-shadow-md"
      >
        {cubeList.map((cube) => {
          const { r, c, z, x, y, isHidden } = cube;
          const isXRay = showHiddenXRay && isHidden;

          // Face color themes
          const topColor = isXRay ? '#FDE68A' : '#93C5FD';
          const leftColor = isXRay ? '#F59E0B' : '#2563EB';
          const rightColor = isXRay ? '#D97706' : '#1D4ED8';
          const stroke = isXRay ? '#B45309' : '#111827';
          const strokeW = 2;

          return (
            <g
              key={`${r}-${c}-${z}`}
              data-testid={isXRay ? 'hidden-cube-xray' : undefined}
              className={isXRay ? 'animate-pulse' : undefined}
              opacity={isXRay ? 0.95 : 1}
            >
              {/* Left Face */}
              <polygon
                points={`
                  ${x - W},${y}
                  ${x},${y + H}
                  ${x},${y + H + L}
                  ${x - W},${y + L}
                `}
                fill={leftColor}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeLinejoin="round"
              />

              {/* Right Face */}
              <polygon
                points={`
                  ${x},${y + H}
                  ${x + W},${y}
                  ${x + W},${y + L}
                  ${x},${y + H + L}
                `}
                fill={rightColor}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeLinejoin="round"
              />

              {/* Top Face */}
              <polygon
                points={`
                  ${x},${y - H}
                  ${x + W},${y}
                  ${x},${y + H}
                  ${x - W},${y}
                `}
                fill={topColor}
                stroke={stroke}
                strokeWidth={strokeW}
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
