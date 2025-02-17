import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReadingLayout } from '../ReadingLayout';
import { ThemeProvider } from '../../../contexts/ThemeContext';

const mockCard = {
  id: 'test-card-1',
  name: 'The Fool',
  description: 'Test description',
  imageUrl: '/images/fool.jpg',
  type: 'major' as const,
  position: 0,
  isReversed: false
};

const renderWithTheme = (props: any) => {
  return render(
    <ThemeProvider>
      <ReadingLayout {...props} />
    </ThemeProvider>
  );
};

describe('ReadingLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders past-present-future spread correctly', () => {
    const cards = Array(3).fill(mockCard).map((card, i) => ({
      ...card,
      id: `test-card-${i}`,
      position: i
    }));

    renderWithTheme({
      spreadType: 'past-present-future',
      cards,
      isRevealed: true
    });

    expect(screen.getByText('Past')).toBeInTheDocument();
    expect(screen.getByText('Present')).toBeInTheDocument();
    expect(screen.getByText('Future')).toBeInTheDocument();
    expect(screen.getAllByText('The Fool')).toHaveLength(3);
  });

  it('renders celtic-cross spread with correct positions', () => {
    const cards = Array(10).fill(mockCard).map((card, i) => ({
      ...card,
      id: `test-card-${i}`,
      position: i
    }));

    renderWithTheme({
      spreadType: 'celtic-cross',
      cards,
      isRevealed: true
    });

    expect(screen.getByText('Present')).toBeInTheDocument();
    expect(screen.getByText('Challenge')).toBeInTheDocument();
    expect(screen.getByText('Foundation')).toBeInTheDocument();
  });

  it('shows empty positions when not enough cards', () => {
    renderWithTheme({
      spreadType: 'past-present-future',
      cards: [mockCard],
      isRevealed: true
    });

    const emptyPositions = screen.getAllByRole('img', {
      name: /empty position/i
    });
    expect(emptyPositions).toHaveLength(2);
  });

  it('handles reversed cards correctly', () => {
    const reversedCard = { ...mockCard, isReversed: true };
    renderWithTheme({
      spreadType: 'past-present-future',
      cards: [reversedCard],
      isRevealed: true
    });

    expect(screen.getByTestId('reversed-card')).toHaveClass('rotate-180');
  });

  it('respects isRevealed prop for card visibility', () => {
    renderWithTheme({
      spreadType: 'past-present-future',
      cards: [mockCard],
      isRevealed: false
    });

    expect(screen.queryByText('The Fool')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-back')).toBeInTheDocument();
  });

  it('applies correct layout classes for different spreads', () => {
    const { container, rerender } = renderWithTheme({
      spreadType: 'celtic-cross',
      cards: Array(10).fill(mockCard),
      isRevealed: true
    });

    expect(container.firstChild).toHaveClass('grid-cols-4');

    rerender(
      <ThemeProvider>
        <ReadingLayout
          spreadType="past-present-future"
          cards={Array(3).fill(mockCard)}
          isRevealed={true}
        />
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveClass('grid-cols-3');
  });
});