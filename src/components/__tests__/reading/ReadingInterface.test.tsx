import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReadingInterface } from '../../reading/ReadingInterface';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { AuthContext } from '../../../context/AuthContext';
import { generateTarotInterpretation } from '../../../lib/gemini';
import '@testing-library/jest-dom';

// Mock hooks and dependencies
vi.mock('../../../hooks/useDatabase', () => ({
  useCards: () => ({
    getCards: vi.fn().mockResolvedValue([
      {
        id: 'fool',
        name: 'The Fool',
        description: 'New beginnings',
        type: 'major',
        imageUrl: '/cards/fool.jpg'
      },
      {
        id: 'magician',
        name: 'The Magician',
        description: 'Manifestation',
        type: 'major',
        imageUrl: '/cards/magician.jpg'
      },
      {
        id: 'priestess',
        name: 'The High Priestess',
        description: 'Inner wisdom',
        type: 'major',
        imageUrl: '/cards/priestess.jpg'
      }
    ]),
    loading: false,
    error: null
  })
}));

vi.mock('../../../lib/gemini', () => ({
  generateTarotInterpretation: vi.fn().mockResolvedValue({
    text: "Your reading interpretation",
    scores: {
      subtlety: 85,
      relatability: 85,
      wisdom: 85,
      creative: 85,
      humor: 85,
      snark: 80,
      culturalResonance: 75,
      metaphorMastery: 70,
      shadeIndex: {
        plausibleDeniability: 85,
        guiltTripIntensity: 80,
        emotionalManipulation: 75,
        backhandedCompliments: 90,
        strategicVagueness: 85
      }
    }
  })
}));

describe('ReadingInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider>
        <AuthContext.Provider value={{ user: { id: 'test-user' } }}>
          <ReadingInterface {...props} />
        </AuthContext.Provider>
      </ThemeProvider>
    );
  };

  it('renders spread selection initially', () => {
    renderComponent();
    expect(screen.getByText(/choose your spread/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /past, present, future/i })).toBeInTheDocument();
  });

  it('shows card selection after spread choice', async () => {
    renderComponent();
    
    fireEvent.click(screen.getByText(/past, present, future/i));
    
    await waitFor(() => {
      expect(screen.getByText(/select your cards/i)).toBeInTheDocument();
      expect(screen.getByText(/choose 3 cards/i)).toBeInTheDocument();
    });

    // Verify card display
    expect(screen.getByText('The Fool')).toBeInTheDocument();
    expect(screen.getByText('The Magician')).toBeInTheDocument();
    expect(screen.getByText('The High Priestess')).toBeInTheDocument();
  });

  it('displays loading state during interpretation', async () => {
    renderComponent();
    
    // Select spread
    fireEvent.click(screen.getByText(/past, present, future/i));
    
    // Select cards
    const cards = await screen.findAllByTestId('card-select');
    for (let i = 0; i < 3; i++) {
      fireEvent.click(cards[i]);
    }

    // Verify loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText(/generating.*interpretation/i)).toBeInTheDocument();
  });

  it('shows error message on API failure', async () => {
    vi.mocked(generateTarotInterpretation).mockRejectedValueOnce(new Error('API Error'));
    
    renderComponent();
    fireEvent.click(screen.getByText(/past, present, future/i));
    
    const cards = await screen.findAllByTestId('card-select');
    for (let i = 0; i < 3; i++) {
      fireEvent.click(cards[i]);
    }

    await waitFor(() => {
      expect(screen.getByText(/failed to generate reading/i)).toBeInTheDocument();
    });
  });

  it('validates shade level requirements', async () => {
    const lowShadeInterpretation = {
      text: "Your reading interpretation",
      scores: {
        subtlety: 85,
        relatability: 85,
        wisdom: 85,
        creative: 85,
        humor: 85,
        shadeIndex: {
          plausibleDeniability: 60,
          guiltTripIntensity: 62,
          emotionalManipulation: 58,
          backhandedCompliments: 65,
          strategicVagueness: 55
        }
      }
    };

    vi.mocked(generateTarotInterpretation).mockResolvedValueOnce(lowShadeInterpretation);
    
    renderComponent();
    fireEvent.click(screen.getByText(/past, present, future/i));
    
    const cards = await screen.findAllByTestId('card-select');
    for (let i = 0; i < 3; i++) {
      fireEvent.click(cards[i]);
    }

    await waitFor(() => {
      expect(screen.getByText(/minimum.*Level 7/i)).toBeInTheDocument();
    });
  });
});