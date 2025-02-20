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

import { useState } from 'react';
import { SpreadSelector, type SpreadConfig } from './SpreadSelector';
import { ReadingLayout } from './ReadingLayout';
import { CardDeck } from './CardDeck';
import { LoadingSpinner } from '../LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { generateTarotInterpretation } from '../../lib/gemini';
import type { Card } from '../../types';

interface Props {
  onComplete?: () => void;
}

interface ExtendedCard extends Card {
  position: number;
  isReversed: boolean;
}

export default function ReadingInterface({ onComplete }: Props) {
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<ExtendedCard[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());
  const [interpretation, setInterpretation] = useState<any>(null);
  const [userInput, setUserInput] = useState('');

  const handleCardSelect = (card: Card, isReversed: boolean) => {
    if (!selectedSpread) return;
    
    const position = cards.length;
    const extendedCard: ExtendedCard = {
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

  const generateReading = async (selectedCards: ExtendedCard[], spread: SpreadConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      const readingInterpretation = await generateTarotInterpretation(
        spread.id,
        selectedCards.map(card => ({
          id: card.id,
          imageUrl: card.imageUrl,
          type: card.type,
          position: spread.positions[card.position],
          name: card.name,
          description: card.description,
          isReversed: card.isReversed
        }))
      );

      setInterpretation(readingInterpretation);
      onComplete?.();
    } catch (err) {
      setError('Failed to generate reading');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpreadSelect = (spread: SpreadConfig) => {
    setSelectedSpread(spread);
    setCards([]);
    setSelectedCardIds(new Set());
    setInterpretation(null);
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
      <SpreadSelector
        selectedSpread={selectedSpread}
        onSelect={handleSpreadSelect}
      />

      {selectedSpread && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
            Describe Your Problem or Question
          </h3>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter your problem or question here..."
          />
        </div>
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
          isRevealed={!!interpretation}
          isCustomSpread={selectedSpread.isCustom}
          customPositions={selectedSpread.isCustom ? selectedSpread.positions : undefined}
        />
      )}
    </div>
  );
}