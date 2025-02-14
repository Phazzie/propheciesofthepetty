import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ReadingScores } from '../ReadingScores';
import '@testing-library/jest-dom';

type SpreadType = 'classic' | 'celtic-cross' | 'three-card';

describe('ReadingScores', () => {
  beforeEach(() => {
    cleanup();
  });

  const mockPassingScores = {
    humor: 9,
    snark: 8.5,
    culturalResonance: 55,
    metaphorMastery: 55,
    shadeIndex: {
      plausibleDeniability: 85,
      guiltTripIntensity: 82,
      emotionalManipulation: 80,
      backhandedCompliments: 88,
      strategicVagueness: 85
    }
  };

  const mockFailingScores = {
    humor: 7,
    snark: 6,
    culturalResonance: 40,
    metaphorMastery: 35,
    shadeIndex: {
      plausibleDeniability: 65,
      guiltTripIntensity: 60,
      emotionalManipulation: 55,
      backhandedCompliments: 50,
      strategicVagueness: 45
    }
  };

  const createInterpretation = (scores: typeof mockPassingScores) => ({
    scores,
    stages: {
      denial: "Initial stage",
      anger: "Second stage",
      bargaining: "Third stage",
      depression: "Fourth stage",
      acceptance: "Final stage"
    }
  });

  it('should display passing status when all core metrics are >= 8/10 and Shade Level >= 7', () => {
    render(
      <ReadingScores 
        interpretation={createInterpretation(mockPassingScores)}
        spreadType={'classic' as SpreadType}
      />
    );
    
    expect(screen.getByText('Serving Excellence')).toBeInTheDocument();
  });

  it('should display failing status when core metrics or shade level requirements are not met', () => {
    render(
      <ReadingScores 
        interpretation={createInterpretation(mockFailingScores)}
        spreadType={'classic' as SpreadType}
      />
    );
    
    expect(screen.getByText('Needs Work, Darling')).toBeInTheDocument();
  });

  it('should display Level 3-4 shade scale message correctly', () => {
    const level3To4Scores = {
      ...mockFailingScores,
      shadeIndex: {
        plausibleDeniability: 35,
        guiltTripIntensity: 30,
        emotionalManipulation: 35,
        backhandedCompliments: 40,
        strategicVagueness: 35
      }
    };

    render(
      <ReadingScores 
        interpretation={createInterpretation(level3To4Scores)}
        spreadType={'classic' as SpreadType}
      />
    );
    
    expect(screen.getByText('The judgment is clear... clearly needs work')).toBeInTheDocument();
  });

  it('should show the scoring guidelines', () => {
    render(
      <ReadingScores 
        interpretation={createInterpretation(mockPassingScores)}
        spreadType={'classic' as SpreadType}
      />
    );
    
    expect(screen.getByText('• Core metrics require minimum 8/10 for passing')).toBeInTheDocument();
    expect(screen.getByText('• Shade Scale™ requires minimum Level 7')).toBeInTheDocument();
  });
});