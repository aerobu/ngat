import React from 'react';
import {
  MatrixGridData,
  SpatialCompletionData,
  SequenceData,
  CellVisual,
} from '../../types/ngat';
import { GeometricShapeSVG } from './GeometricShapeSVG';

export interface MatrixGridSVGProps {
  data: MatrixGridData | SpatialCompletionData | SequenceData;
  showHighlight?: boolean;
  className?: string;
}

export const MatrixGridSVG: React.FC<MatrixGridSVGProps> = ({
  data,
  showHighlight = false,
  className = '',
}) => {
  if (!data) return null;

  // 1. Sequence and Series Ribbon
  if (data.type === 'sequence-series') {
    const frames = data.frames || [];
    return (
      <div
        data-testid="sequence-series-svg"
        className={`flex flex-col items-center justify-center p-4 max-w-full overflow-x-auto ${className}`}
      >
        <div className="flex items-center gap-2 sm:gap-4 flex-nowrap py-2 px-1">
          {frames.map((frame, idx) => {
            const isQuestion = idx === data.questionIndex;
            return (
              <React.Fragment key={idx}>
                <div
                  data-testid={`sequence-frame-${idx}`}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center p-2 transition-all shadow-sm ${
                    isQuestion
                      ? 'bg-amber-50/80 border-2 border-dashed border-amber-400 shadow-amber-100 ring-4 ring-amber-100/50'
                      : 'bg-white border-2 border-gray-200/90 shadow-sm'
                  }`}
                >
                  <GeometricShapeSVG visual={frame} />
                </div>

                {/* Arrow connector between frames */}
                {idx < frames.length - 1 && (
                  <div className="text-gray-400 font-black text-lg select-none px-0.5">
                    ➔
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {showHighlight && data.progressionNote && (
          <div className="mt-2 text-xs font-semibold text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full text-center">
            {data.progressionNote}
          </div>
        )}
      </div>
    );
  }

  // 2. Spatial Completion
  if (data.type === 'spatial-completion') {
    const size = data.matrixSize ?? 2;
    const gridCells = data.gridCells || [];

    return (
      <div
        data-testid="spatial-completion-svg"
        className={`flex flex-col items-center justify-center p-4 ${className}`}
      >
        <div
          className="grid gap-2.5 sm:gap-3 p-3.5 bg-gray-100/80 rounded-3xl border-2 border-gray-300 shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          }}
        >
          {gridCells.map((row, r) =>
            row.map((cell, c) => {
              const isCutout = r === data.cutoutRow && c === data.cutoutCol;
              return (
                <div
                  key={`${r}-${c}`}
                  data-testid={`spatial-cell-${r}-${c}`}
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center p-2.5 transition-all shadow-sm ${
                    isCutout
                      ? 'bg-amber-50/80 border-2 border-dashed border-amber-400 ring-4 ring-amber-100/60'
                      : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  <GeometricShapeSVG visual={cell} />
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // 3. Matrix Grid (Standard 2x2 or 3x3)
  const cols = data.cols ?? (data.cells[0]?.length || 2);
  const cells = data.cells || [];

  return (
    <div
      data-testid="matrix-grid-svg"
      className={`flex flex-col items-center justify-center p-3 select-none ${className}`}
    >
      <div
        className="grid gap-2.5 sm:gap-3.5 p-3 sm:p-4 bg-slate-100/80 rounded-3xl border-2 border-slate-200/90 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((rowCells, r) =>
          rowCells.map((cell: CellVisual, c: number) => {
            const isQuestion = r === data.questionRow && c === data.questionCol;
            const isRowHighlighted = showHighlight && data.highlightRow === r;
            const isColHighlighted = showHighlight && data.highlightCol === c;

            return (
              <div
                key={`${r}-${c}`}
                data-testid={`matrix-cell-${r}-${c}`}
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center p-2.5 transition-all relative ${
                  isQuestion
                    ? 'bg-amber-50/90 border-2 border-dashed border-amber-400 shadow-md ring-4 ring-amber-200/50'
                    : isRowHighlighted || isColHighlighted
                    ? 'bg-blue-50/90 border-2 border-blue-400 shadow-sm ring-2 ring-blue-200'
                    : 'bg-white border-2 border-slate-200 shadow-sm'
                }`}
              >
                <GeometricShapeSVG visual={cell} />
              </div>
            );
          })
        )}
      </div>

      {/* Visual Rule Highlight Callout Banner */}
      {showHighlight && (
        <div
          data-testid="matrix-rule-highlight"
          className="mt-4 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-sm max-w-md text-center animate-fadeIn"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping flex-shrink-0" />
          <span>
            {data.highlightRuleExplanation ?? 'Rule: Observe the constant pattern across rows and columns.'}
          </span>
        </div>
      )}
    </div>
  );
};
