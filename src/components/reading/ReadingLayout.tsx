import React, { useMemo } from 'react';
import type { Card, ReadingInterpretation, SpreadType } from '../../types';
import { ReadingScores } from './ReadingScores';
import { SPREADS } from './SpreadSelector';
import { TarotCard } from '../TarotCard';
import { HelpCircle } from 'lucide-react';
import type { ReadingPosition } from './types';
import { ErrorBoundary } from '../ErrorBoundary';

interface Props {
  spreadType: SpreadType;
  cards: (Card & { position: number; isReversed: boolean })[];
  interpretation?: ReadingInterpretation;
  isRevealed: boolean;
  isCustomSpread?: boolean;
  customPositions?: Array<{ name: string; description: string }>;
  isLoading?: boolean;
}

const getCustomLayoutClass = (totalPositions: number): string => {
  if (totalPositions <= 3) return 'grid-cols-3';
  if (totalPositions <= 4) return 'grid-cols-2 grid-rows-2';
  if (totalPositions <= 6) return 'grid-cols-3 grid-rows-2';
  if (totalPositions <= 9) return 'grid-cols-3 grid-rows-3';
  return 'grid-cols-4 grid-rows-3';
};

export const ReadingLayout: React.FC<Props> = ({
  spreadType,
  cards,
  interpretation,
  isRevealed,
  isCustomSpread,
  customPositions,
  isLoading
}) => {
  const getLayoutClass = () => {
    if (isCustomSpread && customPositions) {
      return getCustomLayoutClass(customPositions.length);
    }
    return spreadType === 'celtic-cross' ? 'grid-cols-4 grid-rows-4' : 'grid-cols-3';
  };

  const positions = useMemo(() => {
    if (isCustomSpread && customPositions) {
      return customPositions.map((pos, i): ReadingPosition => ({
        id: `custom-${i}`,
        name: pos.name,
        description: pos.description,
        className: 'col-span-1'
      }));
    }
    
    const spread = SPREADS.find(s => s.id === spreadType);
    if (!spread) {
      console.error(`Spread type ${spreadType} not found`);
      return [];
    }
    
    return spread.positions.map((pos, i): ReadingPosition => ({
      id: `${spreadType}-${i}`,
      name: pos.name,
      description: pos.description,
      className: spreadType === 'celtic-cross' ? CELTIC_CROSS_POSITIONS[i]?.className || 'col-span-1' : 'col-span-1'
    }));
  }, [spreadType, isCustomSpread, customPositions]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className={`grid gap-4 ${getLayoutClass()}`}>
          {Array.from({ length: isCustomSpread ? customPositions?.length || 3 : spreadType === 'celtic-cross' ? 10 : 3 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-purple-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div className="text-red-500">Error loading reading layout</div>}>
      <div className="space-y-8">
        <div className={`grid gap-4 ${getLayoutClass()}`}>
          {positions.map((position, index) => {
            const card = cards[index];
            return (
              <div key={position.id} className={`relative ${position.className}`}>
                {card ? (
                  <div className="relative">
                    <TarotCard
                      card={card}
                      isRevealed={isRevealed}
                      isReversed={card.isReversed}
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {position.name}
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full">
                      <p className="text-xs text-gray-500 italic text-center">
                        {position.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="aspect-[2/3] bg-purple-100 rounded-lg flex items-center justify-center"
                    role="img"
                    aria-label={`Empty position: ${position.name} - ${position.description}`}
                  >
                    <HelpCircle className="w-8 h-8 text-purple-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
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
    </ErrorBoundary>
  );
};

const CELTIC_CROSS_POSITIONS = [
  { className: 'col-start-2 row-start-2' },               // Present
  { className: 'col-start-2 row-start-2 rotate-90' },    // Challenge
  { className: 'col-start-2 row-start-3' },              // Foundation
  { className: 'col-start-1 row-start-2' },              // Past
  { className: 'col-start-2 row-start-1' },              // Crown
  { className: 'col-start-3 row-start-2' },              // Future
  { className: 'col-start-4 row-start-1' },              // Self
  { className: 'col-start-4 row-start-2' },              // Environment
  { className: 'col-start-4 row-start-3' },              // Hopes/Fears
  { className: 'col-start-4 row-start-4' }               // Outcome
];