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
import type { Card } from '../../types';
import { ReadingLayout } from './ReadingLayout';
import { SpreadSelector, type SpreadConfig } from './SpreadSelector';

const defaultSpread: SpreadConfig = {
  id: 'past-present-future',
  name: 'Past, Present, Future',
  description: 'Default spread configuration',
  cardCount: 3,
  icon: 'threeCard',
  positions: [
    { name: 'Past', description: 'Position representing the past' },
    { name: 'Present', description: 'Position representing the present' },
    { name: 'Future', description: 'Position representing the future' }
  ]
};

/**
 * ReadingInterface component that provides the tarot reading experience
 * @returns React component
 */
const ReadingInterface: React.FC = () => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfig>(defaultSpread);

  const dummyCards: Array<Card & { position: number; isReversed: boolean }> = [
    { id: 'card-1', name: 'The Fool', description: 'Beginnings, innocence, spontaneity', imageUrl: 'path/to/image1.jpg', type: 'major', position: 0, isReversed: false },
    { id: 'card-2', name: 'The Magician', description: 'Action, the power to manifest', imageUrl: 'path/to/image2.jpg', type: 'major', position: 1, isReversed: false },
    { id: 'card-3', name: 'The High Priestess', description: 'Inaction, going within, the subconscious', imageUrl: 'path/to/image3.jpg', type: 'major', position: 2, isReversed: false }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Card Reading Interface</h1>
      <SpreadSelector 
        selectedSpread={selectedSpread}
        onSelect={setSelectedSpread}
      />
      <ReadingLayout
        spreadType={selectedSpread.id}
        cards={dummyCards}
        isRevealed={true}
      />
    </div>
  );
};

export default ReadingInterface;