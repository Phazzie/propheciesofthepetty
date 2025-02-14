import React, { useState } from 'react';st-dom';State, useContext, ReactNode } from 'react';
import { Layout } from './components/Layout';ote: changed from server.js to server
import { AuthProvider } from './context/AuthContext';
export const server = setupServer(...handlers);function AppContent() {
  const { user } = useAuth();interface ThemeProviderProps {
  const [currentView, setCurrentView] = useState<'reading' | 'history' | 'profile' | 'test'>('reading');: ReactNode; ❌ User profile
me?: string;- ❌ Subscription management
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">dren, initialTheme = 'light' }) => {
        <div className="text-center mb-12">(initialTheme);
  const accentColor = theme === 'dark' ? '#66B2FF' : '#007BFF'; // Adaptive accentns the same...]
e-Aggressive Tarot
  return (h1>
    <ThemeContext.Provider value={{ theme, setTheme, accentColor }}>-lg text-gray-600">
      <div className={theme === 'dark' ? 'dark:bg-gray-800 min-h-screen' : 'bg-white min-h-screen'}>        Where the cards tell you what you need to hear, not what you want to hear.onents remain the same...]
        {children}        </p>
      </div>        </div>
    </ThemeContext.Provider>




export const useTheme = () => useContext(ThemeContext);};  );        {user ? (
          <>ard flipping
            <div className="flex justify-end mb-6 gap-4">
              <button
                onClick={() => setCurrentView('test')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'test'
                    ? 'bg-purple-600 text-white'ier limitations
                    : 'bg-white text-purple-600 hover:bg-purple-50' hover animations
                }`}
              >yout
                <Sparkles className="w-5 h-5" />
                Test AI
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'profile'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 hover:bg-purple-50'rface`
                }`}
              >ection
                <UserIcon className="w-5 h-5" />tion
                Profilerogress
                onClick={() => setCurrentView(view => view === 'history' ? 'reading' : 'history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'history'
                    ? 'bg-purple-600 text-white'ted cards in grid
                    : 'bg-white text-purple-600 hover:bg-purple-50'tion names
                }`}
                  <>= 'history' ? (
                    <PlusCircle className="w-5 h-5" />n
                    New Reading
                  </>mains the same...]                ) : (                  <>                    <History className="w-5 h-5" />                    View History                  </>                )}              </button>            </div>            {currentView === 'profile' ? (              <UserProfile />            ) : currentView === 'history' ? (              <ReadingHistory />            ) : currentView === 'test' ? (              <GeminiTest />            ) : (              <ReadingInterface />            )}          </>        ) : (          <LoginForm />        )}      </div>    </Layout>  );}function App() {  return (    <ThemeProvider>      <AuthProvider>        <div className="font-sans antialiased text-gray-900 dark:text-white">          <AppContent />        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;