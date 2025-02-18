/**
 * Main interface for the tarot reading experience
 * @module components/reading/ReadingInterface
 * 
 * @description
 * Manages the complete tarot reading flow including:
 * - Spread selection
 * - Card selection
 * - Reading generation
 * - Result display
 * 
 * @accessibility
 * - All interactive elements are keyboard navigable
 * - ARIA labels for interactive elements
 * - Progress announcements for screen readers
 * - Color contrast meets WCAG standards
 */

import React, { useState } from 'react';
import { SpreadSelector } from './SpreadSelector';
import { ReadingLayout } from './ReadingLayout';
import { CardDeck } from './CardDeck';
import { LoadingSpinner } from '../LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { generateTarotInterpretation } from '../../lib/gemini';
import type { Card, ReadingInterpretation } from '../../types';
import type { SpreadConfig } from './SpreadSelector';

interface Props {
  onComplete?: (reading: ReadingInterpretation) => void;
}

interface SelectedCard extends Card {
  position: number;
  isReversed: boolean;
}

export const ReadingInterface: React.FC<Props> = ({ onComplete }) => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfig | null>(null);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [interpretation, setInterpretation] = useState<ReadingInterpretation | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<SelectedCard[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());

  const handleQuestionSubmit = (question: string) => {
    // Clear any previous error state
    setError(null);
    
    // Reset previous reading if starting new
    setSelectedSpread(null);
    setCards([]);
    setSelectedCardIds(new Set());
    setInterpretation(undefined);
    
    // Store question for reading generation
    localStorage.setItem('current_question', question);
  };

  const handleCardSelect = (card: Card, isReversed: boolean) => {
    if (!selectedSpread) return;
    
    const position = cards.length;
    const extendedCard: SelectedCard = {
      ...card,
      position,
      isReversed
    };

    setCards(prev => [...prev, extendedCard]);
    setSelectedCardIds(prev => new Set([...prev, card.id]));

    // Check if we've selected all cards for the spread
    if (cards.length + 1 === selectedSpread.cardCount) {
      generateReading([...cards, extendedCard], selectedSpread);
    }
  };

  const generateReading = async (selectedCards: SelectedCard[], spread: SpreadConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      const readingInterpretation = await generateTarotInterpretation(
        spread.id,
        selectedCards.map(card => ({
          position: spread.positions[card.position].name,
          name: card.name,
          description: card.description,
          isReversed: card.isReversed
        }))
      );

      setInterpretation(readingInterpretation);
      onComplete?.(readingInterpretation);
    } catch (err) {
      setError('Failed to generate reading');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpreadSelect = (spread: SpreadConfig) => {
    setSelectedSpread(spread);
    setSelectedCards([]);
    setInterpretation(undefined);
  };

  if (error) {
    return (
      <div className="text-red-500 flex items-center gap-2" role="alert">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ReadingLayout
        spreadType={selectedSpread?.id || 'past-present-future'}
        cards={selectedCards}
        interpretation={interpretation}
        onQuestionSubmit={handleQuestionSubmit}
      />

      {!selectedSpread && (
        <SpreadSelector
          onSelect={handleSpreadSelect}
          selectedSpread={selectedSpread}
        />
      )}

      {selectedSpread && !interpretation && (
        <div className="space-y-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
              Select Your Cards
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Choose {selectedSpread.cardCount} cards for your {selectedSpread.name} reading
            </p>
            <CardDeck
              onCardSelect={handleCardSelect}
              selectedCount={cards.length}
              maxCards={selectedSpread.cardCount}
              disallowedCards={selectedCardIds}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <LoadingSpinner size={32} message="Generating your totally unbiased interpretation..." />
        </div>
      )}

      {selectedSpread && cards.length > 0 && (
        <ReadingLayout 
          spreadType={selectedSpread.id}
          cards={cards}
          interpretation={interpretation}
        />
      )}
    </div>
  );
};