import React from 'react';
import { motion } from 'framer-motion';

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

interface Interpretation {
  scores: Scores;
  stages?: {
    denial: string;
    anger: string;
    bargaining: string;
    depression: string;
    acceptance: string;
  };
}

interface ReadingScoresProps {
  interpretation: Interpretation | null;
}

// Constants for scoring thresholds
const CORE_METRICS = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'] as const;
const PASSING_THRESHOLD = 80; // 8/10 scaled to 100
const SHADE_PASSING_THRESHOLD = 7;

// Helper function to determine score color based on thresholds
const getScoreColor = (score: number, threshold = PASSING_THRESHOLD) => {
  if (score >= threshold) return 'text-green-600';
  if (score >= threshold * 0.8) return 'text-yellow-600';
  return 'text-red-600';
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

// Calculate shade level and corresponding message
const calculateShadeLevelDetails = (shadeIndex: ShadeIndex) => {
  const values = Object.values(shadeIndex);
  const averageScore = values.reduce((sum, val) => sum + val, 0) / values.length;
  const level = Math.min(Math.floor(averageScore / 10), 10); // Convert 0-100 to 0-10 scale, cap at 10
  
  // Level 3-4 special criteria check
  if (level >= 3 && level <= 4) {
    // Check if guiltTripIntensity is above 60 for Level 4
    if (shadeIndex.guiltTripIntensity >= 60) {
      return { level: 4, message: "Clear undertones of judgment" };
    }
    return { level: 3, message: "Clear undertones of judgment" };
  }

  // Other shade levels
  if (level >= 9) return { level, message: "Master of Shade" };
  if (level >= 7) return { level, message: "Professional Tea Spiller" };
  if (level >= 5) return { level, message: "Accomplished Side-Eye" };
  return { level, message: "Still learning the art of shade" };
};

// Calculate weighted scores for metrics
const calculateWeightedScore = (scores: Scores) => {
  // Weight multipliers for core metrics
  const weights = {
    subtlety: 1.2,  // Subtle shade is an art
    relatability: 1.1,
    wisdom: 1.15,   // Wisdom adds depth to shade
    creative: 1.1,
    humor: 1.25,    // Humor is key to effective shade
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

// Main component rendering
export const ReadingScores: React.FC<ReadingScoresProps> = ({ interpretation }) => {
  if (!interpretation) {
    return <p className="text-gray-500 italic">No reading data available</p>;
  }

  const { scores } = interpretation;
  const weightedScores = calculateWeightedScore(scores);
  const shadeDetails = calculateShadeLevelDetails(scores.shadeIndex);
  
  const isPassingShade = shadeDetails.level >= SHADE_PASSING_THRESHOLD;
  const isPassingCore = CORE_METRICS.every(metric => scores[metric] >= PASSING_THRESHOLD);
  const overallPassing = isPassingShade && isPassingCore;

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

      <div className="text-sm text-gray-600 mb-4">
        <h4 className="font-medium mb-2">Scoring Guidelines:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Core metrics require minimum 80/100</li>
          <li>Shade Level™ requires minimum Level 7</li>
          <li>Level 3-4: Mastery of clear undertones</li>
          <li>Total weighted score: {weightedScores.weighted}/{weightedScores.max}</li>
        </ul>
      </div>

      {interpretation.stages && (
        <div className="space-y-2 border-l-4 border-purple-200 pl-4 mb-6">
          <p className="text-purple-700 dark:text-purple-300 italic">{interpretation.stages.denial}</p>
          <p className="text-red-600 dark:text-red-400 italic">{interpretation.stages.anger}</p>
          <p className="text-yellow-600 dark:text-yellow-400 italic">{interpretation.stages.bargaining}</p>
          <p className="text-blue-600 dark:text-blue-400 italic">{interpretation.stages.depression}</p>
          <p className="text-green-600 dark:text-green-400 italic font-medium">{interpretation.stages.acceptance}</p>
        </div>
      )}

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Core Metrics</h3>
        <div className="grid gap-4" data-testid="primary-metrics">
          {CORE_METRICS.map(metric => (
            <div key={metric} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {metric}
                </span>
                <span className={`text-sm font-medium ${getScoreColor(scores[metric])}`}>
                  {scores[metric]}/100
                </span>
              </div>
              {renderMetricBar(scores[metric])}
            </div>
          ))}
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
                    {value}/100
                  </span>
                </div>
                {renderMetricBar(value)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};