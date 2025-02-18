import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ReadingInterpretation, EnhancedReadingInterpretation } from '../../types';
import { calculateShadeLevel, hasRequiredUndertones, isShadeLevelPassing, getShadeBreakdown } from '../../lib/ShadeLevels';
import ShadeCelebration from './ShadeCelebration';

// Interface definitions for score tracking
interface ShadeIndex {
  plausibleDeniability: number;
  guiltTripIntensity: number;
  emotionalManipulation: number;
  backhandedCompliments: number;
  strategicVagueness: number;
}

interface Scores {
  humor: number;
  snark: number;
  culturalResonance: number;
  metaphorMastery: number;
  subtlety: number;
  relatability: number;
  wisdom: number;
  creative: number;
  shadeIndex: ShadeIndex;
}

interface Props {
  interpretation: ReadingInterpretation | EnhancedReadingInterpretation;
}

// Constants for scoring thresholds and evaluation
const CORE_METRICS = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'] as const;
const PASSING_THRESHOLD = 80;

// Helper function to determine score color with clever friend energy
const getScoreColor = (score: number, threshold = PASSING_THRESHOLD) => {
  if (score >= threshold) return 'text-green-600 dark:text-green-400'; // "Your growth is showing, darling"
  if (score >= threshold * 0.8) return 'text-yellow-600 dark:text-yellow-400'; // "We're getting warmer... metaphorically speaking"
  return 'text-red-600 dark:text-red-400'; // "Let's call this a learning opportunity"
};

// Animated metric bar component
const renderMetricBar = (value: number, maxValue: number = 100) => (
  <motion.div 
    className="h-2 bg-purple-100 rounded-full overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      className={`h-full ${value >= PASSING_THRESHOLD ? 'bg-green-500' : 'bg-purple-500'}`}
      initial={{ width: 0 }}
      animate={{ width: `${(value / maxValue) * 100}%` }}
      transition={{ duration: 0.8 }}
    />
  </motion.div>
);

// Constants for scoring with emphasis on humor
const SCORE_FEEDBACK = {
  humor: {
    high: "Actually made me laugh out loud. We love growth.",
    medium: "I see what you did there... almost",
    low: "Let's workshop your comedy routine"
  },
  creative: {
    high: "These metaphors deserve their own Netflix special",
    medium: "The creativity is... developing",
    low: "Points for attempting originality"
  },
  wisdom: {
    high: "Truth bombs wrapped in comedy gold",
    medium: "The insight is there, just needs better jokes",
    low: "Less lecture, more laughter please"
  },
  subtlety: {
    high: "The delayed laugh - when they get it later",
    medium: "A bit on the nose, but we're learning",
    low: "Subtlety is an art form, darling"
  },
  relatability: {
    high: "Group chat material right here",
    medium: "They might screenshot this... maybe",
    low: "Know your audience, sweetie"
  }
} as const;

// Calculate weighted scores with emphasis on humor
const calculateWeightedScore = (scores: Scores) => {
  const weights = {
    humor: 2.0,       // Double weight on being funny
    creative: 1.5,    // Clever metaphors matter
    wisdom: 1.0,      // Insight is still important
    subtlety: 1.3,    // Artful delivery counts
    relatability: 1.2 // Shared jokes land better
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const weightedSum = CORE_METRICS.reduce((sum, metric) => {
    return sum + (scores[metric] * weights[metric as keyof typeof weights]);
  }, 0);

  return {
    weighted: Math.round(weightedSum),
    max: Math.round(100 * totalWeight)
  };
};

// Update the rendering of scores to highlight humor
const renderMetricWithFeedback = (metric: keyof typeof SCORE_FEEDBACK, value: number) => {
  const feedback = value >= 85 ? SCORE_FEEDBACK[metric].high :
                  value >= 70 ? SCORE_FEEDBACK[metric].medium :
                  SCORE_FEEDBACK[metric].low;
  
  // Highlight humor score with special styling
  const isHumor = metric === 'humor';
  
  return (
    <div key={metric} className={`space-y-1 ${isHumor ? 'bg-purple-50 p-3 rounded-lg' : ''}`}>
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${
          isHumor ? 'text-purple-900' : 'text-gray-700'
        } capitalize`}>
          {metric}
          {isHumor && ' ⭐'}
        </span>
        <span className={`text-sm font-medium ${getScoreColor(value)}`}>
          {value}/100
        </span>
      </div>
      {renderMetricBar(value)}
      <p className={`text-xs italic ${
        isHumor ? 'text-purple-600' : 'text-gray-500'
      } mt-1`}>{feedback}</p>
    </div>
  );
};

// New visual range component for Shade Level™
const ShadeLevelRange: React.FC<{ level: number }> = ({ level }) => {
  const ranges = [
    { range: '1-2', label: 'Novice Shade', description: 'Still learning the art of subtlety' },
    { range: '3-4', label: 'The Pointed Pause', description: 'Clear undertones of judgment' },
    { range: '5-6', label: 'Advanced Practice', description: 'Mastering the craft' },
    { range: '7-8', label: 'Expert Level', description: 'Devastating effectiveness' },
    { range: '9-10', label: 'Transcendent', description: 'Pure art form' }
  ];

  const getCurrentRange = (level: number) => {
    if (level <= 2) return 0;
    if (level <= 4) return 1;
    if (level <= 6) return 2;
    if (level <= 8) return 3;
    return 4;
  };

  const currentRangeIndex = getCurrentRange(level);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-purple-900">Level Ranges</span>
        <span className="text-sm text-purple-600">{level}/10</span>
      </div>
      <div className="space-y-2">
        {ranges.map((range, index) => {
          const isCurrentRange = index === currentRangeIndex;
          const isPastRange = index < currentRangeIndex;
          const isFutureRange = index > currentRangeIndex;

          return (
            <div
              key={range.range}
              className={`p-2 rounded-lg transition-all ${
                isCurrentRange
                  ? 'bg-purple-100 border-l-4 border-purple-500'
                  : isPastRange
                  ? 'bg-green-50 opacity-75'
                  : 'bg-gray-50 opacity-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${
                  isCurrentRange ? 'text-purple-900' : 'text-gray-700'
                }`}>
                  {range.label}
                </span>
                <span className="text-xs text-gray-500">{range.range}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{range.description}</p>
              {isCurrentRange && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${((level % 2) + 1) * 50}%` }}
                  className="h-1 bg-purple-500 rounded-full mt-2"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main component rendering
export const ReadingScores: React.FC<Props> = ({ interpretation }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastLevel, setLastLevel] = useState<number>(0);

  if (!interpretation) {
    return <p className="text-gray-500 italic">No reading data available</p>;
  }

  const { scores } = interpretation;
  const shadeDetails = calculateShadeLevel(scores.shadeIndex);
  const shadeBreakdown = getShadeBreakdown(scores.shadeIndex);
  
  const isPassingCore = CORE_METRICS.every(metric => scores[metric] >= PASSING_THRESHOLD);
  const hasUndertones = hasRequiredUndertones(scores.shadeIndex);
  const isPassingShade = isShadeLevelPassing(scores.shadeIndex);
  const overallPassing = isPassingShade && isPassingCore && hasUndertones;

  const isEnhanced = 'stages' in interpretation;

  useEffect(() => {
    // Check if we've hit a milestone level
    const milestones = [3, 4, 7, 8, 9, 10];
    if (milestones.includes(shadeDetails.level) && shadeDetails.level !== lastLevel) {
      setShowCelebration(true);
      setLastLevel(shadeDetails.level);
    }
  }, [shadeDetails.level, lastLevel]);

  return (
    <>
      <div data-testid="scores-container" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">Reading Analysis</h2>
          <span 
            data-testid="passing-status"
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              overallPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {overallPassing ? 'Serving Excellence' : 'Needs Work, Darling'}
          </span>
        </div>

        {/* Enhanced Shade Level Display with Range Indicator */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                Shade Level™ {shadeDetails.level}
              </h3>
              <p className={`text-sm ${shadeDetails.colorClass} mt-1`}>
                {shadeDetails.title}
              </p>
            </div>
            <span className={`text-sm font-medium ${isPassingShade ? 'text-green-600' : 'text-red-600'}`}>
              {isPassingShade ? 'Passing' : 'Not Passing'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-2">
            {shadeDetails.feedback}
          </p>
          <div className="mt-4">
            <ShadeLevelRange level={shadeDetails.level} />
          </div>
        </div>

        {/* Shade Components Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200">Shade Components</h3>
          <div className="grid gap-4">
            {shadeBreakdown.map(({ component, score, feedback }) => (
              <div key={component} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {component.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-medium text-purple-600">
                    {score}/100
                  </span>
                </div>
                {renderMetricBar(score)}
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  {feedback}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <h4 className="font-medium mb-2">Scoring Requirements:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Core metrics minimum: 80/100 (currently {CORE_METRICS.filter(m => scores[m] >= PASSING_THRESHOLD).length}/{CORE_METRICS.length} passing)</li>
            <li>Shade Level™ minimum: Level 7 (currently Level {shadeDetails.level})</li>
            <li className={hasUndertones ? 'text-green-600' : 'text-red-600'}>
              Required: Level 3-4 Clear Undertones ({shadeDetails.undertoneStrength})
            </li>
          </ul>
        </div>

        {isEnhanced && (interpretation as EnhancedReadingInterpretation).stages && (
          <div className="space-y-2 border-l-4 border-purple-200 pl-4 mb-6">
            <p className="text-purple-700 dark:text-purple-300 italic">{(interpretation as EnhancedReadingInterpretation).stages.denial}</p>
            <p className="text-red-600 dark:text-red-400 italic">{(interpretation as EnhancedReadingInterpretation).stages.anger}</p>
            <p className="text-yellow-600 dark:text-yellow-400 italic">{(interpretation as EnhancedReadingInterpretation).stages.bargaining}</p>
            <p className="text-blue-600 dark:text-blue-400 italic">{(interpretation as EnhancedReadingInterpretation).stages.depression}</p>
            <p className="text-green-600 dark:text-green-400 italic font-medium">{(interpretation as EnhancedReadingInterpretation).stages.acceptance}</p>
          </div>
        )}

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Core Metrics</h3>
          <div className="grid gap-4" data-testid="primary-metrics">
            {CORE_METRICS.map(metric => renderMetricWithFeedback(metric, scores[metric]))}
          </div>
        </section>

        <section className="space-y-4" data-testid="passive-aggressive-metrics">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Style & Delivery</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Shade Level™</span>
              <div className="text-right">
                <span data-testid="shade-level" className="text-sm font-medium text-purple-600 block">
                  Level {shadeDetails.level}/10
                </span>
                <span data-testid="shade-message" className="text-xs text-gray-500 dark:text-gray-400 italic">
                  {shadeDetails.message}
                </span>
              </div>
            </div>

            <div className="space-y-3" data-testid="shade-metrics">
              {Object.entries(scores.shadeIndex).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      {Number(value)}/100
                    </span>
                  </div>
                  {renderMetricBar(Number(value))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <ShadeCelebration 
        level={shadeDetails.level}
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </>
  );
};