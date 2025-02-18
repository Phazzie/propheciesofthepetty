import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReadingInterface } from '../../reading/ReadingInterface';
import { AuthContext } from '../../../context/AuthContext';
import type { AuthContextType } from '../../../context/AuthContext';
import '@testing-library/jest-dom';

const mockGetReadings = vi.fn();
const mockSaveReading = vi.fn();

// Mock AuthContext values
const mockAuthContext: AuthContextType = {
  user: { id: 'test-user', email: 'test@example.com', subscriptionType: 'full_deck' },
  getReadings: mockGetReadings,
  saveReading: mockSaveReading,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  requestPasswordReset: vi.fn(),
  loading: false,
  error: null
};

const mockReading = {
  id: '123',
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

const renderComponent = (authContextValue = {}) => {
  const defaultAuthContext = {
    ...mockAuthContext,
    ...authContextValue
  };
  
  return render(
    <AuthContext.Provider value={defaultAuthContext}>
      <ReadingInterface />
    </AuthContext.Provider>
  );
};

describe('ReadingInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reading interface', () => {
    renderComponent();
    expect(screen.getByText(/choose your spread/i)).toBeInTheDocument();
  });

  it('validates minimum scoring requirements before saving', async () => {
    mockGetReadings.mockResolvedValue([mockReading]);
    const { rerender } = renderComponent();

    // Test with failing core metrics
    const failingCoreMetrics = {
      ...mockReading,
      scores: {
        ...mockReading.scores,
        wisdom: 75  // Below 8/10 requirement
      }
    };

    await waitFor(() => {
      fireEvent.click(screen.getByText(/save reading/i));
    });

    expect(screen.getByText(/minimum score .* not met/i)).toBeInTheDocument();
    expect(mockSaveReading).not.toHaveBeenCalled();

    // Test with failing shade level
    const failingShadeLevel = {
      ...mockReading,
      scores: {
        ...mockReading.scores,
        shadeIndex: {
          plausibleDeniability: 60,
          guiltTripIntensity: 62,
          emotionalManipulation: 58,
          backhandedCompliments: 65,
          strategicVagueness: 55
        }
      }
    };

    rerender(
      <AuthContext.Provider value={{ 
        ...defaultAuthContext, 
        reading: failingShadeLevel 
      }}>
        <ReadingInterface />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText(/save reading/i));
    });

    expect(screen.getByText(/minimum .* Level 7/i)).toBeInTheDocument();
    expect(mockSaveReading).not.toHaveBeenCalled();
  });

  it('identifies Pointed Pause shade level range', async () => {
    const pointedPauseReading = {
      ...mockReading,
      scores: {
        ...mockReading.scores,
        shadeIndex: {
          plausibleDeniability: 35,
          guiltTripIntensity: 40,
          emotionalManipulation: 35,
          backhandedCompliments: 38,
          strategicVagueness: 32
        }
      }
    };

    renderComponent({ reading: pointedPauseReading });

    await waitFor(() => {
      expect(screen.getByText(/Pointed Pause/i)).toBeInTheDocument();
      expect(screen.getByText(/Clear undertones of judgment/i)).toBeInTheDocument();
    });
  });

  it('allows saving when all requirements are met', async () => {
    const passingReading = {
      ...mockReading,
      scores: {
        ...mockReading.scores,
        shadeIndex: {
          plausibleDeniability: 75,  // Level 7+
          guiltTripIntensity: 72,
          emotionalManipulation: 78,
          backhandedCompliments: 85,
          strategicVagueness: 80
        }
      }
    };

    renderComponent({ reading: passingReading });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/save reading/i));
    });

    expect(mockSaveReading).toHaveBeenCalledWith(passingReading);
  });

  it('fetches readings on load', async () => {
    renderComponent();
    expect(mockGetReadings).toHaveBeenCalled();
  });

  it('handles loading state', async () => {
    renderComponent({ loading: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    renderComponent({ error: 'Failed to fetch readings' });
    expect(screen.getByText(/failed to fetch readings/i)).toBeInTheDocument();
  });
});