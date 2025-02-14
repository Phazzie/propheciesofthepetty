import React, { useState, useEffect } from 'react';
import { User, Settings, CreditCard, History, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReadings } from '../../hooks/useDatabase';
import type { Reading } from '../../types';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { getUserReadings } = useReadings();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      try {
        const userReadings = await getUserReadings(user.id);
        setReadings(userReadings);
      } catch {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, getUserReadings]);

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
            <button className="text-sm text-purple-600 hover:text-purple-700">
              Manage Preferences
            </button>
          </div>
        </div>
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