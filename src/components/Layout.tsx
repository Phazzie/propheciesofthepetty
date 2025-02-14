import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="w-6 h-6 text-purple-600" />
              <span className="ml-2 text-xl font-semibold text-purple-900">
                Passive-Aggressive Tarot
              </span>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="ml-2 text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-1">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Passive-Aggressive Tarot. All rights reserved.
            <br />
            <span className="text-xs">
              The cards may judge you, but they mean well. Mostly.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};