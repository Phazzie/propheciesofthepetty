import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReadingDetails } from '../../reading/ReadingDetails';
import type { Reading } from '../../../types';

describe('ReadingDetails', () => {
  const mockReading: Reading = {
    id: 'test-reading-1',
    userId: 'user-1',
    createdAt: '2024-01-20T12:00:00Z',
    spreadType: 'classic',
    cards: [
      {
        id: 'tower',
        name: 'The Tower',
        position: 1,
        isReversed: false,
        imageUrl: '/cards/tower.jpg',
        type: 'major',
        description: 'Maybe this time you\'ll learn from sudden changes.'
      }
    ],
    interpretation: {
      text: "Your reading reveals...",
      scores: {
        subtlety: 85,      // Above 8/10
        relatability: 82,   // Above 8/10
        wisdom: 80,        // Exactly 8/10
        creative: 85,      // Above 8/10
        humor: 88,         // Above 8/10
        snark: 85,
        culturalResonance: 75,
        metaphorMastery: 80,
        shadeIndex: {
          plausibleDeniability: 75,
          guiltTripIntensity: 72,
          emotionalManipulation: 78,
          backhandedCompliments: 85,
          strategicVagueness: 80
        }
      }
    }
  };

  const mockOnBack = vi.fn();

  it('displays reading details with scores', () => {
    render(<ReadingDetails reading={mockReading} onBack={mockOnBack} />);
    
    expect(screen.getByText(/The Tower/)).toBeInTheDocument();
    expect(screen.getByText(/Position 1/)).toBeInTheDocument();
    expect(screen.getByTestId('score-display')).toBeInTheDocument();
  });

  it('highlights passing core metrics', () => {
    render(<ReadingDetails reading={mockReading} onBack={mockOnBack} />);
    
    const coreMetrics = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'];
    coreMetrics.forEach(metric => {
      const element = screen.getByTestId(`${metric}-score`);
      expect(element).toHaveClass('text-success');
      expect(element).toHaveTextContent(/8/); // Should show at least 8/10
    });
  });

  it('shows shade level achievement', () => {
    render(<ReadingDetails reading={mockReading} onBack={mockOnBack} />);
    
    expect(screen.getByTestId('shade-level')).toHaveTextContent(/Level 7/);
    expect(screen.getByText(/Achievement/)).toBeInTheDocument();
  });

  it('displays failing metrics appropriately', () => {
    const failingReading = {
      ...mockReading,
      interpretation: {
        ...mockReading.interpretation,
        scores: {
          ...mockReading.interpretation.scores,
          wisdom: 75, // Below 8/10
          shadeIndex: {
            ...mockReading.interpretation.scores.shadeIndex,
            plausibleDeniability: 60,
            guiltTripIntensity: 62,
            emotionalManipulation: 58
          }
        }
      }
    };

    render(<ReadingDetails reading={failingReading} onBack={mockOnBack} />);
    
    expect(screen.getByTestId('wisdom-score')).toHaveClass('text-warning');
    expect(screen.getByText(/minimum score not met/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 6/i)).toBeInTheDocument();
  });

  it('shows Pointed Pause level details', () => {
    const pointedPauseReading = {
      ...mockReading,
      interpretation: {
        ...mockReading.interpretation,
        scores: {
          ...mockReading.interpretation.scores,
          shadeIndex: {
            plausibleDeniability: 35,
            guiltTripIntensity: 40,
            emotionalManipulation: 35,
            backhandedCompliments: 38,
            strategicVagueness: 32
          }
        }
      }
    };

    render(<ReadingDetails reading={pointedPauseReading} onBack={mockOnBack} />);
    
    expect(screen.getByText(/Pointed Pause/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear undertones of judgment/i)).toBeInTheDocument();
    expect(screen.getByTestId('shade-level')).toHaveTextContent(/Level [3-4]/);
  });
});