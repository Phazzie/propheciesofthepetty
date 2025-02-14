import { render, act } from '@testing-library/react';
import { CardAnimation } from './CardAnimation';

describe('CardAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handles card flip animation', () => {
    const { getByTestId } = render(<CardAnimation isReversed={false} />);
    const card = getByTestId('card-container');
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(card).toHaveClass('flip-complete');
  });
});