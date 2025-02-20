import React from 'react';
import { TarotCard } from '../TarotCard';
import { Card } from '../../types';
import { HelpCircle } from 'lucide-react';

interface Position {
  id: string;
  name: string;
  description: string;
  className: string;
}

interface Props {
  spreadType: string;
  cards: (Card & { position: number; isReversed: boolean })[];
  isRevealed: boolean;
  isCustomSpread?: boolean;
  positions?: Array<{ name: string; description: string }>;
}

// Utility to generate grid classes for custom layouts
const getCustomLayoutClass = (totalPositions: number): string => {
  // For <= 3 cards, use standard 3-column grid
  if (totalPositions <= 3) return 'grid-cols-3';
  
  // For 4 cards, use 2x2 grid
  if (totalPositions === 4) return 'grid-cols-2 grid-rows-2';
  
  // For 5-6 cards, use 3x2 grid
  if (totalPositions <= 6) return 'grid-cols-3 grid-rows-2';
  
  // For 7-9 cards, use 3x3 grid
  if (totalPositions <= 9) return 'grid-cols-3 grid-rows-3';
  
  // For 10+ cards, use 4x3 grid
  return 'grid-cols-4 grid-rows-3';
};

const SPREAD_LAYOUTS: Record<string, Position[]> = {
  'past-present-future': [
    {
      id: 'past',
      name: 'Past',
      description: 'What brought you here',
      className: 'col-span-1'
    },
    {
      id: 'present',
      name: 'Present',
      description: 'Where you are now',
      className: 'col-span-1'
    },
    {
      id: 'future',
      name: 'Future',
      description: 'Where you\'re heading',
      className: 'col-span-1'
    }
  ],
  'celtic-cross': [
    {
      id: 'situation',
      name: 'Present Situation',
      description: 'The current issue',
      className: 'col-start-2 row-start-2'
    },
    {
      id: 'challenge',
      name: 'Challenge',
      description: 'What crosses you',
      className: 'col-start-2 row-start-2 rotate-90'
    },
    {
      id: 'foundation',
      name: 'Foundation',
      description: 'The basis of the situation',
      className: 'col-start-2 row-start-3'
    },
    {
      id: 'past',
      name: 'Recent Past',
      description: 'What\'s behind you',
      className: 'col-start-1 row-start-2'
    },
    {
      id: 'crown',
      name: 'Potential',
      description: 'What crowns you',
      className: 'col-start-2 row-start-1'
    },
    {
      id: 'future',
      name: 'Near Future',
      description: 'What lies ahead',
      className: 'col-start-3 row-start-2'
    },
    {
      id: 'self',
      name: 'Your Influence',
      description: 'How you see yourself',
      className: 'col-start-4 row-start-1'
    },
    {
      id: 'environment',
      name: 'Environment',
      description: 'External influences',
      className: 'col-start-4 row-start-2'
    },
    {
      id: 'hopes',
      name: 'Hopes and Fears',
      description: 'What you really want',
      className: 'col-start-4 row-start-3'
    },
    {
      id: 'outcome',
      name: 'Final Outcome',
      description: 'Where this leads',
      className: 'col-start-4 row-start-4'
    }
  ],
  'im-fine': [
    {
      id: 'surface',
      name: 'Surface Issue',
      description: "What you say is bothering you",
      className: 'col-span-1'
    },
    {
      id: 'real',
      name: 'Real Issue',
      description: "What's actually bothering you",
      className: 'col-span-1'
    },
    {
      id: 'future',
      name: 'Future Drama',
      description: "What you'll bring up later",
      className: 'col-span-1'
    }
  ],
  'just-saying': [
    {
      id: 'facade',
      name: 'Facade',
      description: "What you're pretending not to be mad about",
      className: 'col-start-2 row-start-1'
    },
    {
      id: 'secret',
      name: 'Open Secret',
      description: "What everyone else knows",
      className: 'col-start-1 row-start-2'
    },
    {
      id: 'solution',
      name: 'Ignored Solution',
      description: "The obvious solution",
      className: 'col-start-2 row-start-2'
    },
    {
      id: 'stubborn',
      name: 'Stubbornness',
      description: "Why you'll ignore advice",
      className: 'col-start-3 row-start-2'
    },
    {
      id: 'consequences',
      name: 'Consequences',
      description: "How this will blow up",
      className: 'col-start-2 row-start-3'
    }
  ],
  'whatever': [
    {
      id: 'eyeroll',
      name: 'Eye Roll',
      description: "What you're rolling your eyes about",
      className: 'col-start-1 row-start-1'
    },
    {
      id: 'screenshot',
      name: 'Screenshot',
      description: "For the group chat",
      className: 'col-start-2 row-start-1'
    },
    {
      id: 'concerns',
      name: 'Valid Concerns',
      description: "Poorly communicated concerns",
      className: 'col-start-1 row-start-2'
    },
    {
      id: 'petty',
      name: 'Petty Response',
      description: "Your petty handling",
      className: 'col-start-2 row-start-2'
    }
  ],
  'no-offense': [
    {
      id: 'sugar-coating',
      name: 'Sugar Coating',
      description: "The sugar-coated truth",
      className: 'col-start-2 row-start-1'
    },
    {
      id: 'real-meaning',
      name: 'Real Meaning',
      description: "What you actually mean",
      className: 'col-start-1 row-start-2'
    },
    {
      id: 'compliment',
      name: 'Backhanded Compliment',
      description: "Your backhanded compliment",
      className: 'col-start-2 row-start-2'
    },
    {
      id: 'concern',
      name: 'Concern',
      description: "Their 'obvious' flaw",
      className: 'col-start-3 row-start-2'
    },
    {
      id: 'advice',
      name: 'Advice',
      description: "Unsolicited advice",
      className: 'col-start-1 row-start-3'
    },
    {
      id: 'reaction',
      name: 'Reaction',
      description: "Their inevitable reaction",
      className: 'col-start-2 row-start-3'
    }
  ]
};

export const SpreadLayout: React.FC<Props> = ({
  spreadType,
  cards,
  isRevealed,
  isCustomSpread,
  positions = []
}) => {
  const layout = isCustomSpread 
    ? positions.map((pos, index) => ({
        id: `custom-${index}`,
        name: pos.name,
        description: pos.description,
        className: 'col-span-1' // Default positioning for custom spreads
      }))
    : SPREAD_LAYOUTS[spreadType] || SPREAD_LAYOUTS['past-present-future'];
  
  const gridClass = isCustomSpread 
    ? getCustomLayoutClass(positions.length)
    : spreadType === 'celtic-cross' 
      ? 'grid-cols-4 grid-rows-4' 
      : 'grid-cols-3';

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {layout.map((position, index) => {
        const card = cards[index];
        return (
          <div
            key={position.id}
            className={`relative ${position.className}`}
          >
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
  );
};