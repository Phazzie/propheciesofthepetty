import type { Card, SpreadConfig, SpreadType, ReadingInterpretation, ReadingScore } from '../types';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import type { ReactElement } from 'react';

export interface TestContext {
  userId: string;
  sessionToken?: string;
}

// Default test shade index scores matching Level 7+ requirement
const DEFAULT_SHADE_INDEX = {
  plausibleDeniability: 75,
  guiltTripIntensity: 72,
  emotionalManipulation: 70,
  backhandedCompliments: 75,
  strategicVagueness: 70
};

// Default test scores meeting minimum 8/10 requirements
const DEFAULT_CORE_METRICS = {
  subtlety: 85,
  relatability: 85,
  wisdom: 85,
  creative: 85,
  humor: 85,
  snark: 75,
  culturalResonance: 70,
  metaphorMastery: 70
};

export const createMockInterpretation = (overrides: Partial<ReadingScore> = {}): ReadingInterpretation => ({
  text: "Your passive-aggressive reading...",
  scores: {
    ...DEFAULT_CORE_METRICS,
    shadeIndex: {
      ...DEFAULT_SHADE_INDEX,
      ...(overrides.shadeIndex || {})
    },
    ...overrides
  }
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
    <ThemeProvider>
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