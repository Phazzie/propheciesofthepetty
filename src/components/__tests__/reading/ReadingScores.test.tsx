import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ReadingScores } from '../../reading/ReadingScores';
import type { ReadingInterpretation } from '../../../types';

describe('ReadingScores', () => {
  const mockInterpretation: ReadingInterpretation = {
    text: "Your reading shows...",
    scores: {
      subtlety: 85,
      relatability: 82,
      wisdom: 80,
      creative: 85,
      humor: 88,
      snark: 85,
      culturalResonance: 75,
      metaphorMastery: 80,
      shadeIndex: {
        plausibleDeniability: 85,
        guiltTripIntensity: 75,
        emotionalManipulation: 80,
        backhandedCompliments: 90,
        strategicVagueness: 85
      }
    }
  };

  it('displays passing scores with correct styling', () => {
    render(<ReadingScores interpretation={mockInterpretation} />);
    
    // Core metrics should show as passing (>= 8/10)
    const coreMetrics = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'];
    coreMetrics.forEach(metric => {
      const element = screen.getByText(new RegExp(`${metric}`, 'i'));
      expect(element).toBeInTheDocument();
      expect(element.closest('[data-testid="primary-metrics"]')).toBeInTheDocument();
    });

    expect(screen.getByTestId('passing-status')).toHaveTextContent('Serving Excellence');
  });

  it('displays failing scores with warning styling', () => {
    const failingInterpretation: ReadingInterpretation = {
      ...mockInterpretation,
      scores: {
        ...mockInterpretation.scores,
        subtlety: 75,  // Below 8/10
        wisdom: 78     // Below 8/10
      }
    };

    render(<ReadingScores interpretation={failingInterpretation} />);
    expect(screen.getByTestId('passing-status')).toHaveTextContent('Needs Work, Darling');
  });

  it('shows shade level classification', () => {
    render(<ReadingScores interpretation={mockInterpretation} />);
    
    expect(screen.getByText(/Shade Level™/i)).toBeInTheDocument();
    const shadeLevel = screen.getByTestId('shade-level');
    expect(shadeLevel).toBeInTheDocument();
  });

  it('displays enhanced reading stages when available', () => {
    const enhancedInterpretation: ReadingInterpretation & { stages: any } = {
      ...mockInterpretation,
      stages: {
        denial: "That's... interesting",
        anger: "How dare you suggest...",
        bargaining: "Maybe if we look at it differently...",
        depression: "Perhaps you're right...",
        acceptance: "Well played, cards. Well played."
      }
    };

    render(<ReadingScores interpretation={enhancedInterpretation} />);
    
    expect(screen.getByText(enhancedInterpretation.stages.denial)).toBeInTheDocument();
    expect(screen.getByText(enhancedInterpretation.stages.acceptance)).toBeInTheDocument();
  });

  it('shows appropriate shade level transition animations', () => {
    const transitionScore = {
      ...mockInterpretation.scores,
      shadeIndex: {
        plausibleDeniability: 70,
        guiltTripIntensity: 72,
        emotionalManipulation: 68,
        backhandedCompliments: 75,
        strategicVagueness: 65
      }
    };

    const { rerender } = render(
      <ReadingScores 
        interpretation={{ ...mockInterpretation, scores: transitionScore }} 
      />
    );

    // Initial render at Level 7
    expect(screen.getByTestId('shade-level')).toHaveTextContent('Level 7');

    // Update to Level 8
    const improvedScore = {
      ...transitionScore,
      shadeIndex: {
        ...transitionScore.shadeIndex,
        backhandedCompliments: 85,
        strategicVagueness: 80
      }
    };

    rerender(
      <ReadingScores 
        interpretation={{ ...mockInterpretation, scores: improvedScore }}
      />
    );

    expect(screen.getByTestId('shade-level')).toHaveTextContent('Level 8');
    expect(screen.getByText(/celebration/i)).toBeInTheDocument();
  });

  describe('Core metrics validation', () => {
    it('validates each core metric individually', () => {
      const coreMetrics = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'];
      
      coreMetrics.forEach(metric => {
        const failingScores = {
          ...mockInterpretation.scores,
          [metric]: 79  // Just below passing threshold
        };

        render(
          <ReadingScores 
            interpretation={{ ...mockInterpretation, scores: failingScores }}
          />
        );
        
        expect(screen.getByTestId(`${metric}-status`)).toHaveClass('text-warning');
        expect(screen.getByTestId('passing-status')).toHaveTextContent(/needs work/i);
        
        cleanup();
      });
    });
  });

  describe('Core Requirements Validation', () => {
    it('validates all core metrics must be 8/10 or higher', () => {
      const barelyPassingInterpretation: ReadingInterpretation = {
        text: "Testing minimum requirements...",
        scores: {
          ...mockInterpretation.scores,
          subtlety: 80,    // Exactly 8/10
          relatability: 80, // Exactly 8/10
          wisdom: 80,      // Exactly 8/10
          creative: 80,    // Exactly 8/10
          humor: 80        // Exactly 8/10
        }
      };

      render(<ReadingScores interpretation={barelyPassingInterpretation} />);
      expect(screen.getByTestId('passing-status')).toHaveTextContent(/Serving Excellence/i);

      const justFailingInterpretation: ReadingInterpretation = {
        ...barelyPassingInterpretation,
        scores: {
          ...barelyPassingInterpretation.scores,
          wisdom: 79  // Just below 8/10
        }
      };

      cleanup();
      render(<ReadingScores interpretation={justFailingInterpretation} />);
      expect(screen.getByTestId('passing-status')).toHaveTextContent(/Needs Work/i);
      expect(screen.getByText(/minimum 8\/10/i)).toBeInTheDocument();
    });

    it('enforces minimum Shade Level™ 7 requirement', () => {
      const level6Interpretation: ReadingInterpretation = {
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

      render(<ReadingScores interpretation={level6Interpretation} />);
      expect(screen.getByTestId('shade-level')).toHaveTextContent(/Level 6/i);
      expect(screen.getByText(/minimum .* Level 7/i)).toBeInTheDocument();

      cleanup();
      const level7Interpretation: ReadingInterpretation = {
        ...mockInterpretation,
        scores: {
          ...mockInterpretation.scores,
          shadeIndex: {
            plausibleDeniability: 70,
            guiltTripIntensity: 72,
            emotionalManipulation: 68,
            backhandedCompliments: 75,
            strategicVagueness: 65
          }
        }
      };

      render(<ReadingScores interpretation={level7Interpretation} />);
      expect(screen.getByTestId('shade-level')).toHaveTextContent(/Level 7/i);
      expect(screen.queryByText(/minimum .* Level 7/i)).not.toBeInTheDocument();
    });

    it('identifies Pointed Pause level range (3-4)', () => {
      const pointedPauseInterpretation: ReadingInterpretation = {
        ...mockInterpretation,
        scores: {
          ...mockInterpretation.scores,
          shadeIndex: {
            plausibleDeniability: 35,
            guiltTripIntensity: 40,
            emotionalManipulation: 35,
            backhandedCompliments: 38,
            strategicVagueness: 32
          }
        }
      };

      render(<ReadingScores interpretation={pointedPauseInterpretation} />);
      expect(screen.getByText(/Pointed Pause/i)).toBeInTheDocument();
      expect(screen.getByText(/Clear undertones of judgment/i)).toBeInTheDocument();
    });

    it('fails readings that pass core metrics but fail shade level', () => {
      const passingCoreFailingShadeInterpretation: ReadingInterpretation = {
        ...mockInterpretation,
        scores: {
          subtlety: 85,      // Well above 8/10
          relatability: 82,   // Above 8/10
          wisdom: 80,         // Exactly 8/10
          creative: 85,       // Above 8/10
          humor: 88,         // Above 8/10
          snark: 85,
          culturalResonance: 75,
          metaphorMastery: 80,
          shadeIndex: {
            plausibleDeniability: 60,  // Level 6 shade
            guiltTripIntensity: 62,
            emotionalManipulation: 58,
            backhandedCompliments: 65,
            strategicVagueness: 55
          }
        }
      };

      render(<ReadingScores interpretation={passingCoreFailingShadeInterpretation} />);
      
      // Should show core metrics passing
      const coreMetrics = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'];
      coreMetrics.forEach(metric => {
        expect(screen.getByTestId(`${metric}-status`)).toHaveClass('text-success');
      });

      // But overall should fail due to shade level
      expect(screen.getByTestId('passing-status')).toHaveTextContent(/Needs Work/i);
      expect(screen.getByTestId('shade-level')).toHaveTextContent(/Level 6/i);
      expect(screen.getByText(/minimum .* Level 7/i)).toBeInTheDocument();
    });

    it('validates concurrent achievement of core and shade requirements', () => {
      const borderlinePassingInterpretation: ReadingInterpretation = {
        ...mockInterpretation,
        scores: {
          subtlety: 80,    // Exactly 8/10
          relatability: 80,
          wisdom: 80,
          creative: 80,
          humor: 80,
          snark: 85,
          culturalResonance: 75,
          metaphorMastery: 80,
          shadeIndex: {
            plausibleDeniability: 70,  // Exactly Level 7
            guiltTripIntensity: 70,
            emotionalManipulation: 70,
            backhandedCompliments: 70,
            strategicVagueness: 70
          }
        }
      };

      render(<ReadingScores interpretation={borderlinePassingInterpretation} />);
      
      // Both requirements should just pass
      expect(screen.getByTestId('passing-status')).toHaveTextContent(/Serving Excellence/i);
      expect(screen.getByTestId('shade-level')).toHaveTextContent(/Level 7/i);
      expect(screen.queryByText(/minimum/i)).not.toBeInTheDocument();

      // Should indicate borderline status
      expect(screen.getByText(/borderline/i)).toBeInTheDocument();
    });
  });
});