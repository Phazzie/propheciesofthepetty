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

describe('ReadingLayout with Custom Spreads', () => {
  it('renders custom spread with correct positions', () => {
    const customPositions = [
      { name: 'Custom 1', description: 'First custom position' },
      { name: 'Custom 2', description: 'Second custom position' },
      { name: 'Custom 3', description: 'Third custom position' }
    ];

    const cards = Array(3).fill(mockCard).map((card, i) => ({
      ...card,
      position: i
    }));

    renderWithTheme({
      spreadType: 'custom-123',
      cards,
      isRevealed: true,
      isCustomSpread: true,
      customPositions
    });

    // Verify all custom position names and descriptions are displayed
    customPositions.forEach(pos => {
      expect(screen.getByText(pos.name)).toBeInTheDocument();
      expect(screen.getByText(pos.description)).toBeInTheDocument();
    });
  });

  it('applies correct grid layout for different custom spread sizes', () => {
    const twoPositions = [
      { name: 'Pos 1', description: 'Desc 1' },
      { name: 'Pos 2', description: 'Desc 2' }
    ];

    const fourPositions = Array(4).fill(null).map((_, i) => ({
      name: `Pos ${i + 1}`,
      description: `Desc ${i + 1}`
    }));

    const sixPositions = Array(6).fill(null).map((_, i) => ({
      name: `Pos ${i + 1}`,
      description: `Desc ${i + 1}`
    }));

    // Test 2-position layout
    const { rerender, container } = renderWithTheme({
      spreadType: 'custom-123',
      cards: Array(2).fill(mockCard),
      isRevealed: true,
      isCustomSpread: true,
      customPositions: twoPositions
    });

    expect(container.firstChild).toHaveClass('grid-cols-3');

    // Test 4-position layout
    rerender(
      <ThemeProvider>
        <ReadingLayout
          spreadType="custom-123"
          cards={Array(4).fill(mockCard)}
          isRevealed={true}
          isCustomSpread={true}
          customPositions={fourPositions}
        />
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveClass('grid-cols-2');

    // Test 6-position layout
    rerender(
      <ThemeProvider>
        <ReadingLayout
          spreadType="custom-123"
          cards={Array(6).fill(mockCard)}
          isRevealed={true}
          isCustomSpread={true}
          customPositions={sixPositions}
        />
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveClass('grid-cols-3');
  });

  it('shows empty positions for incomplete custom spread', () => {
    const customPositions = Array(4).fill(null).map((_, i) => ({
      name: `Position ${i + 1}`,
      description: `Description ${i + 1}`
    }));

    renderWithTheme({
      spreadType: 'custom-123',
      cards: [mockCard], // Only one card for a 4-position spread
      isRevealed: true,
      isCustomSpread: true,
      customPositions
    });

    expect(screen.getAllByRole('img', { name: /empty position/i })).toHaveLength(3);
  });

  it('maintains card reversals in custom spreads', () => {
    const customPositions = [
      { name: 'Custom 1', description: 'First position' },
      { name: 'Custom 2', description: 'Second position' }
    ];

    const reversedCard = { ...mockCard, isReversed: true };

    renderWithTheme({
      spreadType: 'custom-123',
      cards: [reversedCard],
      isRevealed: true,
      isCustomSpread: true,
      customPositions
    });

    expect(screen.getByTestId('reversed-card')).toHaveClass('rotate-180');
  });
});