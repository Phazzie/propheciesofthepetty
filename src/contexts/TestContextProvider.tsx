import React, { ReactNode, useState } from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { ReadingProvider } from '../context/ReadingProvider';
import { createMockCard, createMockInterpretation, createMockSpread } from '../test/helpers';
import type { Card, SpreadType, ReadingInterpretation } from '../types';

interface TestContextProviderProps {
  children: ReactNode;
  mockAuthValues?: {
    isAuthenticated?: boolean;
    user?: {
      id: string;
      email: string;
      username?: string;
    } | null;
    loading?: boolean;
    error?: string | null;
  };
  mockReadingValues?: {
    cards?: Card[];
    spreadType?: SpreadType;
    interpretation?: ReadingInterpretation;
    isRevealed?: boolean;
    isLoading?: boolean;
    error?: string | null;
  };
  mockThemeValues?: {
    isDarkMode?: boolean;
    isPurpleMode?: boolean;
  };
}

/**
 * A centralized provider for test contexts that wraps all application contexts
 * with customizable mock values for testing purposes.
 * 
 * @param props - Configuration options including mock values for auth, reading, and theme contexts
 * @returns Provider component with all necessary context for testing
 */
export const TestContextProvider: React.FC<TestContextProviderProps> = ({ 
  children, 
  mockAuthValues = {},
  mockReadingValues = {},
  mockThemeValues = {}
}) => {
  // Default mock values for auth
  const defaultAuthMock = {
    isAuthenticated: true,
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      username: 'testuser'
    },
    loading: false,
    error: null,
    login: vi.fn().mockResolvedValue({}),
    register: vi.fn().mockResolvedValue({}),
    logout: vi.fn().mockResolvedValue({}),
    resetPassword: vi.fn().mockResolvedValue({}),
    updateProfile: vi.fn().mockResolvedValue({}),
    ...mockAuthValues
  };

  // Default mock values for reading
  const defaultReadingMock = {
    cards: Array(3).fill(0).map((_, i) => createMockCard(i)),
    spreadType: 'past-present-future' as SpreadType,
    interpretation: createMockInterpretation(),
    isRevealed: true,
    isLoading: false,
    error: null,
    selectSpread: vi.fn(),
    drawCards: vi.fn().mockResolvedValue([]),
    revealCards: vi.fn(),
    resetReading: vi.fn(),
    ...mockReadingValues
  };

  // Mock theme values and functions
  const [isDarkMode, setIsDarkMode] = useState(mockThemeValues?.isDarkMode || false);
  const [isPurpleMode, setIsPurpleMode] = useState(mockThemeValues?.isPurpleMode || true);

  // Create custom theme context values
  const themeContextValue = {
    isDarkMode,
    isPurpleMode,
    toggleDarkMode: () => setIsDarkMode(!isDarkMode),
    togglePurpleMode: () => setIsPurpleMode(!isPurpleMode)
  };

  // Custom implementation of AuthProvider for tests
  const MockAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <AuthProvider value={defaultAuthMock}>
        {children}
      </AuthProvider>
    );
  };

  // Custom implementation of ReadingProvider for tests
  const MockReadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <ReadingProvider value={defaultReadingMock}>
        {children}
      </ReadingProvider>
    );
  };

  return (
    <ThemeProvider value={themeContextValue}>
      <MockAuthProvider>
        <MockReadingProvider>
          {children}
        </MockReadingProvider>
      </MockAuthProvider>
    </ThemeProvider>
  );
};

/**
 * A utility function to render components with all necessary test contexts
 * 
 * @param ui - The component to render
 * @param options - Configuration options including mock values for contexts
 * @returns The rendered component with testing utilities
 */
export const renderWithTestContext = (
  ui: React.ReactElement,
  options: Omit<TestContextProviderProps, 'children'> = {}
) => {
  return render(
    <TestContextProvider {...options}>
      {ui}
    </TestContextProvider>
  );
};
