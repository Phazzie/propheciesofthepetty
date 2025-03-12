import { render, RenderResult } from '@testing-library/react';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { Card, ReadingInterpretation, SpreadType, SubscriptionType } from '../types';

// Mock Reading Context
interface ReadingContextType {
  cards: Card[];
  spreadType: SpreadType | null;
  interpretation: ReadingInterpretation | null;
  isRevealed: boolean;
  isLoading: boolean;
  error: string | null;
  setCards: (cards: Card[]) => void;
  setSpreadType: (type: SpreadType | null) => void;
  setInterpretation: (interpretation: ReadingInterpretation | null) => void;
  setIsRevealed: (isRevealed: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const ReadingContext = createContext<ReadingContextType | null>(null);

export const useReadingContext = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReadingContext must be used within a ReadingProvider');
  }
  return context;
};

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
}

const MockReadingProvider: React.FC<{ children: ReactNode; initialValues?: TestContextProviderProps['mockReadingValues'] }> = ({
  children,
  initialValues = {}
}) => {
  const [cards, setCards] = useState<Card[]>(initialValues.cards || []);
  const [spreadType, setSpreadType] = useState<SpreadType | null>(initialValues.spreadType || null);
  const [interpretation, setInterpretation] = useState<ReadingInterpretation | null>(initialValues.interpretation || null);
  const [isRevealed, setIsRevealed] = useState(initialValues.isRevealed || false);
  const [isLoading, setIsLoading] = useState(initialValues.isLoading || false);
  const [error, setError] = useState<string | null>(initialValues.error || null);

  const value: ReadingContextType = {
    cards,
    spreadType,
    interpretation,
    isRevealed,
    isLoading,
    error,
    setCards,
    setSpreadType,
    setInterpretation,
    setIsRevealed,
    setIsLoading,
    setError
  };

  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
};

export const TestContextProvider: React.FC<TestContextProviderProps> = ({ 
  children, 
  mockAuthValues = {},
  mockReadingValues = {}
}) => {
  // Auth context setup
  const authContextValue = {
    user: mockAuthValues.user ? {
      ...mockAuthValues.user,
      subscriptionType: 'free' as SubscriptionType
    } : null,
    loading: mockAuthValues.loading || false,
    error: mockAuthValues.error || null,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    requestPasswordReset: async () => {}
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <MockReadingProvider initialValues={mockReadingValues}>
        {children}
      </MockReadingProvider>
    </AuthContext.Provider>
  );
};

/**
 * Renders a component with all necessary test contexts and providers.
 * @param ui - The React component to render
 * @param options - Configuration options for mock values in test contexts
 * @returns The rendered component with all testing utilities from @testing-library/react
 */
export const renderWithTestContext = (
  ui: React.ReactElement,
  options: Omit<TestContextProviderProps, 'children'> = {}
): RenderResult => {
  return render(
    <TestContextProvider {...options}>
      {ui}
    </TestContextProvider>
  );
};
