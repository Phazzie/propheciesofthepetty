import React, { createContext, ReactNode } from 'react';

export const ReadingContext = createContext<any>(null);

interface ReadingProviderProps {
  children: ReactNode;
}

export const ReadingProvider = ({ children }: ReadingProviderProps) => {
  // Minimal implementation; add real logic as required
  return (
    <ReadingContext.Provider value={{}}>
      {children}
    </ReadingContext.Provider>
  );
};
