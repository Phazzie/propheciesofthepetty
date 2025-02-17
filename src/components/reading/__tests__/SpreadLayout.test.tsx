/**
 * Test suite for SpreadLayout component
 * @module tests/SpreadLayout
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpreadLayout } from '../SpreadLayout';

const mockCards = [
  {
    id: '1',
    name: 'The Fool',
    description: 'Test description',
    imageUrl: 'test.jpg',
    position: 0,
    isReversed: false,
    type: 'major' as const
  }
];

describe('SpreadLayout', () => {
  it('renders past-present-future spread correctly', () => {
    render(
      <SpreadLayout
        spreadType="past-present-future"
        cards={[mockCards[0], mockCards[0], mockCards[0]]}
        isRevealed={true}
      />
    );

    expect(screen.getByText('Past')).toBeInTheDocument();
    expect(screen.getByText('Present')).toBeInTheDocument();
    expect(screen.getByText('Future')).toBeInTheDocument();
  });

  it('handles celtic cross spread layout', () => {
    render(
      <SpreadLayout
        spreadType="celtic-cross"
        cards={Array(10).fill(mockCards[0])}
        isRevealed={true}
      />
    );

    expect(screen.getByText('Present Situation')).toBeInTheDocument();
  });

  it('shows placeholder for empty positions', () => {
    render(
      <SpreadLayout
        spreadType="past-present-future"
        cards={[]}
        isRevealed={true}
      />
    );

    const placeholders = screen.getAllByRole('img', { 
      name: (name) => name.toLowerCase().includes('empty position')
    });
    expect(placeholders).toHaveLength(3);
  });

  it('displays reversed cards correctly', () => {
    const reversedCard = { ...mockCards[0], isReversed: true };
    
    render(
      <SpreadLayout
        spreadType="past-present-future"
        cards={[reversedCard]}
        isRevealed={true}
      />
    );

    expect(screen.getByTestId('reversed-card')).toBeInTheDocument();
  });
});