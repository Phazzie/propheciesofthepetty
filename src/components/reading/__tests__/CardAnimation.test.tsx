import { render, act } from '@testing-library/react';
import { CardAnimation } from '../../reading/CardAnimation';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CardAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles card flip animation', () => {
    const { getByTestId, rerender } = render(<CardAnimation isReversed={false} />);
    const card = getByTestId('card-container');
    
    rerender(<CardAnimation isReversed={true} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(card).toHaveClass('flip-complete');
  });
});