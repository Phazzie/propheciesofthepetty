import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type ThemeType = 'light' | 'dark' | 'retro';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => {}
});

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = 'light' }) => {
  const [theme, setThemeState] = useState<ThemeType>(initialTheme);

  useEffect(() => {
    // Load theme from localStorage first for instant application
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme) {
      setThemeState(savedTheme);
    }

    // Then try to load from Supabase if user is authenticated
    const loadThemePreference = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', session.user.id)
          .single();
        
        if (preferences?.theme) {
          setThemeState(preferences.theme);
          localStorage.setItem('theme', preferences.theme);
        }
      }
    };

    loadThemePreference();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          theme: newTheme,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`
        min-h-screen transition-colors duration-200
        ${theme === 'dark' ? 'dark bg-gray-900 text-white' : ''}
        ${theme === 'light' ? 'bg-white text-gray-900' : ''}
        ${theme === 'retro' ? 'bg-amber-50 text-purple-900' : ''}
      `}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);