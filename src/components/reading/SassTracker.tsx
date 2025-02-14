import React from 'react';
import { motion } from 'framer-motion';
import type { UserPatternTracking } from '../../types';

interface SassMetric {
  name: string;
  value: number;
  maxValue: number;
  description: string;
}

interface Props {
  tracking: UserPatternTracking & {
    repeatedThemes: string[];
    sophisticationGrowth: number;
    consistencyScore: number;
  };
}

export const SassTracker: React.FC<Props> = ({ tracking }) => {
  const { repeatedThemes, sophisticationGrowth, consistencyScore } = tracking;

  const getSassEvolutionStage = (growth: number): string => {
    if (growth >= 90) return "Certified Shade Maven";
    if (growth >= 75) return "Professional Tea Spiller";
    if (growth >= 60) return "Advanced Side-Eye Specialist";
    if (growth >= 45) return "Intermediate Shade Apprentice";
    if (growth >= 30) return "Novice Eye-Roll Expert";
    return "Bless Your Heart Beginner";
  };

  const getConsistencyFeedback = (score: number): string => {
    if (score >= 90) return "Your shade game is as reliable as gravity, darling";
    if (score >= 75) return "Almost as consistent as your ex's excuses";
    if (score >= 60) return "Getting there, like a watched pot that occasionally boils";
    if (score >= 45) return "More hits than misses, we love growth";
    return "Let's work on making excellence a habit, not a happy accident";
  };

  const evolutionMetrics: SassMetric[] = [
    {
      name: "Sophistication",
      value: sophisticationGrowth,
      maxValue: 100,
      description: "Your journey from 'that's nice' to 'that's... interesting'"
    },
    {
      name: "Consistency",
      value: consistencyScore,
      maxValue: 100,
      description: "How reliably you serve judgment with a side of honey"
    }
  ];

  return (
    <div className="bg-purple-50/50 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-purple-900">Sass Evolution Tracker</h4>
        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
          {getSassEvolutionStage(sophisticationGrowth)}
        </span>
      </div>

      <div className="space-y-3">
        {evolutionMetrics.map((metric) => (
          <div key={metric.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">{metric.name}</span>
              <span className="text-sm text-purple-600">{metric.value}%</span>
            </div>
            <motion.div 
              className="h-2 bg-purple-100 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(metric.value / metric.maxValue) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>
            <p className="text-xs text-gray-500 italic">{metric.description}</p>
          </div>
        ))}
      </div>

      {repeatedThemes.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium text-purple-900 mb-2">Recurring Themes</h5>
          <div className="flex flex-wrap gap-2">
            {repeatedThemes.map((theme, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
              >
                {theme}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 italic mt-2">
            Your favorite flavors of judgment, served consistently
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500 border-t border-purple-100 pt-3 mt-3">
        <p className="font-medium mb-1">Evolution Status:</p>
        <p className="italic">{getConsistencyFeedback(consistencyScore)}</p>
      </div>
    </div>
  );
};