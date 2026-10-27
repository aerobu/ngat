import React, { useState, useEffect, useRef } from 'react';
import {
  SubtestType,
  QuestionArchetype,
  DayMission,
  QuestionAttempt,
  DifficultyLevel,
  NGATQuestion,
  CellVisual,
} from '../../types/ngat';
import { generateAdaptiveQuestion } from '../../engine/examBuilder';
import { StimulusRenderer } from '../renderers/StimulusRenderer';
import { GeometricShapeSVG } from '../renderers/GeometricShapeSVG';
import {
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
} from 'lucide-react';

export interface PracticeDojoViewProps {
  initialSubtest?: SubtestType;
  initialArchetype?: QuestionArchetype;
  mission?: DayMission;
  onCompleteMission?: (dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7, scorePercent: number) => void;
  onExitDojo: () => void;
  onRecordAttempt?: (attempt: QuestionAttempt) => void;
}

const SUBTEST_OPTIONS: { id: SubtestType; label: string }[] = [
  { id: 'quantitative', label: 'Quantitative' },
  { id: 'nonverbal', label: 'Nonverbal' },
  { id: 'verbal', label: 'Verbal' },
];

const ARCHETYPES_BY_SUBTEST: Record<SubtestType, { id: QuestionArchetype; label: string }[]> = {
  quantitative: [
    { id: 'number-matrix', label: 'Number Matrix' },
    { id: 'balance-scale', label: 'Balance Scale' },
    { id: 'shape-quantity', label: 'Shape Quantity' },
    { id: 'sequence-series', label: 'Sequence & Dice' },
    { id: 'cube-3d', label: '3D Cube Stacks' },
  ],
  nonverbal: [
    { id: 'pattern-completion', label: 'Pattern Completion' },
    { id: 'matrix-analogy', label: 'Matrix Analogy' },
    { id: 'serial-reasoning', label: 'Serial Reasoning' },
    { id: 'spatial-visualization', label: 'Spatial Visualization' },
  ],
  verbal: [
    { id: 'verbal-classification', label: 'Verbal Classification' },
  ],
};

const renderOptionVisual = (visual: CellVisual) => {
  if (!visual) return null;
  if (visual.type === 'number') {
    return <span className="font-mono text-xl font-bold text-gray-900">{visual.value}</span>;
  }
  if (visual.type === 'shape') {
    return (
      <svg className="w-10 h-10" viewBox="0 0 100 100">
        <GeometricShapeSVG visual={visual} />
      </svg>
    );
  }
  if (visual.type === 'dice') {
    return (
      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
        {visual.pips}
      </div>
    );
  }
  if (visual.type === 'verbal-word') {
    return <span className="font-bold text-sm text-gray-900">{visual.word}</span>;
  }
  return null;
};

export const PracticeDojoView: React.FC<PracticeDojoViewProps> = ({
  initialSubtest = 'quantitative',
  initialArchetype,
  mission,
  onCompleteMission,
  onExitDojo,
  onRecordAttempt,
}) => {
  const [subtest, setSubtest] = useState<SubtestType>(
    mission?.targetSubtest === 'all'
      ? 'quantitative'
      : (mission?.targetSubtest as SubtestType) || initialSubtest
  );
  const [archetype, setArchetype] = useState<QuestionArchetype>(
    initialArchetype ||
      (mission?.targetArchetypes?.[0] as QuestionArchetype) ||
      'number-matrix'
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(2);
  const [seedCounter, setSeedCounter] = useState<number>(Date.now());

  const [question, setQuestion] = useState<NGATQuestion>(() =>
    generateAdaptiveQuestion(subtest, difficulty, archetype, seedCounter)
  );

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [hintStage, setHintStage] = useState<number>(0); // 0, 1, 2, 3
  const [solveCount, setSolveCount] = useState<number>(0);
  const [correctStreak, setCorrectStreak] = useState<number>(0);

  const questionStartTimeRef = useRef<number>(Date.now());

  // Generate question when subtest/archetype/difficulty/seed changes
  useEffect(() => {
    const newQ = generateAdaptiveQuestion(subtest, difficulty, archetype, seedCounter);
    setQuestion(newQ);
    setSelectedOptionIndex(null);
    setIsAnswerChecked(false);
    setHintStage(0);
    questionStartTimeRef.current = Date.now();
  }, [subtest, archetype, difficulty, seedCounter]);

  const handleSubtestChange = (newSub: SubtestType) => {
    setSubtest(newSub);
    const validArchetypes = ARCHETYPES_BY_SUBTEST[newSub];
    if (validArchetypes && validArchetypes.length > 0) {
      setArchetype(validArchetypes[0].id);
    }
  };

  const handleNextQuestion = () => {
    setSeedCounter((prev) => prev + 1);
  };

  const handleHintClick = () => {
    setHintStage((prev) => Math.min(3, prev + 1));
  };

  const correctIdx = question.correctIndex ?? 0;

  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null || isAnswerChecked) return;

    const isCorrect = selectedOptionIndex === correctIdx;
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const chosenOption = question.options[selectedOptionIndex];

    setIsAnswerChecked(true);
    setSolveCount((c) => c + 1);
    if (isCorrect) {
      setCorrectStreak((s) => s + 1);
    } else {
      setCorrectStreak(0);
    }

    if (onRecordAttempt) {
      const attempt: QuestionAttempt = {
        questionId: question.id,
        subtest: question.subtest,
        archetype: question.archetype,
        difficulty: question.difficulty,
        selectedOptionIndex,
        correctOptionIndex: correctIdx,
        isCorrect,
        timeSpentSeconds: timeSpent,
        hintsUsed: hintStage,
        trapIdentified: isCorrect ? undefined : chosenOption?.trapType,
        timestamp: Date.now(),
      };
      onRecordAttempt(attempt);
    }

    // Check mission completion condition
    if (mission && onCompleteMission && solveCount + 1 >= mission.questionCount) {
      const accuracy = Math.round(((correctStreak + (isCorrect ? 1 : 0)) / (solveCount + 1)) * 100);
      if (accuracy >= mission.accuracyTargetPercent) {
        onCompleteMission(mission.dayNumber, accuracy);
      }
    }
  };

  const isCorrect = isAnswerChecked && selectedOptionIndex === correctIdx;
  const chosenOption = selectedOptionIndex !== null ? question.options[selectedOptionIndex] : null;

  // Extract hints safely
  const hintsArray = Array.isArray(question.hints) ? question.hints : [];
  const hint1 = hintsArray[0] || 'Focus on the relationship between rows and columns.';
  const hint2 = hintsArray[1] || 'Identify if the pattern involves addition, multiplication, or transformation.';
  const hint3 = hintsArray[2] || question.ruleSummary || 'Apply the deduced rule to fill the missing space.';

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 select-none flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Top Control Bar & Dojo Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitDojo}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
            >
              <span>← Back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                Practice Dojo
              </h1>
              {mission && (
                <span className="text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  {mission.title}
                </span>
              )}
            </div>
          </div>

          {/* Subtest & Archetype Selectors */}
          <div
            data-testid="dojo-subtest-selector"
            className="flex flex-wrap items-center gap-2"
          >
            {/* Subtest Selector */}
            <div className="flex rounded-lg bg-gray-100 p-0.5 border border-gray-200">
              {SUBTEST_OPTIONS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubtestChange(sub.id)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    subtest === sub.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Archetype Selector */}
            <select
              value={archetype}
              onChange={(e) => setArchetype(e.target.value as QuestionArchetype)}
              className="text-xs font-bold text-gray-800 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ARCHETYPES_BY_SUBTEST[subtest]?.map((arch) => (
                <option key={arch.id} value={arch.id}>
                  {arch.label}
                </option>
              ))}
            </select>

            {/* Difficulty Level Selector */}
            <div className="flex items-center gap-1 text-xs font-bold bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
              <span className="text-gray-500 text-[11px]">Level:</span>
              {([1, 2, 3, 4] as DifficultyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`w-6 h-6 rounded-md font-black text-xs transition-colors ${
                    difficulty === lvl
                      ? 'bg-amber-400 text-gray-900 shadow-xs'
                      : 'text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column or Stacked Main Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left / Top Stimulus & Hint Column (approx 65% width) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-gray-200 shadow-xs p-5 flex flex-col justify-between min-h-[380px]">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {question.archetype.replace('-', ' ')}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  Level {question.difficulty}
                </span>
              </div>

              {/* 3-Stage Progressive Hint Button */}
              <button
                data-testid="hint-btn"
                onClick={handleHintClick}
                disabled={hintStage >= 3}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  hintStage === 0
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 shadow-xs'
                    : hintStage < 3
                    ? 'bg-amber-400 text-gray-900 border border-amber-500 hover:bg-amber-500 shadow-xs'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {hintStage === 0 && 'Need a Hint? (Stage 1/3)'}
                  {hintStage === 1 && 'Next Hint: Pattern Type (2/3)'}
                  {hintStage === 2 && 'Final Hint: Rule Reveal (3/3)'}
                  {hintStage >= 3 && 'All Hints Unlocked (3/3)'}
                </span>
              </button>
            </div>

            {/* Stimulus Canvas */}
            <div className="flex-1 flex items-center justify-center p-2 min-h-[220px]">
              <StimulusRenderer
                question={question}
                showHighlight={hintStage > 0 || isAnswerChecked}
                showHiddenXRay={isAnswerChecked}
              />
            </div>

            {/* Revealed Hints Drawer */}
            {hintStage > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                {hintStage >= 1 && (
                  <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 flex items-start gap-2">
                    <span className="font-black text-amber-700 flex-shrink-0">
                      Where to Look:
                    </span>
                    <span>{hint1}</span>
                  </div>
                )}
                {hintStage >= 2 && (
                  <div className="bg-blue-50/90 border border-blue-200/80 rounded-xl p-2.5 text-xs text-blue-900 flex items-start gap-2">
                    <span className="font-black text-blue-700 flex-shrink-0">
                      Pattern Type:
                    </span>
                    <span>{hint2}</span>
                  </div>
                )}
                {hintStage >= 3 && (
                  <div className="bg-purple-50/90 border border-purple-200/80 rounded-xl p-2.5 text-xs text-purple-900 flex items-start gap-2">
                    <span className="font-black text-purple-700 flex-shrink-0">
                      Rule Reveal:
                    </span>
                    <span>{hint3}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right / Options & Feedback Column (approx 35% width) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Options Selection Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xs p-5">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
                Choose the Correct Match:
              </h2>

              <div className="grid grid-cols-1 gap-2.5">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isThisCorrect = idx === correctIdx;

                  let borderClass = 'border-gray-200 hover:border-blue-400 bg-white';
                  if (isSelected && !isAnswerChecked) {
                    borderClass = 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20';
                  } else if (isAnswerChecked) {
                    if (isThisCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30';
                    } else if (isSelected) {
                      borderClass = 'border-rose-400 bg-rose-50 ring-2 ring-rose-400/30';
                    }
                  }

                  return (
                    <button
                      key={opt.id || idx}
                      data-testid={`dojo-option-${idx}`}
                      aria-pressed={isSelected}
                      disabled={isAnswerChecked}
                      onClick={() => setSelectedOptionIndex(idx)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${borderClass}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {opt.label || String.fromCharCode(65 + idx)}
                      </span>
                      <div className="flex-1 font-semibold text-gray-800 text-sm flex items-center">
                        {opt.visual ? renderOptionVisual(opt.visual) : `Option ${String.fromCharCode(65 + idx)}`}
                      </div>
                      {isAnswerChecked && isThisCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {isAnswerChecked && isSelected && !isThisCorrect && (
                        <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: Check Answer & Next Question */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                {!isAnswerChecked ? (
                  <button
                    data-testid="check-answer-btn"
                    onClick={handleCheckAnswer}
                    disabled={selectedOptionIndex === null}
                    className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                      selectedOptionIndex !== null
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Check Answer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl font-black text-sm bg-gray-900 text-white hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Next Puzzle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Instant Pedagogical Feedback Panel */}
            {isAnswerChecked && (
              <div
                data-testid="dojo-feedback-panel"
                className={`rounded-2xl border-2 p-5 shadow-xs space-y-3.5 animate-fadeIn ${
                  isCorrect
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-amber-50/80 border-amber-300'
                }`}
              >
                {/* Result Title */}
                <div className="flex items-center gap-2.5">
                  {isCorrect ? (
                    <>
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-emerald-900 text-sm">
                          Spot On! Great Deduction
                        </h3>
                        <p className="text-[11px] font-bold text-emerald-700">
                          Streak: {correctStreak} in a row
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-rose-900 text-sm">
                          Cognitive Trap Triggered!
                        </h3>
                        <p className="text-[11px] font-bold text-rose-700">
                          Let's inspect the rule breakdown below
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Cognitive Trap Explanation (if incorrect) */}
                {!isCorrect && (chosenOption?.trapExplanation || chosenOption?.trapType) && (
                  <div className="bg-white rounded-xl p-3 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <span className="font-black text-rose-700 uppercase tracking-wider text-[10px] block">
                      Trap Type: {chosenOption?.trapType || 'Distractor Trap'}
                    </span>
                    <p className="font-medium">
                      {chosenOption?.trapExplanation || 'This choice reflects a common distractor pattern. Always re-verify both axes.'}
                    </p>
                  </div>
                )}

                {/* Rule Summary */}
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>Rule Summary</span>
                  </h4>
                  <p className="text-xs font-semibold text-gray-800 bg-white/70 p-2.5 rounded-xl border border-gray-200">
                    {question.ruleSummary || 'Identify the common pattern governing rows, columns, or isometric volume.'}
                  </p>
                </div>

                {/* Step-by-Step Explanation */}
                {question.stepByStepExplanation && question.stepByStepExplanation.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Step-by-Step Deduction:
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1 pl-4 list-disc font-medium">
                      {question.stepByStepExplanation.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Speed Tip */}
                {question.speedTip && (
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-900 flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">
                      <strong className="font-bold">Speed Tip: </strong>
                      {question.speedTip}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
