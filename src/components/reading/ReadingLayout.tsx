import React from 'react';
import type { Card, ReadingInterpretation } from '../../types';
import { ReadingScores } from './ReadingScores';
import { SPREADS } from './SpreadSelector';
import { TarotCard } from '../TarotCard';

interface Props {
  spreadType: string;
  cards: (Card & { position: number; isReversed: boolean })[];
  interpretation?: ReadingInterpretation;
  isRevealed: boolean;
  isCustomSpread?: boolean;
  customPositions?: Array<{ name: string; description: string }>;
}

const getPositionName = (spreadType: string, position: number): string => {
  const spread = SPREADS.find((s) => s.id === spreadType);
  if (spread?.positions[position]) {
    return spread.positions[position].description;
  }
  return '';
};

export const ReadingLayout: React.FC<Props> = ({
  spreadType,
  cards,
  interpretation,
  isRevealed,
  isCustomSpread,
  customPositions
}) => {
  const getLayoutClass = () => {
    if (isCustomSpread && customPositions) {
      return customPositions.length > 6 ? 'grid-cols-4' : 'grid-cols-3';
    }
    return spreadType === 'celtic-cross' ? 'grid-cols-4' : 'grid-cols-3';
  };

  return (
    <div className="space-y-8">
      {/* Card layout section */}
      <div className={`grid gap-4 ${getLayoutClass()}`}>
        {cards.map((card, index) => (
          <div key={index} className="relative">
            <div className="aspect-[2/3]">
              <TarotCard
                card={card}
                isRevealed={isRevealed}
                isReversed={card.isReversed}
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                {isCustomSpread && customPositions 
                  ? customPositions[index]?.name
                  : getPositionName(spreadType, index)
                }
              </div>
            </div>
          </div>
        ))}
        {/* Empty positions */}
        {Array.from({ length: (spreadType === 'celtic-cross' ? 10 : 3) - cards.length }).map((_, i) => (
          <div key={`empty-${i}`} className="relative">
            <div 
              className="aspect-[2/3] bg-purple-100 rounded-lg flex items-center justify-center"
              role="img"
              aria-label="empty position"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-purple-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="presentation"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      {/* Reading interpretation and scores */}
      {interpretation && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Your Reading</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{interpretation.text}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ReadingScores interpretation={interpretation} />
          </div>
        </div>
      )}
    </div>
  );
};