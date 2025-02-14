import { type FC } from 'react';
import { Card } from '../types';

interface TarotCardProps {
  card: Card;
  isRevealed?: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const TarotCard: FC<TarotCardProps> = ({ 
  card, 
  isRevealed = false, 
  isReversed = false,
  onClick,
  disabled = false 
}) => {
  return (
    <div 
      onClick={!disabled && onClick ? onClick : undefined}
      className={`
        relative aspect-[2/3] rounded-lg overflow-hidden
        transform-gpu perspective-1000
        transition-all duration-700 ease-in-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer' : ''}
        ${isRevealed ? 'transform-none' : 'hover:scale-105'}
      `}
      role={onClick ? 'button' : 'img'}
      aria-label={`${card.name} card ${isReversed ? 'reversed' : 'upright'}`}
      aria-pressed={isRevealed}
      tabIndex={onClick ? 0 : -1}
      data-testid={isReversed ? 'reversed-card' : 'upright-card'}
    >
      <div 
        className={`
          w-full h-full 
          transition-all duration-700 ease-in-out
          transform-gpu backface-visibility-hidden
          ${isRevealed ? 'rotate-y-0' : 'rotate-y-180'}
          ${isReversed ? 'rotate-180' : ''}
        `}
      >
        {isRevealed ? (
          <div className="w-full h-full bg-white rounded-lg shadow-lg">
            <div className="relative w-full h-full">
              <img
                src={card.imageUrl}
                alt={card.name}
                className={`
                  w-full h-full object-cover rounded
                  transition-transform duration-700
                `}
              />
              {isReversed && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full transform rotate-180">
                  Reversed
                </div>
              )}
              <div className={`
                absolute inset-0 bg-black bg-opacity-50 
                flex items-center justify-center p-4 
                opacity-0 hover:opacity-100 transition-opacity duration-300
                ${isReversed ? 'rotate-180' : ''}
              `}>
                <div className="text-white text-center">
                  <h3 className="text-lg font-bold mb-1">{card.name}</h3>
                  {card.monsterPair && (
                    <p className="text-sm text-purple-300 mb-2">
                      {card.monsterPair.name}
                    </p>
                  )}
                  <p className="text-sm">
                    {isReversed && card.reversedDescription 
                      ? card.reversedDescription 
                      : card.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-700 to-purple-500 rounded-lg shadow-lg">
            <div className="w-full h-full bg-opacity-20 bg-white rounded-lg p-4">
              <div className="w-full h-full border-2 border-white border-opacity-50 rounded flex items-center justify-center">
                <div className="text-white text-3xl font-tarot opacity-75">★</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};