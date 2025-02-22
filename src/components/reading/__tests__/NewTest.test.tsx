import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReadingInterpretation } from '../../../types';
import { ReadingScores } from '../ReadingScores';
import { ThemeProvider } from '../../../contexts/ThemeContext';

describe('ReadingScores', () => {
  const mockInterpretation: ReadingInterpretation = {
    text: "Your reading shows...",
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
  };

  const renderWithTheme = (interpretation = mockInterpretation) => {
    return render(
      <ThemeProvider>
        <ReadingScores interpretation={interpretation} />
      </ThemeProvider>
    );
  };

  it('renders all score categories', () => {
    renderWithTheme();
    
    const coreMetrics = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'];
    coreMetrics.forEach(metric => {
      expect(screen.getByText(new RegExp(metric, 'i'))).toBeInTheDocument();
    });
  });

  it('displays passing status with all requirements met', () => {
    renderWithTheme();
    expect(screen.getByTestId('passing-status')).toHaveTextContent(/serving excellence/i);
  });

  it('shows failing status when core metrics are below threshold', () => {
    const failingInterpretation: ReadingInterpretation = {
      ...mockInterpretation,
      scores: {
        ...mockInterpretation.scores,
        wisdom: 75  // Below 8/10 requirement
      }
    };

    renderWithTheme(failingInterpretation);
    expect(screen.getByTestId('passing-status')).toHaveTextContent(/needs work/i);
  });

  it('validates Shade Level™ requirements', () => {
    const lowShadeInterpretation: ReadingInterpretation = {
      ...mockInterpretation,
      scores: {
        ...mockInterpretation.scores,
        shadeIndex: {
          plausibleDeniability: 60,
          guiltTripIntensity: 62,
          emotionalManipulation: 58,
          backhandedCompliments: 65,
          strategicVagueness: 55
        }
      }
    };

    renderWithTheme(lowShadeInterpretation);
    expect(screen.getByTestId('shade-level')).toHaveTextContent(/Level 6/i);
    expect(screen.getByText(/minimum .* Level 7/i)).toBeInTheDocument();
  });

  it('displays proper feedback for different score ranges', () => {
    const mixedScoresInterpretation: ReadingInterpretation = {
      ...mockInterpretation,
      scores: {
        ...mockInterpretation.scores,
        humor: 95,    // High
        creative: 75,  // Medium
        wisdom: 65    // Low
      }
    };

    renderWithTheme(mixedScoresInterpretation);
    expect(screen.getByText(/Perfectly seasoned with sass/i)).toBeInTheDocument();
  });
});