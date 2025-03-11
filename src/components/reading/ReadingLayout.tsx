import React, { useMemo } from 'react';
import styles from './ReadingLayout.module.css';
import type { Card, ReadingInterpretation, SpreadType } from '../../types';
import { SPREADS } from '../../types/spreads';
import { TarotCard } from '../TarotCard';
import { HelpCircle } from 'lucide-react';
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

const getPositionName = (spreadType: string, position: number): string => {
  // Use the SPREADS constant from SpreadSelector for consistent position names
  const spread = SPREADS.find(s => s.id === spreadType);
  if (spread && spread.positions[position]) {
    return `${spread.positions[position].name} - ${spread.positions[position].description}`;
  }
  return '';
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
  // Calculate layout class based on spread type
  const getLayoutClass = () => {
    switch(spreadType) {
      case 'celtic-cross':
        return 'grid-cols-4 grid-rows-4';
      default:
        return 'grid-cols-3';
    }
  };

  // Get positions based on spread type or custom positions
  const positions = useMemo(() => {
    const spread = SPREADS.find(s => s.id === spreadType);
    if (isCustomSpread && customPositions) {
      return customPositions.map((pos, idx) => ({
        id: `custom-${idx}`,
        name: pos.name,
        description: pos.description,
        className: ''
      }));
    }
    
    return (spread?.positions || []).map((pos, idx) => ({
      id: `${spreadType}-${idx}`,
      name: pos.name,
      description: pos.description,
      className: spreadType === 'celtic-cross' 
        ? getCelticCrossPositionClass(idx)
        : ''
    }));
  }, [spreadType, isCustomSpread, customPositions]);

  // Helper function for celtic cross specific positioning
  const getCelticCrossPositionClass = (index: number) => {
    const positions = [
      'col-span-1 row-span-1', // First card
      'col-span-1 row-span-1', // Second card (crosses the first)
      'col-span-1 row-span-1', // Below
      'col-span-1 row-span-1', // Above
      'col-span-1 row-span-1', // Left
      'col-span-1 row-span-1', // Right
      'col-span-1 row-span-1', // Position 7
      'col-span-1 row-span-1', // Position 8
      'col-span-1 row-span-1', // Position 9
      'col-span-1 row-span-1'  // Position 10
    ];
    return positions[index] || '';
  };

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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Your Reading</h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {typeof interpretation.text === 'string' 
                ? interpretation.text 
                : JSON.stringify(interpretation.text)}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};