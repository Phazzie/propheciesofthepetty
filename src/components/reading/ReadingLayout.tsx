import React, { useMemo } from 'react';
import styles from './ReadingLayout.module.css';
import type { Card, ReadingInterpretation, SpreadType } from '../../types';
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
}

// Define proper type for a position in a spread
interface SpreadPosition {
  name: string;
  description: string;
}

// Predefined spread definitions - moved outside component for better performance
const SPREAD_DEFINITIONS: Record<SpreadType, SpreadPosition[]> = {
  'celtic-cross': [
    { name: 'Present', description: 'Represents your current situation' },
    { name: 'Challenge', description: 'Shows the immediate challenge you face' },
    { name: 'Foundation', description: 'The basis of the situation' },
    { name: 'Recent Past', description: 'What is just behind you' },
    { name: 'Crown', description: 'What you hope for' },
    { name: 'Near Future', description: 'What is before you' },
    { name: 'Self', description: 'How you see yourself' },
    { name: 'Environment', description: 'How others see you' },
    { name: 'Hopes/Fears', description: 'Your hopes and fears' },
    { name: 'Outcome', description: 'The ultimate outcome' }
  ],
  'past-present-future': [
    { name: 'Past', description: 'What led to your current situation' },
    { name: 'Present', description: 'Your current situation' },
    { name: 'Future', description: 'Where things are heading' }
  ],
  'three-card': [
    { name: 'Mind', description: 'Your thoughts and mental state' },
    { name: 'Body', description: 'Your physical and material concerns' },
    { name: 'Spirit', description: 'Your spiritual and emotional state' }
  ]
};

// Celtic cross position styling helper
const getCelticCrossPositionClass = (index: number): string => {
  const positionClasses = [
    'col-start-2 row-start-2', // Present
    'col-start-2 row-start-2 rotate-90', // Challenge
    'col-start-2 row-start-3', // Foundation
    'col-start-1 row-start-2', // Past
    'col-start-2 row-start-1', // Crown
    'col-start-3 row-start-2', // Future
    'col-start-4 row-start-1', // Self
    'col-start-4 row-start-2', // Environment
    'col-start-4 row-start-3', // Hopes/Fears
    'col-start-4 row-start-4'  // Outcome
  ];
  
  return positionClasses[index] || 'col-span-1';
};

// Layout class helper
const getLayoutClass = (spreadType: SpreadType): string => {
  switch(spreadType) {
    case 'celtic-cross':
      return 'grid-cols-4 grid-rows-4 gap-4';
    case 'past-present-future':
    case 'three-card':
    default:
      return 'grid-cols-3 gap-6';
  }
};

export const ReadingLayout: React.FC<Props> = ({
  spreadType,
  cards,
  interpretation,
  isRevealed,
  isCustomSpread,
  customPositions,
}) => {
  // Generate position data based on spread type or custom positions
  const positions = useMemo(() => {
    // If custom spread is selected and positions are provided
    if (isCustomSpread && customPositions) {
      return customPositions.map((pos, idx) => ({
        id: `custom-${idx}`,
        name: pos.name,
        description: pos.description,
        className: ''
      }));
    }
    
    // Use predefined spread positions
    const spreadPositions = SPREAD_DEFINITIONS[spreadType] || [];
    
    return spreadPositions.map((pos, idx) => ({
      id: `${spreadType}-${idx}`,
      name: pos.name,
      description: pos.description,
      className: spreadType === 'celtic-cross' 
        ? getCelticCrossPositionClass(idx)
        : ''
    }));
  }, [spreadType, isCustomSpread, customPositions]);

  // Render card positions with proper memoization
  const renderedPositions = useMemo(() => {
    return positions.map((position, index) => {
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
              <div className={styles.positionName}>
                {position.name}
              </div>
              <div className={styles.positionDescription}>
                <p>{position.description}</p>
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
    });
  }, [positions, cards, isRevealed, styles]);

  return (
    <ErrorBoundary fallbackUI={<div className="text-red-500">Error loading reading layout</div>}>
      <div className="space-y-8">
        <div data-testid="grid-layout" className={`grid ${getLayoutClass(spreadType)}`}>
          {renderedPositions}
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