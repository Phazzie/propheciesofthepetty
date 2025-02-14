/**
 * Reading history display component
 * @module components/reading/ReadingHistory
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Search, SortDesc, Loader, AlertCircle, Eye } from 'lucide-react';
import { useReadings } from '../../hooks/useDatabase';
import { useAuth } from '../../context/AuthContext';
import { ReadingDetails } from './ReadingDetails';
import type { Reading } from '../../types';

export const ReadingHistory: React.FC = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const { user } = useAuth();
  const { getUserReadings, loading, error } = useReadings();

  useEffect(() => {
    const loadReadings = async () => {
      if (!user) return;
      try {
        const userReadings = await getUserReadings(user.id);
        setReadings(userReadings);
      } catch (err) {
        console.error('Failed to load readings:', err);
      }
    };

    loadReadings();
  }, [user, getUserReadings]);

  const filteredReadings = readings
    .filter(reading => 
      reading.spreadType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.interpretation.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

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
        <p>Failed to load reading history. Please try again later.</p>
      </div>
    );
  }

  if (selectedReading) {
    return (
      <ReadingDetails
        reading={selectedReading}
        onBack={() => setSelectedReading(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-purple-900">Your Reading History</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search readings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setSortOrder(order => order === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SortDesc className={`w-5 h-5 ${sortOrder === 'desc' ? '' : 'rotate-180'}`} />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      {filteredReadings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No readings found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReadings.map((reading) => (
            <div key={reading.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-1">
                    {reading.spreadType} Reading
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(reading.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReading(reading)}
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  View
                </button>
              </div>
              <p className="text-gray-700 line-clamp-3">{reading.interpretation}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                {reading.cards.map((card) => (
                  <span
                    key={`${reading.id}-${card.id}`}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {card.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};