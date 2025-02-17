import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Card } from '../../types';

interface CardAnimationProps {
  isReversed: boolean;
  card: Card;
  isRevealed: boolean;
}

export const CardAnimation: React.FC<CardAnimationProps> = ({ isReversed, card, isRevealed }) => {
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    setIsFlipping(true);
    const timer = setTimeout(() => {
      setIsFlipping(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [isReversed, isRevealed]);

  return (
    <div
      data-testid="card-container"
      className="relative w-full h-full"
    >
      <AnimatePresence>
        <motion.div
          className={`
            absolute inset-0 rounded-lg overflow-hidden
            transform-gpu perspective-1000
            ${isFlipping ? 'flip-in-progress' : ''}
            ${isReversed ? 'rotate-180' : ''}
          `}
          initial={{ rotateY: isRevealed ? 0 : 180 }}
          animate={{ rotateY: isRevealed ? 180 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Front of card (face down) */}
          <div className={`absolute inset-0 ${isRevealed ? 'hidden' : ''}`}>
            <div className="w-full h-full bg-gradient-to-br from-purple-700 to-purple-500 rounded-lg shadow-lg">
              <div className="w-full h-full bg-opacity-20 bg-white rounded-lg p-4">
                <div className="w-full h-full border-2 border-white border-opacity-50 rounded flex items-center justify-center">
                  <span className="text-white text-3xl font-tarot opacity-75">★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back of card (face up) */}
          <div className={`absolute inset-0 ${!isRevealed ? 'hidden' : ''}`}>
            <div className="w-full h-full bg-white rounded-lg shadow-lg p-4">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-bold text-purple-900 text-center mb-2">{card.name}</h3>
                {card.imageUrl && (
                  <div className="flex-1 relative mb-2">
                    <img 
                      src={card.imageUrl} 
                      alt={card.name}
                      className="absolute inset-0 w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <p className="line-clamp-3">
                    {isReversed && card.reversedDescription ? card.reversedDescription : card.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};