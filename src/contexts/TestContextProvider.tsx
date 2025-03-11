import React, { ReactNode, useState } from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { ReadingProvider } from '../context/ReadingProvider';
import { createMockCard, createMockInterpretation } from '../test/helpers';
import type { Card, SpreadType, ReadingInterpretation } from '../types';
import { render } from '@testing-library/react';
import { vi } from 'vitest'; // Explicit import for testing utilities

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
 * It separates initialization of default mock values for Auth, Reading, and Theme contexts
 * and includes explicit comments on the purpose of each section along with proper testing utility imports.
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

  // ----- Auth Context Initialization -----
  // Initialize default mock values for authentication. Merges default values with any overrides provided in mockAuthValues.
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

  // ----- Reading Context Initialization -----
  // Initialize default mock values for reading functionality. Merges default values with any overrides provided in mockReadingValues.
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

  // ----- Theme Context Initialization -----
  // Initialize theme-related state with provided mock values for dark and purple modes.
  const [isDarkMode, setIsDarkMode] = useState(mockThemeValues?.isDarkMode || false);
  const [isPurpleMode, setIsPurpleMode] = useState(mockThemeValues?.isPurpleMode ?? true);

  // Define theme context value with toggle functions
  const themeContextValue = {
    isDarkMode,
    isPurpleMode,
    toggleDarkMode: () => setIsDarkMode(prev => !prev),
    togglePurpleMode: () => setIsPurpleMode(prev => !prev)
  };

  // TODO: Consider adding fallback behaviors or error logging if mock values are misconfigured.

  return (
    // Providing theme context. If ThemeProvider supports a value prop, consider passing themeContextValue.
    <ThemeProvider initialTheme={isDarkMode ? 'dark' : 'light'}>
      {/* AuthProvider could be further refactored to accept defaultAuthMock via context if desired */}
      <AuthProvider>
        {/* ReadingProvider could similarly be adjusted to accept defaultReadingMock */}
        <ReadingProvider>
          {children}
        </ReadingProvider>
      </AuthProvider>
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
