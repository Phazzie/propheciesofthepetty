export interface SpreadLayoutProps {
  spreadType: string;
  cards: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    type: 'major' | 'minor';
    position: number;
    isReversed: boolean;
  }>;
  isRevealed: boolean;
  customPositions?: ReadingPosition[];
}

export interface ReadingPosition {
  id: string;
  name: string;
  description: string;
  className: string;
}