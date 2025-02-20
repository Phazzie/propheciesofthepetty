import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SessionManager } from '../lib/sessionManager';
import { logger } from '../lib/logger';

export interface UseSessionOptions {
  refreshInterval?: number;
  onExpire?: () => void;
}

export function useSession(options: UseSessionOptions = {}) {
  const { refreshInterval = 5 * 60 * 1000, onExpire } = options;
  const { user, logout } = useAuth();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const isSessionValid = await SessionManager.validateSession();
        setIsValid(isSessionValid);

        if (!isSessionValid) {
          logger.warn('Session expired');
          onExpire?.();
          await logout();
        }
      } catch (error) {
        logger.error('Session check failed', error);
        setIsValid(false);
      }
    };

    const startSessionCheck = () => {
      checkSession();
      timeoutId = setInterval(checkSession, refreshInterval);
    };

    if (user) {
      startSessionCheck();
    }

    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, [user, refreshInterval, onExpire, logout]);

  return {
    isValid,
    validate: async () => {
      const isSessionValid = await SessionManager.validateSession();
      setIsValid(isSessionValid);
      return isSessionValid;
    },
    refresh: async () => {
      try {
        await SessionManager.refreshSession();
        setIsValid(true);
        return true;
      } catch (error) {
        logger.error('Session refresh failed', error);
        setIsValid(false);
        return false;
      }
    }
  };
}