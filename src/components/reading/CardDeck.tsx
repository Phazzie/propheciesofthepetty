/** @jsxImportSource react */
import { type FC, useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Loader, Lock } from 'lucide-react';
import { TarotCard } from '../TarotCard';
import { useAuth } from '../../context/AuthContext';
import { useCards } from '../../hooks/useDatabase';
import PredictiveScoring from './PredictiveScoring';
import type { Card } from '../../types';

interface CardDeckProps {
  onCardSelect: (card: Card, isReversed: boolean) => void;
  selectedCount: number;
  maxCards: number;
  disallowedCards?: Set<string>;
}

export const CardDeck: FC<CardDeckProps> = ({ 
  onCardSelect, 
  selectedCount, 
  maxCards,
  disallowedCards = new Set()
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const { getCards, loading, error } = useCards();
  const { user } = useAuth();

  useEffect(() => {
    const loadCards = async () => {
      try {
        const fetchedCards = await getCards();
        setCards(fetchedCards);
      } catch (err) {
        console.error('Failed to load cards:', err);
      }
    };

    loadCards();
  }, [getCards]);

  const handleCardClick = (card: Card) => {
    if (selectedCards.has(card.id) || selectedCount >= maxCards || disallowedCards.has(card.id)) {
      return;
    }

    // 40% chance of card being reversed
    const isReversed = Math.random() < 0.4;
    
    setSelectedCards(new Set([...selectedCards, card.id]));
    onCardSelect(card, isReversed);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>Failed to load cards. Please try again later.</p>
      </div>
    );
  }

  const isCardLocked = (card: Card) => {
    if (!user) return true;
    if (card.type === 'major') return false;
    return user.subscriptionType === 'free';
  };

  return (
    <div className="space-y-6">
      <PredictiveScoring 
        selectedCards={selectedCards}
        maxCards={maxCards}
        isPredictingScore={true}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isLocked = isCardLocked(card);
          const isSelected = selectedCards.has(card.id);
          const isDisabled = isSelected || selectedCount >= maxCards || disallowedCards.has(card.id);
          
          return (
            <div key={card.id} className="relative group">
              <TarotCard
                card={card}
                isRevealed={isSelected}
                onClick={!isLocked ? () => handleCardClick(card) : undefined}
                disabled={isDisabled || isLocked}
              />
              
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-white mb-2 mx-auto" />
                    <p className="text-white text-sm font-medium px-4">
                      Unlock with Premium
                    </p>
                  </div>
                </div>
              )}
              
              {!isLocked && !isSelected && selectedCount < maxCards && (
                <div className="absolute inset-0 bg-purple-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
              )}
            </div>
          );
        })}
      </div>

      {user?.subscriptionType === 'free' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
            <p className="text-sm text-purple-900">
              Upgrade to Premium to unlock the full deck and advanced features
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
            Upgrade Now
          </button>
        </div>
      )}

      <div className="text-center text-sm text-gray-600">
        {selectedCount === maxCards ? (
          <p>Maximum cards selected ({maxCards})</p>
        ) : (
          <p>Select {maxCards - selectedCount} more card{maxCards - selectedCount !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
};