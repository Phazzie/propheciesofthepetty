import { supabase } from '../lib/supabase';
import type { User } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AuthError, ValidationError } from '../lib/errors';
import { logger } from '../lib/logger';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      logger.debug('Checking auth session', undefined, 'AuthContext', 'checkSession');
      try {
        if (import.meta.env.DEV && import.meta.env.VITE_USE_TEST_ACCOUNT === 'true') {
          logger.debug('Using test account', { email: TEST_USER.email });
          setUser(TEST_USER);
          setLoading(false);
          return;
        }
      } catch (err) {
        logger.error('Session check failed', err);
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
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

      if (import.meta.env.DEV && import.meta.env.VITE_USE_TEST_ACCOUNT === 'true') {
        logger.debug('Using test account', { email: TEST_USER.email });
        setUser(TEST_USER);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw new AuthError(authError.message);

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          subscriptionType: 'free'
        });
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

      setUser(null);
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
    user,
    loading,
    error,
    login,
    register,
    logout,
    requestPasswordReset
  };

  if (loading) {
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