import React, { useState, useEffect } from 'react';
import { User, Settings, CreditCard, History, Loader, AlertCircle, Moon, Sun, Bell, BellOff, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReadings } from '../../hooks/useDatabase';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import type { Reading } from '../../types';
import type { ThemeType } from '../../contexts/ThemeContext';

interface UserPreferences {
  theme: ThemeType;
  emailNotifications: boolean;
}

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { getUserReadings } = useReadings();
  const { theme, setTheme } = useTheme();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    emailNotifications: true
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      try {
        const [userReadings, { data: prefsData }] = await Promise.all([
          getUserReadings(user.id),
          supabase.from('user_preferences').select('*').eq('user_id', user.id).single()
        ]);
        
        setReadings(userReadings);
        if (prefsData) {
          setPreferences({
            theme: prefsData.theme as ThemeType,
            emailNotifications: prefsData.email_notifications
          });
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, getUserReadings]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      const updatedPrefs = { ...preferences, ...updates };
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        theme: updatedPrefs.theme,
        email_notifications: updatedPrefs.emailNotifications
      });

      if ('theme' in updates) {
        await setTheme(updates.theme as ThemeType);
      }
      
      setPreferences(updatedPrefs);
    } catch (err) {
      console.error('Failed to update preferences:', err);
      setError('Failed to update preferences');
    }
  };

  const handleDataExport = async () => {
    if (!user) return;
    
    try {
      const { data: exportData } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', user.id);

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tarot-readings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
      setError('Failed to export data');
    }
  };

  const handleAccountDeletion = async () => {
    if (!user || !window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    
    try {
      // Delete user data
      await Promise.all([
        supabase.from('readings').delete().eq('user_id', user.id),
        supabase.from('user_preferences').delete().eq('user_id', user.id)
      ]);
      // Delete auth account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteError) throw deleteError;
    } catch (err) {
      console.error('Failed to delete account:', err);
      setError('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-purple-100 p-3 rounded-full">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">{user?.email}</h2>
            <p className="text-gray-600">
              Member since {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-purple-900">Subscription</h3>
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">
              Current Plan: <span className="font-medium">{user?.subscriptionType || 'Free'}</span>
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-purple-900">Readings</h3>
              <History className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">
              Total Readings: <span className="font-medium">{readings.length}</span>
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-purple-900">Settings</h3>
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <button 
              onClick={() => setShowPreferences(!showPreferences)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Manage Preferences
            </button>
          </div>
        </div>

        {showPreferences && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {preferences.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span>Theme</span>
                </div>
                <button
                  onClick={() => updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  {preferences.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {preferences.emailNotifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                  <span>Email Notifications</span>
                </div>
                <button
                  onClick={() => updatePreferences({ emailNotifications: !preferences.emailNotifications })}
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  {preferences.emailNotifications ? 'Turn Off' : 'Turn On'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Export Data</span>
                </div>
                <button
                  onClick={handleDataExport}
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Download JSON
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span className="text-red-600">Delete Account</span>
                </div>
                <button
                  onClick={handleAccountDeletion}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-purple-900 mb-4">Recent Activity</h3>
        {readings.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No readings yet</p>
        ) : (
          <div className="space-y-4">
            {readings.slice(0, 5).map(reading => (
              <div key={reading.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-gray-800">{reading.spreadType} Reading</p>
                  <p className="text-sm text-gray-600">
                    {new Date(reading.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="text-purple-600 hover:text-purple-700">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};