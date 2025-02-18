import React from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../../types';
import { SHADE_LEVELS } from '../../lib/ShadeLevels';

interface Props {
  selectedCards: Card[];
  maxCards: number;
  isPredictingScore?: boolean;
}

const PredictiveScoring: React.FC<Props> = ({
  selectedCards,
  maxCards,
  isPredictingScore = false
}) => {
  const progressPercentage = (selectedCards.length / maxCards) * 100;

  // Quick predictions based on card meanings
  const predictShadeLevel = (cards: Card[]) => {
    // More cards = potentially higher shade level
    const baseLevel = Math.min(Math.ceil(cards.length / 2), 5);
    
    // Analyze card descriptions for shade potential
    const shadeIndicators = cards.reduce((count, card) => {
      const desc = (card.description + (card.reversedDescription || '')).toLowerCase();
      const hasShade = [
        'but', 'however', 'though', 'actually', 'obviously',
        'clearly', 'perhaps', 'maybe', 'interesting'
      ].some(word => desc.includes(word));
      return count + (hasShade ? 1 : 0);
    }, 0);

    return Math.min(baseLevel + Math.floor(shadeIndicators / 2), 10);
  };

  const predictedLevel = predictShadeLevel(selectedCards);
  const currentRange = SHADE_LEVELS[predictedLevel];

  return (
    <div className="space-y-4">
      <div className="relative pt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-purple-600">
              Card Selection Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-purple-600">
              {selectedCards.length}/{maxCards}
            </span>
          </div>
        </div>
        <motion.div
          className="overflow-hidden h-2 text-xs flex rounded bg-purple-100 mt-1"
          initial={false}
        >
          <motion.div
            style={{ width: `${progressPercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </div>

      {isPredictingScore && selectedCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-purple-900 mb-2">
            Potential Shade Level™ Preview
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">
                {currentRange.title}
              </span>
              <span className="text-sm font-medium text-purple-600">
                Level {predictedLevel}
              </span>
            </div>
            <p className="text-xs text-gray-600 italic">
              {currentRange.description}
            </p>
            {predictedLevel < 7 && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ Aiming for minimum Level 7 for passing grade
              </p>
            )}
            {predictedLevel >= 3 && predictedLevel <= 4 && (
              <p className="text-xs text-green-600 mt-2">
                ✨ Clear undertones of judgment detected
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PredictiveScoring;