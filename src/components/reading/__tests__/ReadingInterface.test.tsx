/**
 * Test suite for ReadingInterface component
 * @module tests/ReadingInterface
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReadingInterface from '../ReadingInterface';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { generateTarotInterpretation } from '../../../lib/gemini';

// Mock dependencies
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
    ])
  })
}));

vi.mock('../../../lib/gemini', () => ({
  generateTarotInterpretation: vi.fn().mockResolvedValue({
    text: 'Your reading interpretation',
    scores: {
      humor: 85,
      snark: 80,
      culturalResonance: 75,
      metaphorMastery: 70,
      subtlety: 85,
      relatability: 85,
      wisdom: 85,
      creative: 85,
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
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <ReadingInterface />
      </ThemeProvider>
    );
  };

  it('shows spread selection initially', () => {
    renderComponent();
    expect(screen.getByText(/choose your spread/i)).toBeInTheDocument();
  });

  it('shows card selection after spread choice', async () => {
    renderComponent();
    
    fireEvent.click(screen.getByText(/past, present, future/i));
    
    await waitFor(() => {
      expect(screen.getByText(/select your cards/i)).toBeInTheDocument();
      expect(screen.getByText(/choose 3 cards/i)).toBeInTheDocument();
    });
  });

  it('handles card selection and generates reading', async () => {
    renderComponent();
    
    // Select spread
    fireEvent.click(screen.getByText(/past, present, future/i));
    
    // Select cards
    const cards = await screen.findAllByTestId('card-select');
    for (let i = 0; i < 3; i++) {
      fireEvent.click(cards[i]);
    }

    // Check loading state
    expect(screen.getByText(/generating your totally unbiased interpretation/i)).toBeInTheDocument();

    // Verify interpretation called with correct params
    await waitFor(() => {
      expect(vi.mocked(generateTarotInterpretation)).toHaveBeenCalledWith(
        'past-present-future',
        expect.arrayContaining([
          expect.objectContaining({ position: 'Past' }),
          expect.objectContaining({ position: 'Present' }),
          expect.objectContaining({ position: 'Future' })
        ])
      );
    });
  });

  it('handles errors gracefully', async () => {
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

  it('disables selected cards', async () => {
    renderComponent();
    
    fireEvent.click(screen.getByText(/past, present, future/i));
    
    const cards = await screen.findAllByTestId('card-select');
    fireEvent.click(cards[0]);
    
    expect(cards[0]).toHaveClass('opacity-50');
    expect(cards[0]).toHaveAttribute('aria-disabled', 'true');
  });

  it('calls onComplete when reading is generated', async () => {
    const onComplete = vi.fn();
    render(
      <ThemeProvider>
        <ReadingInterface onComplete={onComplete} />
      </ThemeProvider>
    );
    
    fireEvent.click(screen.getByText(/past, present, future/i));
    
    const cards = await screen.findAllByTestId('card-select');
    for (let i = 0; i < 3; i++) {
      fireEvent.click(cards[i]);
    }

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });
});