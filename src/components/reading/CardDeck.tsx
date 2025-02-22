/** @jsxImportSource react */
import { type FC, useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Loader, Lock } from 'lucide-react';
import { TarotCard } from '../TarotCard';
import { useAuth } from '../../context/AuthContext';
import { useCards } from '../../hooks/useDatabase';
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
  const cards: Card[] = [
    { id: '1', name: 'The Fool', imageUrl: '/cards/fool.jpg', type: 'major', description: 'A new beginning.' },
    { id: '2', name: 'The Magician', imageUrl: '/cards/magician.jpg', type: 'major', description: 'Manifestation.' },
    // Add more cards as needed
  ];

  const handleCardClick = (card: Card) => {
    if (selectedCount >= maxCards || disallowedCards.has(card.id)) return;
    const isReversed = Math.random() > 0.5;
    onCardSelect(card, isReversed);
  };

  return (
    <div className="card-deck grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card ${disallowedCards.has(card.id) ? 'opacity-50' : 'cursor-pointer'}`}
          onClick={() => handleCardClick(card)}
        >
          <img src={card.imageUrl} alt={card.name} className="w-full h-auto" />
          <p className="text-center mt-2">{card.name}</p>
        </div>
      ))}
    </div>
  );
};