import React from 'react';
import { BalanceScaleData, BalanceScaleSingle, ShapeType } from '../../types/ngat';
import { GeometricShapeSVG } from './GeometricShapeSVG';

export interface BalanceScaleSVGProps {
  data: BalanceScaleData;
  showWeights?: boolean;
  className?: string;
}

export const BalanceScaleSVG: React.FC<BalanceScaleSVGProps> = ({
  data,
  showWeights = false,
  className = '',
}) => {
  if (!data || !data.scales) return null;

  const renderPanItems = (
    items: BalanceScaleSingle['leftPan'],
    isTargetPan: boolean
  ) => {
    if (isTargetPan) {
      return (
        <div
          data-testid="target-pan-question"
          className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-dashed border-amber-500 flex items-center justify-center text-amber-700 font-black text-2xl shadow-sm animate-pulse"
        >
          ?
        </div>
      );
    }

    if (!items || items.length === 0) {
      return <div className="h-10 w-10 opacity-0" />;
    }

    return (
      <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-[130px]">
        {items.map((item, idx) => {
          if (item.label === '?' || item.count === 0) {
            return (
              <div
                key={idx}
                data-testid="target-pan-question"
                className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-dashed border-amber-500 flex items-center justify-center text-amber-700 font-black text-xl shadow-sm animate-pulse"
              >
                ?
              </div>
            );
          }

          return (
            <div
              key={item.id ?? idx}
              className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg border border-gray-200 shadow-xs"
            >
              {item.count > 1 && (
                <span className="text-xs font-black text-gray-800">
                  {item.count}×
                </span>
              )}
              <div className="w-6 h-6 flex-shrink-0">
                <GeometricShapeSVG
                  visual={{
                    type: 'shape',
                    shape: item.shape as ShapeType,
                    fill: item.fill ?? 'solid',
                    color: item.color ?? '#1E5AA8',
                    count: 1,
                  }}
                  size={24}
                />
              </div>
              {showWeights && item.weight !== undefined && (
                <span className="text-[10px] text-gray-500 font-mono">
                  ({item.weight}w)
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      data-testid="balance-scale-svg"
      className={`flex flex-col items-center justify-center gap-4 p-4 select-none ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 flex-wrap w-full">
        {data.scales.map((scale, sIdx) => {
          const isTargetScale =
            scale.isTargetScale || sIdx === data.targetScaleIndex;
          const isLeftTarget = isTargetScale && data.targetPan === 'left';
          const isRightTarget = isTargetScale && data.targetPan === 'right';

          // Tilt angle
          const tiltDeg =
            scale.status === 'tilted-left'
              ? -6
              : scale.status === 'tilted-right'
              ? 6
              : 0;

          return (
            <div
              key={scale.id ?? sIdx}
              data-testid={`scale-unit-${sIdx}`}
              className={`flex flex-col items-center p-4 rounded-3xl transition-all ${
                isTargetScale
                  ? 'bg-amber-50/70 border-2 border-amber-300 shadow-md ring-4 ring-amber-100/50'
                  : 'bg-white border-2 border-slate-200 shadow-sm'
              }`}
              style={{ minWidth: '260px' }}
            >
              {/* Scale Label */}
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Scale {sIdx + 1} {isTargetScale ? '• Goal' : '• Fact'}
              </div>

              {/* Items resting on top of pans */}
              <div className="w-full flex items-end justify-between px-2 min-h-[50px] mb-[-6px] z-10">
                <div className="flex justify-center w-[110px]">
                  {renderPanItems(scale.leftPan, isLeftTarget)}
                </div>
                <div className="flex justify-center w-[110px]">
                  {renderPanItems(scale.rightPan, isRightTarget)}
                </div>
              </div>

              {/* Vector SVG Scale Mechanism */}
              <svg
                viewBox="0 0 280 120"
                className="w-[260px] h-[110px] overflow-visible"
              >
                {/* Central Fulcrum Column & Triangular Base */}
                <polygon
                  points="140,40 120,110 160,110"
                  fill="#374151"
                  stroke="#111827"
                  strokeWidth="2.5"
                />
                <rect
                  x="105"
                  y="110"
                  width="70"
                  height="8"
                  rx="3"
                  fill="#111827"
                />

                {/* Rotating Beam and Suspended Pans */}
                <g transform={`rotate(${tiltDeg}, 140, 40)`}>
                  {/* Central Pivot Fulcrum Pin */}
                  <circle cx="140" cy="40" r="5.5" fill="#FFD100" stroke="#111827" strokeWidth="2" />

                  {/* Horizontal Crossbeam */}
                  <line
                    x1="25"
                    y1="40"
                    x2="255"
                    y2="40"
                    stroke="#1E5AA8"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Left Suspension Lines */}
                  <line x1="35" y1="40" x2="10" y2="76" stroke="#6B7280" strokeWidth="1.8" />
                  <line x1="35" y1="40" x2="60" y2="76" stroke="#6B7280" strokeWidth="1.8" />

                  {/* Left Pan Dish */}
                  <path
                    d="M 5,76 Q 35,98 65,76 Z"
                    fill="#E5E7EB"
                    stroke="#111827"
                    strokeWidth="2.5"
                  />

                  {/* Right Suspension Lines */}
                  <line x1="245" y1="40" x2="220" y2="76" stroke="#6B7280" strokeWidth="1.8" />
                  <line x1="245" y1="40" x2="270" y2="76" stroke="#6B7280" strokeWidth="1.8" />

                  {/* Right Pan Dish */}
                  <path
                    d="M 215,76 Q 245,98 275,76 Z"
                    fill="#E5E7EB"
                    stroke="#111827"
                    strokeWidth="2.5"
                  />
                </g>
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
