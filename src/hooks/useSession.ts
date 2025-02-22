import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RecoverySystem } from '../lib/recovery';
import { AuthError } from '../lib/errors';
import { logger } from '../lib/logger';

export interface UseSessionOptions {
  onExpire?: () => void;
}

export function useSession({ onExpire }: UseSessionOptions = {}) {
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsValid(false);
          onExpire?.();
          return;
        }

        // Verify session validity with retry mechanism
        await RecoverySystem.withRetry(async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new AuthError('Session invalid');
          }
          setIsValid(true);
        }, {
          maxAttempts: 3,
          initialDelay: 1000
        });

      } catch (err) {
        const error = err instanceof Error ? err : new Error('Session check failed');
        setError(error);
        setIsValid(false);
        logger.error('Session validation failed', error);
        onExpire?.();
      } finally {
        setLoading(false);
      }
    };

    // Set up session refresh timer
    const refreshInterval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // Check every 5 minutes

    checkSession();

    return () => {
      clearInterval(refreshInterval);
    };
  }, [onExpire]);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await RecoverySystem.withRetry(async () => {
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error || !session) {
          throw new AuthError('Failed to refresh session');
        }
        setIsValid(true);
      }, {
        maxAttempts: 2,
        initialDelay: 500
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Session refresh failed');
      setError(error);
      setIsValid(false);
      logger.error('Session refresh failed', error);
      onExpire?.();
    } finally {
      setLoading(false);
    }
  }, [onExpire]);

  return {
    isValid,
    loading,
    error,
    refreshSession
  };
}