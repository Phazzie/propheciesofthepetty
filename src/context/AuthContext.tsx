import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AuthError, ValidationError } from '../lib/errors';
import { logger } from '../lib/logger';
import { loginRateLimiter } from '../lib/rateLimit';
import { SessionManager } from '../lib/sessionManager';
import { RecoverySystem } from '../lib/recovery';

// Test account for development
const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  subscriptionType: 'free' as const
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Export the context directly
export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  const setLoading = (loading: boolean) => setState(s => ({ ...s, loading }));
  const setError = (error: string | null) => setState(s => ({ ...s, error }));
  const setUser = (user: User | null) => setState(s => ({ ...s, user }));
  const setSession = (session: Session | null) => setState(s => ({ ...s, session }));

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (session) {
        setSession(session);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          subscriptionType: 'free'
        });
      }
    } catch (err) {
      logger.error('Session refresh failed', err);
      await logout();
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await SessionManager.initialize();
        const sessionState = await SessionManager.getSessionState();
        
        if (sessionState.isValid) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (session?.user) {
            setSession(session);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              subscriptionType: 'free'
            });
          }
        }
      } catch (err) {
        logger.error('Auth initialization failed', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        logger.debug('Auth state changed', { event });
        
        if (event === 'SIGNED_IN') {
          if (session?.user) {
            await SessionManager.setSession(session);
            setSession(session);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              subscriptionType: 'free'
            });
          }
        } else if (event === 'SIGNED_OUT') {
          SessionManager.clearSession();
          setUser(null);
          setSession(null);
        } else if (event === 'TOKEN_REFRESHED') {
          await RecoverySystem.withRetry(
            async () => {
              const isValid = await SessionManager.validateSession();
              if (!isValid) {
                throw new AuthError('Session validation failed');
              }
            },
            {
              retryConfig: {
                maxAttempts: 3,
                initialDelay: 1000
              }
            }
          );
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    const cleanup = setupAuthListener();
    return () => {
      cleanup();
    };
  }, []);

  const login = useCallback(async (email: string, password: string, remember = false) => {
    logger.debug('Login attempt', { email }, 'AuthContext', 'login');
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!validateEmail(email)) {
        throw new ValidationError('Please enter a valid email address');
      }
      if (!validatePassword(password)) {
        throw new ValidationError('Password must be at least 8 characters long');
      }

      loginRateLimiter.check(email);

      if (import.meta.env.DEV && import.meta.env.VITE_USE_TEST_ACCOUNT === 'true') {
        logger.debug('Using test account', { email: TEST_USER.email });
        setUser(TEST_USER);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: remember
        }
      });

      if (authError) throw new AuthError(authError.message);

      if (data.user) {
        await SessionManager.setSession(data.session!);
        setSession(data.session);
        setUser({
          id: data.user.id,
          email: data.user.email!,
          subscriptionType: 'free'
        });
        loginRateLimiter.reset(email);
        logger.info('Login successful', { userId: data.user.id });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      logger.error('Login failed', err instanceof Error ? err : new Error(message));
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    logger.debug('Registration attempt', { email }, 'AuthContext', 'register');
    setLoading(true);
    setError(null);

    try {
      if (!validateEmail(email)) {
        throw new ValidationError('Please enter a valid email address');
      }
      if (!validatePassword(password)) {
        throw new ValidationError('Password must be at least 8 characters long');
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw new AuthError(authError.message);

      if (data.user) {
        setSession(data.session);
        setUser({
          id: data.user.id,
          email: data.user.email!,
          subscriptionType: 'free'
        });
        logger.info('Registration successful', { userId: data.user.id });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      logger.error('Registration failed', err instanceof Error ? err : new Error(message));
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    logger.debug('Logout attempt', undefined, 'AuthContext', 'logout');
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw new AuthError(authError.message);

      SessionManager.clearSession();
      setUser(null);
      setSession(null);
      logger.info('Logout successful');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      logger.error('Logout failed', err instanceof Error ? err : new Error(message));
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    logger.debug('Password reset request', { email }, 'AuthContext', 'requestPasswordReset');
    setLoading(true);
    setError(null);

    try {
      if (!validateEmail(email)) {
        throw new ValidationError('Please enter a valid email address');
      }

      const { error: authError } = await supabase.auth.resetPasswordForEmail(email);
      if (authError) throw new AuthError(authError.message);

      logger.info('Password reset email sent', { email });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset request failed';
      logger.error('Password reset failed', err instanceof Error ? err : new Error(message));
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    requestPasswordReset,
    refreshSession
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <LoadingSpinner size={32} message="Loading..." />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};