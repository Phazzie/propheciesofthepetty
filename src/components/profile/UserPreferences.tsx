import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import { Moon, Sun, Bell, Eye } from 'lucide-react';

export const UserPreferences: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [showShadeLevel, setShowShadeLevel] = React.useState(true);

  const handleThemeChange = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  const updatePreference = async (key: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ [key]: value });

      if (error) throw error;

    } catch (err) {
      console.error('Failed to update preference:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
        Preferences
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>Theme</span>
          </div>
          <button
            onClick={handleThemeChange}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Email Notifications</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={emailNotifications}
              onChange={e => {
                setEmailNotifications(e.target.checked);
                updatePreference('email_notifications', e.target.checked);
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Show Shade Level™</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showShadeLevel}
              onChange={e => {
                setShowShadeLevel(e.target.checked);
                updatePreference('show_shade_level', e.target.checked);
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};