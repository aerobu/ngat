import React from 'react';
import { NGATQuestion } from '../../types/ngat';
import { MatrixGridSVG } from './MatrixGridSVG';
import { BalanceScaleSVG } from './BalanceScaleSVG';
import { IsometricCubeSVG } from './IsometricCubeSVG';
import { VerbalIllustrationSVG } from './VerbalIllustrationSVG';

export interface StimulusRendererProps {
  question: NGATQuestion;
  showHighlight?: boolean;
  showHiddenXRay?: boolean;
  showWordLabels?: boolean;
  className?: string;
}

export const StimulusRenderer: React.FC<StimulusRendererProps> = ({
  question,
  showHighlight = false,
  showHiddenXRay = false,
  showWordLabels = true,
  className = '',
}) => {
  if (!question || !question.stimulus) {
    return null;
  }

  const { stimulus } = question;

  // 1. Matrix Grid / Spatial Completion / Sequence Series
  if (
    stimulus.type === 'matrix-grid' ||
    stimulus.type === 'spatial-completion' ||
    stimulus.type === 'sequence-series'
  ) {
    return (
      <div className={`w-full flex items-center justify-center ${className}`}>
        <MatrixGridSVG data={stimulus} showHighlight={showHighlight} />
      </div>
    );
  }

  // 2. Balance Scale System
  if (stimulus.type === 'balance-scale') {
    return (
      <div className={`w-full flex items-center justify-center ${className}`}>
        <BalanceScaleSVG data={stimulus} />
      </div>
    );
  }

  // 3. 3D Isometric Cube Stacks
  if (stimulus.type === 'cube-3d') {
    return (
      <div className={`w-full flex items-center justify-center ${className}`}>
        <IsometricCubeSVG
          data={stimulus}
          showHiddenXRay={showHiddenXRay}
        />
      </div>
    );
  }

  // 4. Verbal Classification Grid (6-Picture or 6-Word Stimulus)
  if (stimulus.type === 'verbal-grid') {
    const items = stimulus.items || [];
    return (
      <div className={`w-full flex flex-col items-center justify-center p-3 ${className}`}>
        {/* Stimulus Instruction Banner */}
        <div className="mb-3 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
          Identify the 1 Item That Does Not Belong
        </div>

        {/* 3x2 Grid for 6 items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl w-full">
          {items.map((item) => (
            <div key={item.id} className="flex justify-center">
              <VerbalIllustrationSVG
                item={item}
                showWordLabel={showWordLabels}
                size={115}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
