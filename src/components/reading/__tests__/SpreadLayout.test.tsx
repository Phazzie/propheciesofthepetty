/**
 * Test suite for SpreadLayout component
 * @module tests/SpreadLayout
 */

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
        cards={mockCards}
        isRevealed={true}
      />
    );

    expect(screen.getByText(/past/i)).toBeInTheDocument();
    expect(screen.getByText(/present/i)).toBeInTheDocument();
    expect(screen.getByText(/future/i)).toBeInTheDocument();
  });

  it('handles celtic cross spread layout', () => {
    render(
      <SpreadLayout
        spreadType="celtic-cross"
        cards={mockCards}
        isRevealed={true}
      />
    );

    expect(screen.getByText(/present situation/i)).toBeInTheDocument();
  });

  it('shows placeholder for empty positions', () => {
    render(
      <SpreadLayout
        spreadType="past-present-future"
        cards={[]}
        isRevealed={true}
      />
    );

    const placeholders = screen.getAllByRole('generic', { name: /empty position/i });
    expect(placeholders).toHaveLength(3);
  });

  it('displays reversed cards correctly', () => {
    const reversedCards = [{ ...mockCards[0], isReversed: true }];
    
    render(
      <SpreadLayout
        spreadType="past-present-future"
        cards={reversedCards}
        isRevealed={true}
      />
    );

    expect(screen.getByTestId('reversed-card')).toBeInTheDocument();
  });
});