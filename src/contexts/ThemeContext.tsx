import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type ThemeType = 'light' | 'dark' | 'retro';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: async () => {}
});

export function ThemeProvider({ children, initialTheme = 'light' }: { children: ReactNode; initialTheme?: string }) {
  const [theme, setThemeState] = useState<ThemeType>(initialTheme);

  const setTheme = async (newTheme: ThemeType) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ theme: newTheme });

      if (error) throw error;
      setThemeState(newTheme);
      
    } catch (err) {
      console.error('Failed to update theme:', err);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);