/**
 * Test suite for SpreadLayout component
 * @module tests/SpreadLayout
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpreadLayout } from '../SpreadLayout';
import { HelpCircle } from 'lucide-react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  HelpCircle: () => <div data-testid="help-circle-icon" />
}));

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
    const { container } = render(
      <SpreadLayout
        spreadType="past-present-future"
        cards={[
          { ...mockCards[0], position: 0 },
          { ...mockCards[0], position: 1 },
          { ...mockCards[0], position: 2 }
        ]}
        isRevealed={true}
      />
    );

    // Check positions and descriptions
    expect(screen.getByText('Past')).toBeInTheDocument();
    expect(screen.getByText('Present')).toBeInTheDocument();
    expect(screen.getByText('Future')).toBeInTheDocument();
    expect(screen.getAllByText('The Fool')).toHaveLength(3);
    expect(container.firstChild).toHaveClass('grid-cols-3');
  });

  it('handles celtic cross spread layout', () => {
    const { container } = render(
      <SpreadLayout
        spreadType="celtic-cross"
        cards={Array(10).fill(mockCards[0])}
        isRevealed={true}
      />
    );

    expect(screen.getByText('Present Situation')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('grid-cols-4');
  });

  it('shows placeholder for empty positions', () => {
    render(
      <SpreadLayout
        spreadType="past-present-future"
        cards={[]}
        isRevealed={true}
      />
    );

    // Check for empty position placeholders
    const placeholders = screen.getAllByTestId('help-circle-icon');
    expect(placeholders).toHaveLength(3);

    // Verify accessibility
    const emptyPositions = screen.getAllByRole('img', { 
      name: (name) => name.toLowerCase().includes('empty position')
    });
    expect(emptyPositions).toHaveLength(3);

    // Check position descriptions are still shown
    expect(screen.getByText(/what brought you here/i)).toBeInTheDocument();
    expect(screen.getByText(/where you are now/i)).toBeInTheDocument();
    expect(screen.getByText(/where this leads/i)).toBeInTheDocument();
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
    expect(screen.getByText('(Reversed)')).toBeInTheDocument();
  });

  it('maintains correct grid layout for different spreads', () => {
    const { rerender, container } = render(
      <SpreadLayout
        spreadType="celtic-cross"
        cards={Array(10).fill(mockCards[0])}
        isRevealed={true}
      />
    );

    expect(container.firstChild).toHaveClass('grid-cols-4');

    rerender(
      <SpreadLayout
        spreadType="past-present-future"
        cards={Array(3).fill(mockCards[0])}
        isRevealed={true}
      />
    );

    expect(container.firstChild).toHaveClass('grid-cols-3');
  });
});