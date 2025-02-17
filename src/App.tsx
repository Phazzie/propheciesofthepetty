import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import ReadingInterface from './components/reading/ReadingInterface';
import { ReadingHistory } from './components/reading/ReadingHistory';
import { UserProfile } from './components/profile/UserProfile';
import { GeminiTest } from './components/testing/GeminiTest';
import { useAuth } from './context/AuthContext';
import { History, PlusCircle, User as UserIcon, Sparkles } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'reading' | 'history' | 'profile' | 'test'>('reading');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">
            Passive-Aggressive Tarot
          </h1>
          <p className="text-lg text-gray-600">
            Where the cards tell you what you need to hear, not what you want to hear.
          </p>
        </div>
        {user ? (
          <>
            <div className="flex justify-end mb-6 gap-4">
              <button
                onClick={() => setCurrentView('test')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'test'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Test AI
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'profile'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                <UserIcon className="w-5 h-5" />
                Profile
              </button>
              <button
                onClick={() => setCurrentView(view => view === 'history' ? 'reading' : 'history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'history'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                {currentView === 'history' ? (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    New Reading
                  </>
                ) : (
                  <>
                    <History className="w-5 h-5" />
                    View History
                  </>
                )}
              </button>
            </div>
            {currentView === 'profile' ? (
              <UserProfile />
            ) : currentView === 'history' ? (
              <ReadingHistory />
            ) : currentView === 'test' ? (
              <GeminiTest />
            ) : (
              <ReadingInterface />
            )}
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="font-sans antialiased text-gray-900 dark:text-white">
          <AppContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;