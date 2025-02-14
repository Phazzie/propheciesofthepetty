/**
 * Test suite for ReadingInterface component
 * @module tests/ReadingInterface
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReadingInterface } from '../ReadingInterface';
import { AuthProvider } from '../../../context/AuthContext';
import { vi } from 'vitest';

// Mock hooks and context
vi.mock('../../../hooks/useDatabase', () => ({
  useCards: () => ({
    getCards: vi.fn().mockResolvedValue([
      { id: '1', name: 'The Fool', description: 'Test', type: 'major' }
    ]),
    loading: false,
    error: null
  }),
  useReadings: () => ({
    saveReading: vi.fn().mockResolvedValue('reading-1'),
    loading: false,
    error: null
  })
}));

vi.mock('../../../lib/gemini', () => ({
  generateTarotInterpretation: vi.fn().mockResolvedValue('Test interpretation')
}));

describe('ReadingInterface', () => {
  beforeEach(() => {
    render(
      <AuthProvider>
        <ReadingInterface />
      </AuthProvider>
    );
  });

  it('renders spread selection initially', () => {
    expect(screen.getByText(/choose your spread/i)).toBeInTheDocument();
    expect(screen.getByText(/past, present, future/i)).toBeInTheDocument();
  });

  it('shows card selection after spread choice', async () => {
    const spreadButton = screen.getByText(/past, present, future/i);
    fireEvent.click(spreadButton);

    await waitFor(() => {
      expect(screen.getByText(/select your cards/i)).toBeInTheDocument();
    });
  });

  it('displays loading state during interpretation', async () => {
    // Select spread
    fireEvent.click(screen.getByText(/past, present, future/i));

    // Select cards
    const cards = await screen.findAllByTestId('tarot-card');
    cards.slice(0, 3).forEach(card => fireEvent.click(card));

    await waitFor(() => {
      expect(screen.getByText(/generating interpretation/i)).toBeInTheDocument();
    });
  });

  it('shows error message on failure', async () => {
    // Mock error state
    vi.mocked(generateTarotInterpretation).mockRejectedValueOnce(new Error('Failed to generate'));

    // Select spread and cards
    fireEvent.click(screen.getByText(/past, present, future/i));
    const cards = await screen.findAllByTestId('tarot-card');
    cards.slice(0, 3).forEach(card => fireEvent.click(card));

    await waitFor(() => {
      expect(screen.getByText(/failed to generate/i)).toBeInTheDocument();
    });
  });
});