import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Compass,
  Zap,
} from 'lucide-react';

export interface TutorialViewProps {
  onComplete: () => void;
  onBack: () => void;
}

interface TutorialStep {
  title: string;
  badge: string;
  subtitle: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Golden Rules of the Naglieri Assessment',
    badge: 'Essential Orientation',
    subtitle: 'Master the 3 non-negotiable test mechanics before your Beaverton exam session.',
  },
  {
    title: 'Cognitive Distractor Trap Defense',
    badge: 'Gifted Strategy Guide',
    subtitle: 'Learn how question writers design traps and how TAG scorers spot them instantly.',
  },
  {
    title: 'Split-Stage Exam Ergonomics',
    badge: 'Simulator Training',
    subtitle: 'How to use your 45 seconds per puzzle effectively with high-contrast visual cues.',
  },
];

export const TutorialView: React.FC<TutorialViewProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const stepData = TUTORIAL_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 select-none flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Navigation & Progress Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors shadow-xs"
          >
            ← {currentStep === 0 ? 'Exit' : 'Previous Step'}
          </button>

          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-8 bg-blue-600'
                    : idx < currentStep
                    ? 'w-3 bg-emerald-500'
                    : 'w-3 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-bold text-gray-500">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-gray-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {stepData.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {stepData.title}
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              {stepData.subtitle}
            </p>
          </div>

          {/* Step 1 Content: The 3 Golden Rules */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Rule 1 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <h2 className="font-black text-gray-900 text-sm">
                    No Looking Back
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    The authentic Naglieri testing environment strictly forbids revisiting past questions. Once you click Forward (➔), that question is final.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-blue-700 bg-blue-100/60 p-2 rounded-lg">
                  Commit with confidence and never look behind!
                </div>
              </div>

              {/* Rule 2 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <h2 className="font-black text-gray-900 text-sm">
                    Click to Select, Arrow to Advance
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Selecting an option card only highlights your candidate. You must deliberately click the Forward Arrow button (➔) to confirm and move ahead.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-amber-800 bg-amber-100/60 p-2 rounded-lg">
                  Prevents accidental clicks and misfires.
                </div>
              </div>

              {/* Rule 3 */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <h2 className="font-black text-gray-900 text-sm">
                    Deduce First, Then Scan Choices
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Formulate your missing piece mentally before glancing at options A through E. Looking at choices first triggers distractor attraction.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-purple-800 bg-purple-100/60 p-2 rounded-lg">
                  Pre-visualization shields your focus.
                </div>
              </div>
            </div>
          )}

          {/* Step 2 Content: Cognitive Distractor Traps */}
          {currentStep === 1 && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h2 className="font-black text-rose-900 text-xs uppercase tracking-wider">
                      Row-Only & Column-Only Traps
                    </h2>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    A distractor that perfectly satisfies horizontal addition (+3), but completely breaks vertical subtraction (-2). Always verify BOTH axes!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <h2 className="font-black text-amber-900 text-xs uppercase tracking-wider">
                      Off-By-One Arithmetic Traps
                    </h2>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Calculated total cubes as 14 when the correct answer is 15 because an unseen supporting foundation block was missed.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-600" />
                    <h2 className="font-black text-blue-900 text-xs uppercase tracking-wider">
                      Rotation vs Reflection Traps
                    </h2>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    A flipped mirror image disguised as a 90° clockwise rotation. Pick one reference corner and trace its rotational path.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h2 className="font-black text-emerald-900 text-xs uppercase tracking-wider">
                      The 97th Percentile Mindset
                    </h2>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    TAG candidates don't just calculate fast—they actively anticipate where typical students make counting slips and double-check those spots.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 Content: Split-Stage Ergonomics & Pacing */}
          {currentStep === 2 && (
            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h2 className="font-black text-gray-900 text-sm">
                  Recommended Test-Taking Pacing:
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="block text-xl font-black text-blue-600">0 - 15s</span>
                    <span className="text-[11px] text-gray-500 font-bold">Stimulus Inspection</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="block text-xl font-black text-amber-500">15 - 35s</span>
                    <span className="text-[11px] text-gray-500 font-bold">Rule Hypothesis</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="block text-xl font-black text-emerald-600">35 - 45s</span>
                    <span className="text-[11px] text-gray-500 font-bold">Select & Confirm (➔)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
            >
              Skip Orientation
            </button>

            <div className="flex items-center gap-2.5">
              {currentStep < TUTORIAL_STEPS.length - 1 && (
                <button
                  data-testid="tutorial-next-btn"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Finish button is available when user steps forward or finishes */}
              {(currentStep > 0 || currentStep === TUTORIAL_STEPS.length - 1) && (
                <button
                  data-testid="tutorial-finish-btn"
                  onClick={onComplete}
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Start Practice Dojo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
