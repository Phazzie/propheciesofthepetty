import React, { useMemo } from 'react';
import styles from './ReadingLayout.module.css';
import type { Card, ReadingInterpretation, SpreadType } from '../../types';
import { ReadingScores } from './ReadingScores';

export const CELTIC_CROSS = 'celtic-cross';
import { SPREADS } from '../../types/spreads';
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
    return spreadType === CELTIC_CROSS ? 'grid-cols-4 grid-rows-4' : 'grid-cols-3';
  };

  const [error, setError] = React.useState<string | null>(null);

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
      setError(`Spread type ${spreadType} not found`);
      return [];
    }
    
    return spread.positions.map((pos, i): ReadingPosition => ({
      id: `${spreadType}-${i}`,
      name: pos.name,
      description: pos.description,
      className: spreadType === 'celtic-cross' ? CELTIC_CROSS_POSITIONS[i]?.className || 'col-span-1' : 'col-span-1'
    }));
  }, [spreadType, isCustomSpread, customPositions]);
  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }
  if (isLoading) {
    const numPositions = isCustomSpread ? customPositions?.length || 3 : spreadType === 'celtic-cross' ? 10 : 3;

    return (
      <div className="space-y-8 animate-pulse">
        <div data-testid="grid-layout" className={`${styles.gridLayout} ${getLayoutClass()}`}>
          {Array.from({ length: numPositions }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-purple-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackUI={<div className="text-red-500">Error loading reading layout</div>}>
      <div className="space-y-8">
        <div data-testid="grid-layout" className={`grid gap-4 ${getLayoutClass()}`}>
          {positions.map((position, index) => {
            const card = cards[index];
            return useMemo(() => (
              <div key={position.id} className={`relative ${position.className}`}>
                {card ? (
                  <div className="relative">
                    <TarotCard
                      card={card}
                      isRevealed={isRevealed}
                      isReversed={card.isReversed}
                    />
                    <div className={styles.positionName}>
                      {position.name}
                    </div>
                    <div className={styles.positionDescription}>
                      <p>
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
            ), [card, isRevealed, position]);
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