/**
 * Test suite for ReadingHistory component
 * @module tests/ReadingHistory
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReadingHistory } from '../ReadingHistory';
import { AuthProvider } from '../../../context/AuthContext';
import { vi } from 'vitest';

// Mock hooks
vi.mock('../../../hooks/useDatabase', () => ({
  useReadings: () => ({
    getUserReadings: vi.fn().mockResolvedValue([
      {
        id: '1',
        spreadType: 'Past, Present, Future',
        interpretation: 'Test reading',
        createdAt: new Date().toISOString(),
        cards: [
          { id: '1', name: 'The Fool', position: 0, isReversed: false }
        ]
      }
    ]),
    loading: false,
    error: null
  })
}));

describe('ReadingHistory', () => {
  beforeEach(() => {
    render(
      <AuthProvider>
        <ReadingHistory />
      </AuthProvider>
    );
  });

  it('renders reading history', async () => {
    await waitFor(() => {
      expect(screen.getByText(/your reading history/i)).toBeInTheDocument();
      expect(screen.getByText(/past, present, future/i)).toBeInTheDocument();
    });
  });

  it('filters readings by search term', async () => {
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search readings/i);
      fireEvent.change(searchInput, { target: { value: 'future' } });
      expect(screen.getByText(/past, present, future/i)).toBeInTheDocument();
    });
  });

  it('sorts readings by date', async () => {
    await waitFor(() => {
      const sortButton = screen.getByText(/newest first/i);
      fireEvent.click(sortButton);
      expect(screen.getByText(/oldest first/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no readings', async () => {
    // Mock empty readings
    vi.mocked(useReadings).mockImplementationOnce(() => ({
      getUserReadings: vi.fn().mockResolvedValue([]),
      loading: false,
      error: null
    }));

    render(
      <AuthProvider>
        <ReadingHistory />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/no readings found/i)).toBeInTheDocument();
    });
  });
});