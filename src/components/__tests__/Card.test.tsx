import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TarotCard } from '../TarotCard';
import type { Card } from '../../types';
import '@testing-library/jest-dom';

describe('TarotCard', () => {
  const mockCard: Card = {
    id: 'tower',
    name: 'The Tower',
    description: 'Sudden change incoming. Maybe this time you\'ll actually learn from it.',
    imageUrl: '/cards/tower.jpg',
    type: 'major' as const,
    position: {
      name: 'Present',
      description: 'Current situation (as if you don\'t know)'
    },
    isReversed: false
  };

  it('renders card with correct content', () => {
    render(<TarotCard card={mockCard} isRevealed={true} onClick={() => {}} />);
    expect(screen.getByText('The Tower')).toBeInTheDocument();
    expect(screen.getByAltText('The Tower')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<TarotCard card={mockCard} isRevealed={false} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows back face when not revealed', () => {
    render(<TarotCard card={mockCard} isRevealed={false} onClick={() => {}} />);
    expect(screen.queryByText('The Tower')).not.toBeInTheDocument();
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('applies reversed class when card is reversed', () => {
    render(<TarotCard card={mockCard} isRevealed={true} isReversed={true} onClick={() => {}} />);
    expect(screen.getByText('Reversed')).toBeInTheDocument();
    expect(screen.getByTestId('reversed-card')).toBeInTheDocument();
  });

  it('disables click when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<TarotCard card={mockCard} isRevealed={false} onClick={handleClick} disabled={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveClass('opacity-50');
  });
});