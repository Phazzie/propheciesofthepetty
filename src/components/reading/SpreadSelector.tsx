/** @jsxImportSource react */
import { type FC } from 'react';
import { Layout, CopyX, Star, Info, MessageCircle, ThumbsUp, XSquare, Coffee } from 'lucide-react';

export type SpreadType = 'past-present-future' | 'celtic-cross' | 'im-fine' | 'just-saying' | 'whatever' | 'no-offense';

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
}

const spreadIcons = {
  threeCard: Layout,
  celticCross: CopyX,
  starSpread: Star,
  imFine: MessageCircle,
  justSaying: ThumbsUp,
  whatever: XSquare,
  noOffense: Coffee
} as const;

const SPREADS: SpreadConfig[] = [
  {
    id: 'past-present-future',
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
    description: "A comprehensive look at your situation from all angles, because one perspective isn't enough to judge you.",
    cardCount: 10,
    icon: 'celticCross',
    positions: [
      { name: 'Present', description: "The current situation (that you got yourself into)" },
      { name: 'Challenge', description: "What's blocking you (besides yourself)" },
      { name: 'Past', description: "Recent events (that you should have handled better)" },
      { name: 'Future', description: "What's coming (whether you're ready or not)" },
      { name: 'Above', description: "Your aspirations (however unrealistic)" },
      { name: 'Below', description: "Your foundation (or lack thereof)" },
      { name: 'Advice', description: "What you should do (but probably won't)" },
      { name: 'External', description: "Outside influences (that you'll blame anyway)" },
      { name: 'Hopes/Fears', description: "Your anxieties (totally justified this time)" },
      { name: 'Outcome', description: "The final result (no pressure)" }
    ]
  },
  {
    id: 'star-spread',
    name: 'Star Spread',
    description: "A star-shaped spread for insight and guidance, because you need all the help you can get.",
    cardCount: 7,
    icon: 'starSpread',
    positions: [
      { name: 'Center', description: "Your core issue (the real one)" },
      { name: 'Above', description: "Higher guidance (if you'll listen)" },
      { name: 'Below', description: "Hidden factors (that you're ignoring)" },
      { name: 'Left', description: "Past influence (your baggage)" },
      { name: 'Right', description: "Future potential (don't mess it up)" },
      { name: 'Rising', description: "Growing influence (incoming drama)" },
      { name: 'Falling', description: "Fading influence (finally letting go)" }
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

interface Props {
  onSelect: (spread: SpreadConfig) => void;
  selectedSpread: SpreadConfig | null;
}

export const SpreadSelector: FC<Props> = ({ onSelect, selectedSpread }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-900 mb-2">
          Choose Your Spread
        </h2>
        <p className="text-gray-600">
          Select a spread type to begin your totally unbiased reading
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SPREADS.map((spread) => {
          const Icon = spreadIcons[spread.icon];
          const isSelected = selectedSpread?.id === spread.id;
          
          return (
            <div key={spread.id} className="relative group">
              <button
                onClick={() => onSelect(spread)}
                className={`
                  w-full p-6 rounded-lg transition-all duration-300
                  ${isSelected 
                    ? 'bg-purple-600 text-white shadow-lg scale-105 ring-2 ring-purple-300' 
                    : 'bg-white hover:bg-purple-50 text-gray-800 shadow-md hover:scale-102'
                  }
                `}
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
                }`}>
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
        })}
      </div>
    </div>
  );
};