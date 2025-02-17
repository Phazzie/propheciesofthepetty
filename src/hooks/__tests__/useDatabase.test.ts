/**
 * Test suite for database hooks
 * @module tests/useDatabase
 */

import { renderHook, act } from '@testing-library/react';
import { useCards, useReadings } from '../useDatabase';
import { vi, it, describe, expect, beforeEach } from 'vitest';
import { cardOperations, readingOperations } from '../../lib/database';

// Mock database operations
vi.mock('../../lib/database', () => ({
  cardOperations: {
    getCards: vi.fn()
  },
  readingOperations: {
    saveReading: vi.fn(),
    getUserReadings: vi.fn()
  }
}));

describe('useCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches cards successfully', async () => {
    const mockCards = [
      { id: '1', name: 'The Fool', description: 'Test' }
    ];

    vi.mocked(cardOperations.getCards).mockResolvedValueOnce(mockCards);
    const { result } = renderHook(() => useCards());

    await act(async () => {
      const cards = await result.current.getCards();
      expect(cards).toEqual(mockCards);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch errors', async () => {
    vi.mocked(cardOperations.getCards).mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useCards());

    await act(async () => {
      await expect(result.current.getCards()).rejects.toThrow('Failed to fetch');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});

describe('useReadings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves reading successfully', async () => {
    const mockReadingId = '123';
    vi.mocked(readingOperations.saveReading).mockResolvedValueOnce(mockReadingId);

    const { result } = renderHook(() => useReadings());

    await act(async () => {
      const id = await result.current.saveReading('user1', 'test', 'interpretation', []);
      expect(id).toBe(mockReadingId);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches user readings successfully', async () => {
    const mockReadings = [
      { id: '1', userId: 'user1', interpretation: 'Test' }
    ];

    vi.mocked(readingOperations.getUserReadings).mockResolvedValueOnce(mockReadings);

    const { result } = renderHook(() => useReadings());

    await act(async () => {
      const readings = await result.current.getUserReadings('user1');
      expect(readings).toEqual(mockReadings);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});