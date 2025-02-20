import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { RecoverySystem } from './recovery';
import { logger } from './logger';
import { NetworkError, AuthError } from './errors';

export interface SessionState {
  isValid: boolean;
  expiresAt: number | null;
  refreshToken: string | null;
}

export class SessionManager {
  private static readonly SESSION_KEY = 'auth_session';
  private static readonly TOKEN_REFRESH_MARGIN = 5 * 60 * 1000; // 5 minutes in ms

  static async initialize(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await this.setSession(session);
      }
    } catch (error) {
      logger.error('Failed to initialize session', error);
      throw new AuthError('Session initialization failed');
    }
  }

  static async getSessionState(): Promise<SessionState> {
    const session = await this.getStoredSession();
    if (!session) {
      return { isValid: false, expiresAt: null, refreshToken: null };
    }

    const now = Date.now();
    const expiresAt = session.expires_at ? session.expires_at * 1000 : null;
    const isValid = expiresAt ? now < expiresAt : false;

    return {
      isValid,
      expiresAt,
      refreshToken: session.refresh_token
    };
  }

  static async refreshSession(): Promise<void> {
    const { refreshToken } = await this.getSessionState();
    if (!refreshToken) {
      throw new AuthError('No refresh token available');
    }

    try {
      await RecoverySystem.withRetry(
        async () => {
          const { data: { session }, error } = await supabase.auth.refreshSession();
          if (error) throw error;
          if (session) {
            await this.setSession(session);
          }
        },
        {
          retryConfig: {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 5000
          }
        }
      );
    } catch (error) {
      logger.error('Failed to refresh session', error);
      throw new NetworkError('Failed to refresh session');
    }
  }

  static async validateSession(): Promise<boolean> {
    try {
      const state = await this.getSessionState();
      if (!state.isValid) {
        return false;
      }

      // Check if we need to refresh soon
      if (state.expiresAt) {
        const timeUntilExpiry = state.expiresAt - Date.now();
        if (timeUntilExpiry < this.TOKEN_REFRESH_MARGIN) {
          await this.refreshSession();
        }
      }

      return true;
    } catch (error) {
      logger.error('Session validation failed', error);
      return false;
    }
  }

  static async setSession(session: Session): Promise<void> {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      logger.error('Failed to store session', error);
      throw new Error('Failed to store session');
    }
  }

  private static async getStoredSession(): Promise<Session | null> {
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      logger.error('Failed to retrieve session', error);
      return null;
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      logger.error('Failed to clear session', error);
    }
  }
}