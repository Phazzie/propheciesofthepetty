import type { Card, SpreadConfig, SpreadType, ReadingInterpretation } from '../types';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import type { ReactElement } from 'react';
import React from 'react';

export interface TestContext {
  userId: string;
  sessionToken?: string;
}

export const createMockInterpretation = (): ReadingInterpretation => ({
  text: "Your passive-aggressive reading reveals hidden tensions in your situation. While you might think everything is fine on the surface, the cards suggest otherwise. Perhaps if you'd been paying more attention earlier, you wouldn't be in this position now. Just a thought."
});

export const createMockSpread = (type: SpreadType = 'past-present-future'): SpreadConfig => ({
  id: type,
  name: type === 'past-present-future' ? 'Past, Present, Future' : 'Test Spread',
  description: 'A test spread for validation',
  cardCount: type === 'celtic-cross' ? 10 : 3,
  icon: type === 'celtic-cross' ? 'celticCross' : 'threeCard',
  positions: type === 'celtic-cross' 
    ? Array(10).fill(0).map((_, i) => ({
        name: `Position ${i + 1}`,
        description: `Test position ${i + 1}`
      }))
    : [
        { name: 'Past', description: 'Test past position' },
        { name: 'Present', description: 'Test present position' },
        { name: 'Future', description: 'Test future position' }
      ]
});

export const createMockCard = (position: number = 0): Card & { position: number; isReversed: boolean } => ({
  id: `test-card-${position}`,
  name: `Test Card ${position}`,
  description: `Test description ${position}`,
  imageUrl: 'test.jpg',
  type: 'major',
  position,
  isReversed: false
});

export const renderWithTheme = (ui: ReactElement) => {
  return render(
    <ThemeProvider theme={{}}>
      {ui}
    </ThemeProvider>
  );
};

export const createMockReadingProps = (type: SpreadType = 'past-present-future', cardCount: number = 3) => ({
  spreadType: type,
  cards: Array(cardCount).fill(0).map((_, i) => createMockCard(i)),
  interpretation: createMockInterpretation(),
  isRevealed: true,
  isCustomSpread: false
});