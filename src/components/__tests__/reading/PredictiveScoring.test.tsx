import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PredictiveScoring from '../../reading/PredictiveScoring';
import type { Card } from '../../../types';

describe('PredictiveScoring', () => {
  const mockCards: Card[] = [
    {
      id: 'tower',
      name: 'The Tower',
      description: 'Maybe this time you\'ll actually learn from the sudden change.',
      reversedDescription: 'Avoiding necessary destruction? How\'s that working out?',
      imageUrl: '/cards/tower.jpg',
      type: 'major'
    },
    {
      id: 'judgement',
      name: 'Judgement',
      description: 'Perhaps it\'s time for some self-reflection, though we both know how that usually goes.',
      reversedDescription: 'Interesting how you keep avoiding this conversation.',
      imageUrl: '/cards/judgement.jpg',
      type: 'major'
    },
    {
      id: 'hermit',
      name: 'The Hermit',
      description: 'But perhaps there is more to consider...',
      reversedDescription: 'Actually, the situation demands reflection.',
      imageUrl: '/cards/hermit.jpg',
      type: 'major'
    }
  ];

  it('displays card selection progress', () => {
    render(<PredictiveScoring selectedCards={mockCards.slice(0, 2)} maxCards={5} />);
    
    expect(screen.getByText('Card Selection Progress')).toBeInTheDocument();
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });

  it('shows predictive scoring when enabled', () => {
    render(
      <PredictiveScoring 
        selectedCards={mockCards.slice(0, 2)} 
        maxCards={5} 
        isPredictingScore={true} 
      />
    );
    
    expect(screen.getByText(/Potential Shade Level™/)).toBeInTheDocument();
  });

  it('warns about minimum level requirement when below 7', () => {
    render(
      <PredictiveScoring 
        selectedCards={[mockCards[0]]} 
        maxCards={5} 
        isPredictingScore={true} 
      />
    );
    
    expect(screen.getByText(/Aiming for minimum Level 7/)).toBeInTheDocument();
  });

  it('indicates clear undertones when in level 3-4 range', () => {
    // Using all cards with shade indicators to reach level 3-4
    render(
      <PredictiveScoring 
        selectedCards={mockCards} 
        maxCards={3} 
        isPredictingScore={true} 
      />
    );
    
    expect(screen.getByText(/Clear undertones of judgment detected/)).toBeInTheDocument();
  });

  it('updates prediction as more cards are selected', () => {
    const { rerender } = render(
      <PredictiveScoring 
        selectedCards={[mockCards[0]]} 
        maxCards={5} 
        isPredictingScore={true} 
      />
    );

    // Start with low level
    expect(screen.getByText(/Aiming for minimum Level 7/)).toBeInTheDocument();

    // Add more shade-heavy cards
    rerender(
      <PredictiveScoring 
        selectedCards={mockCards} 
        maxCards={5} 
        isPredictingScore={true} 
      />
    );

    // Should now show higher level prediction
    expect(screen.queryByText(/Aiming for minimum Level 7/)).not.toBeInTheDocument();
  });
});