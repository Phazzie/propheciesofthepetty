import React from 'react';
import type { Card, ReadingInterpretation } from '../../types';
import { ReadingScores } from './ReadingScores';

interface Props {
  spreadType: string;
  cards: (Card & { position: number; isReversed: boolean })[];
  interpretation?: ReadingInterpretation;
}

export const ReadingLayout: React.FC<Props> = ({
  spreadType,
  cards,
  interpretation
}) => {
  return (
    <div className="space-y-8">
      {/* Card layout section */}
      <div className={`grid gap-4 ${
        spreadType === 'celtic-cross' 
          ? 'grid-cols-4 grid-rows-4'
          : 'grid-cols-3'
      }`}>
        {cards.map((card, index) => (
          <div key={index} className="relative">
            <div className="aspect-[2/3] bg-purple-100 rounded-lg p-4">
              <div className="text-center">
                <h3 className="font-medium text-purple-900">{card.name}</h3>
                {card.isReversed && (
                  <span className="text-sm text-purple-600">(Reversed)</span>
                )}
              </div>
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
          <ReadingScores scores={interpretation.scores} />
        </div>
      )}
    </div>
  );
};