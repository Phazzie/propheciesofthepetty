import React from 'react';
import { motion } from 'framer-motion';
import type { ReadingInterpretation, EnhancedReadingInterpretation } from '../../types';
import { calculateShadeLevel } from '../../lib/ShadeLevels';

// Constants for scoring thresholds and evaluation
const CORE_METRICS = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'] as const;
const PASSING_THRESHOLD = 80;  // Standardized 80/100 passing threshold
const SHADE_PASSING_THRESHOLD = 7;  // Minimum Level 7 required

// Score multipliers for weighted calculations
const SCORE_MULTIPLIERS = {
  humor: 1.2,      // 20% bonus for humor
  creative: 1.15,  // 15% bonus for creativity
  wisdom: 1.0,     // Base weight
  subtlety: 1.1,   // 10% bonus for subtlety
  relatability: 1.1 // 10% bonus for relatability
};

const getScoreColor = (score: number, threshold = PASSING_THRESHOLD) => {
  if (score >= threshold) return 'text-green-600 dark:text-green-400';
  if (score >= threshold * 0.8) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const MetricBar: React.FC<{ value: number }> = ({ value }) => (
  <motion.div 
    className="h-2 bg-purple-100 rounded-full overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      className={`h-full ${value >= PASSING_THRESHOLD ? 'bg-green-500' : 'bg-purple-500'}`}
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.8 }}
    />
  </motion.div>
);

// Score feedback with consistent messaging
const SCORE_FEEDBACK = {
  humor: {
    high: "Perfectly seasoned with sass",
    medium: "The flavor is there, but needs more spice",
    low: "Let's add some zest to this dish"
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
};

interface Props {
  interpretation: ReadingInterpretation | EnhancedReadingInterpretation;
}

// Calculate weighted score using standardized multipliers
const calculateWeightedScore = (baseScore: number, metric: keyof typeof SCORE_MULTIPLIERS) => {
  const multiplier = SCORE_MULTIPLIERS[metric] || 1.0;
  return Math.round(baseScore * multiplier);
};

export const ReadingScores: React.FC<Props> = ({ interpretation }) => {
  if (!interpretation) {
    return <p className="text-gray-500 italic">No reading data available</p>;
  }

  const { scores } = interpretation;
  const shadeDetails = calculateShadeLevel(scores.shadeIndex);
  const isPassingCore = CORE_METRICS.every(metric => scores[metric] >= PASSING_THRESHOLD);
  const isPassingShade = shadeDetails.level >= SHADE_PASSING_THRESHOLD;
  const overallPassing = isPassingCore && isPassingShade;

  // Render metric with standardized scoring
  const renderMetric = (metric: keyof typeof SCORE_FEEDBACK, value: number) => {
    const weightedValue = calculateWeightedScore(value, metric as keyof typeof SCORE_MULTIPLIERS);
    const feedback = value >= 85 ? SCORE_FEEDBACK[metric].high :
                    value >= 70 ? SCORE_FEEDBACK[metric].medium :
                    SCORE_FEEDBACK[metric].low;
    
    const isHumor = metric === 'humor';
    
    return (
      <div key={metric} className={`space-y-1 ${isHumor ? 'bg-purple-50 p-3 rounded-lg' : ''}`}>
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${isHumor ? 'text-purple-900' : 'text-gray-700'} capitalize`}>
            {metric}
            {isHumor && ' ⭐'}
          </span>
          <div className="text-right">
            <span className={`text-sm font-medium ${getScoreColor(value)}`}>
              {weightedValue}/100
            </span>
            <span className="text-xs text-gray-500 ml-2">
              (Base: {value}/100)
            </span>
          </div>
        </div>
        <MetricBar value={value} />
        <p className={`text-xs italic ${isHumor ? 'text-purple-600' : 'text-gray-500'}`}>
          {feedback}
        </p>
      </div>
    );
  };

  return (
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
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Core Metrics</h3>
        <div className="grid gap-4" data-testid="primary-metrics">
          {CORE_METRICS.map(metric => renderMetric(metric, scores[metric]))}
        </div>
      </section>

      <div className="text-sm text-gray-600 mb-4">
        <h4 className="font-medium mb-2">Scoring Requirements:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Core metrics minimum: {PASSING_THRESHOLD}/100 (currently {CORE_METRICS.filter(m => scores[m] >= PASSING_THRESHOLD).length}/{CORE_METRICS.length} passing)</li>
          <li>Shade Level™ minimum: Level {SHADE_PASSING_THRESHOLD} (currently Level {shadeDetails.level})</li>
          <li className={isPassingCore ? 'text-green-600' : 'text-red-600'}>
            Required: Core metrics {isPassingCore ? 'passing' : 'not passing'}
          </li>
        </ul>
      </div>
    </div>
  );
};