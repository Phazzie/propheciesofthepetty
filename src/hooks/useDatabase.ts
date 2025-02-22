import { useState, useCallback } from 'react';
import { RecoverySystem } from '../lib/recovery';
import { NetworkError, DatabaseError } from '../lib/errors';
import { Database } from '../lib/database';
import { logger } from '../lib/logger';
import type { Reading, CardInReading } from '../lib/database.types';

const db = new Database();

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
    cards: CardInReading[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      return await RecoverySystem.withRetry(async () => {
        const readingId = await db.saveReading(userId, spreadType, interpretation, cards);
        logger.info('Reading saved successfully', { readingId });
        return readingId;
      }, {
        maxAttempts: 3,
        initialDelay: 1000
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save reading');
      setError(error);
      logger.error('Failed to save reading', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReading = useCallback(async (readingId: string) => {
    setLoading(true);
    setError(null);

    try {
      return await RecoverySystem.withRetry(async () => {
        const reading = await db.getReading(readingId);
        logger.debug('Reading fetched successfully', { readingId });
        return reading;
      }, {
        maxAttempts: 2,
        initialDelay: 500
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch reading');
      setError(error);
      logger.error('Failed to fetch reading', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserReadings = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      return await RecoverySystem.withRetry(async () => {
        const readings = await db.getUserReadings(userId);
        logger.debug('User readings fetched successfully', { 
          userId, 
          count: readings.length 
        });
        return readings;
      }, {
        maxAttempts: 3,
        initialDelay: 1000
      });
    } catch (err) {
      if (err instanceof NetworkError || err instanceof DatabaseError) {
        const error = err;
        setError(error);
        logger.error('Failed to fetch user readings', error);
        throw error;
      }
      const error = new Error('Failed to fetch user readings');
      setError(error);
      logger.error('Failed to fetch user readings', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    saveReading,
    getReading,
    getUserReadings
  };
}