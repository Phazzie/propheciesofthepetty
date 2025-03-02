import React, { ReactNode } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { vi } from 'vitest';

// Mock default auth context values
const mockAuthContext = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn(),
  updateProfile: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  requestPasswordReset: vi.fn(),
  refreshSession: vi.fn(),
  error: null,
};

// Get any other context providers that might be needed
// Based on the task, we need to find ReadingProvider
// This is a placeholder that you'll need to update with the actual import
// import { ReadingProvider } from '../context/ReadingContext';

interface TestContextProviderProps {
  children: ReactNode;
  authContext?: typeof mockAuthContext;
  // Add other context override props as needed
  // readingContext?: typeof mockReadingContext;
}

/**
 * A centralized test context provider that wraps all required context providers
 * for testing components. This ensures consistent context provisioning across tests.
 * 
 * @example
 * // Basic usage
 * render(
 *   <TestContextProvider>
 *     <ComponentUnderTest />
 *   </TestContextProvider>
 * );
 * 
 * // With custom auth context
 * render(
 *   <TestContextProvider authContext={{ ...mockAuthContext, isAuthenticated: true }}>
 *     <ComponentUnderTest />
 *   </TestContextProvider>
 * );
 */
export function TestContextProvider({
  children,
  authContext = mockAuthContext,
  // Add other context props with defaults
}: TestContextProviderProps) {
  return (
    <ThemeProvider>
      <AuthContext.Provider value={authContext}>
        {/* Add other context providers here as needed */}
        {/* <ReadingProvider> */}
        {children}
        {/* </ReadingProvider> */}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

// Helper function to render components with the TestContextProvider
export function renderWithTestContext(ui: React.ReactElement, options?: {
  authContext?: typeof mockAuthContext;
  // Add other context options here
}) {
  const { render } = require('@testing-library/react');
  
  return render(
    <TestContextProvider
      authContext={options?.authContext}
      // Add other context options here
    >
      {ui}
    </TestContextProvider>
  );
}

// Export the mock context values for direct use in tests
export { mockAuthContext };