/** @jsxImportSource react */
import React, { useMemo, useState, useCallback, memo } from 'react';
import { Layout, CopyX, Star, Info, MessageCircle, ThumbsUp, XSquare, Coffee, Plus } from 'lucide-react';
import { CustomSpreadBuilder } from './CustomSpreadBuilder';
import { SkeletonLoader } from '../SkeletonLoader';

export type SpreadType = 'classic' | 'celtic-cross' | 'star-guide' | 'im-fine' | 'just-saying' | 'whatever' | 'no-offense' | `custom-${number}`;

export interface SpreadConfig {
  id: SpreadType;
  name: string;
  description: string;
  cardCount: number;
  icon: keyof typeof spreadIcons;
  positions: Array<{
    name: string;
    description: string;
  }>;
  isCustom?: boolean;
}

const spreadIcons = {
  threeCard: Layout,
  celticCross: CopyX,
  starGuide: Star,
  imFine: MessageCircle,
  justSaying: ThumbsUp,
  whatever: XSquare,
  noOffense: Coffee,
  custom: Plus
} as const;

export const SPREADS: SpreadConfig[] = [
  {
    id: 'classic',
    name: 'Past, Present, Future',
    description: "A simple spread exploring your journey through time with the signature passive-aggressive twist.",
    cardCount: 3,
    icon: 'threeCard',
    positions: [
      { name: 'Past', description: "What brought you here (like it or not)" },
      { name: 'Present', description: "Where you are now (obviously)" },
      { name: 'Future', description: "Where you're heading (brace yourself)" }
    ]
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    description: "A comprehensive spread for deep insights and cosmic judgment, because one perspective isn't enough to judge you.",
    cardCount: 10,
    icon: 'celticCross',
    positions: [
      { name: 'Present', description: "The current situation (that you got yourself into)" },
      { name: 'Challenge', description: "What's blocking you (besides yourself)" },
      { name: 'Foundation', description: "Your foundation (or lack thereof)" },
      { name: 'Recent Past', description: "What brought you here (like it or not)" },
      { name: 'Higher Self', description: "Your aspirations (however unrealistic)" },
      { name: 'Near Future', description: "What's coming (whether you're ready or not)" },
      { name: 'Current Attitude', description: "How you're handling this (debatable)" },
      { name: 'External Factor', description: "Outside influences (that you'll blame anyway)" },
      { name: 'Hopes/Fears', description: "Your anxieties (totally justified this time)" },
      { name: 'Final Outcome', description: "Where this leads (no pressure)" }
    ]
  },
  {
    id: 'star-guide',
    name: "Star Guide",
    description: "A celestial spread for when you need guidance with an extra side of sass.",
    cardCount: 5,
    icon: 'starGuide',
    positions: [
      { name: 'Core Issue', description: "What's actually bothering you (not what you say is)" },
      { name: 'Hidden Factor', description: "The thing you're conveniently ignoring" },
      { name: 'Divine Guidance', description: "The obvious advice you'll probably ignore" },
      { name: 'Challenge', description: "Your biggest obstacle (spoiler: it's you)" },
      { name: 'Potential', description: "Where this could go (if you actually listen)" }
    ]
  },
  {
    id: 'im-fine',
    name: "I'm Fine",
    description: "A spread that reveals what's really bothering you, because we both know you're not actually 'fine'.",
    cardCount: 3,
    icon: 'imFine',
    positions: [
      { name: 'Surface Issue', description: "What you say is bothering you (but isn't)" },
      { name: 'Real Issue', description: "What's actually bothering you (obviously)" },
      { name: 'Future Drama', description: "What you'll bring up in your next argument" }
    ]
  },
  {
    id: 'just-saying',
    name: "Just Saying",
    description: "A five-card spread for when you're 'just putting it out there', not that anyone asked.",
    cardCount: 5,
    icon: 'justSaying',
    positions: [
      { name: 'Facade', description: "What you're pretending not to be mad about" },
      { name: 'Open Secret', description: "What everyone else already knows" },
      { name: 'Ignored Solution', description: "The obvious solution you're ignoring" },
      { name: 'Stubbornness', description: "Why you'll ignore good advice" },
      { name: 'Consequences', description: "How this will inevitably blow up later" }
    ]
  },
  {
    id: 'whatever',
    name: "Whatever",
    description: "A four-card spread for when you're totally over it (but not really).",
    cardCount: 4,
    icon: 'whatever',
    positions: [
      { name: 'Eye Roll', description: "What you're rolling your eyes about" },
      { name: 'Screenshot', description: "The thing you'll screenshot and send to your group chat" },
      { name: 'Valid Concerns', description: "Your perfectly valid but poorly communicated concerns" },
      { name: 'Petty Response', description: "The petty way you'll handle this" }
    ]
  },
  {
    id: 'no-offense',
    name: "No Offense But...",
    description: "A six-card spread for when you're 'just trying to help' with your unsolicited advice.",
    cardCount: 6,
    icon: 'noOffense',
    positions: [
      { name: 'Sugar Coating', description: "The truth you're sugar-coating" },
      { name: 'Real Meaning', description: "What you actually mean" },
      { name: 'Backhanded Compliment', description: "Your backhanded compliment" },
      { name: 'Concern', description: "Their obvious flaw you're 'concerned' about" },
      { name: 'Advice', description: "Your unsolicited advice" },
      { name: 'Reaction', description: "Why they'll be mad even though you're 'just trying to help'" }
    ]
  }
];

// Memoize individual spread items
const SpreadItem = memo<{
  spread: SpreadConfig;
  isSelected: boolean;
  onSelect: (spread: SpreadConfig) => void;
}>(({ spread, isSelected, onSelect }) => {
  const Icon = spread.isCustom ? spreadIcons.custom : spreadIcons[spread.icon];
  
  const handleClick = useCallback(() => {
    onSelect(spread);
  }, [spread, onSelect]);

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`
          w-full p-6 rounded-lg transition-all duration-300
          ${isSelected 
            ? 'bg-purple-600 text-white shadow-lg scale-105 ring-2 ring-purple-300' 
            : 'bg-white hover:bg-purple-50 text-gray-800 shadow-md hover:scale-102'
          }
        `}
        aria-selected={isSelected}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={isSelected ? 'text-white' : 'text-purple-600'}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">
            {spread.cardCount} cards
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{spread.name}</h3>
        <p className={`text-sm ${
          isSelected ? 'text-purple-100' : 'text-gray-600'
        }`} data-testid="spread-description">
          {spread.description}
        </p>
      </button>

      {isSelected && (
        <div className="mt-4 bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium text-purple-900">Card Positions</h4>
          </div>
          <ul className="space-y-2">
            {spread.positions.map((position, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium text-purple-900">{position.name}:</span>
                <span className="text-gray-600 ml-1">{position.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

SpreadItem.displayName = 'SpreadItem';

interface Props {
  onSelect: (spread: SpreadConfig) => void;
  selectedSpread: SpreadConfig | null;
  isLoading?: boolean;
}

export const SpreadSelector: React.FC<Props> = ({ onSelect, selectedSpread, isLoading }) => {
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customSpreads, setCustomSpreads] = useState<SpreadConfig[]>([]);

  const handleCustomSpreadSave = useCallback((newSpread: SpreadConfig) => {
    setCustomSpreads(prev => [...prev, newSpread]);
    setShowCustomBuilder(false);
    onSelect(newSpread);
  }, [onSelect]);

  const allSpreads = useMemo(() => [...SPREADS, ...customSpreads], [customSpreads]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <SkeletonLoader width={200} height={32} className="mx-auto mb-2" />
          <SkeletonLoader width={300} height={24} className="mx-auto" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <SkeletonLoader 
              key={i}
              variant="rectangular"
              height={240}
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (showCustomBuilder) {
    return (
      <CustomSpreadBuilder
        onSave={handleCustomSpreadSave}
        onCancel={() => setShowCustomBuilder(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-900 mb-2">
          Now, Choose Your Spread
        </h2>
        <p className="text-gray-600">
          Pick a spread that matches your energy (we can feel it from here)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allSpreads.map((spread) => (
          <SpreadItem
            key={spread.id}
            spread={spread}
            isSelected={selectedSpread?.id === spread.id}
            onSelect={onSelect}
          />
        ))}

        <button
          onClick={() => setShowCustomBuilder(true)}
          className="w-full p-6 rounded-lg border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center text-purple-600 hover:text-purple-700"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-lg font-medium">Create Custom Spread</span>
        </button>
      </div>
    </div>
  );
};