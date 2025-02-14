import { useState, useCallback } from 'react';
import { readingOperations, cardOperations } from '../lib/database';
import type { User } from '@supabase/supabase-js';

export function useCards() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cards = await cardOperations.getCards();
      return cards;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cards'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getCards, loading, error };
}

export function useReadings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveReading = useCallback(async (
    userId: string,
    spreadType: string,
    interpretation: string,
    cards: { cardId: string; position: number; isReversed: boolean }[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const readingId = await readingOperations.saveReading(userId, spreadType, interpretation, cards);
      return readingId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save reading'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReading = useCallback(async (readingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const reading = await readingOperations.getReading(readingId);
      return reading;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reading'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserReadings = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const readings = await readingOperations.getUserReadings(userId);
      return readings;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user readings'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveReading, getReading, getUserReadings, loading, error };
}