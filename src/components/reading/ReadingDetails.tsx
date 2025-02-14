import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { SpreadLayout } from './SpreadLayout';
import type { Reading } from '../../types';

interface Props {
  reading: Reading;
  onBack: () => void;
}

export const ReadingDetails: React.FC<Props> = ({ reading, onBack }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to History
        </button>
        <div className="flex items-center text-gray-500">
          <Calendar className="w-5 h-5 mr-2" />
          {new Date(reading.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-900 mb-2">
          {reading.spreadType} Reading
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <SpreadLayout
          spreadType={reading.spreadType.toLowerCase().replace(/\s+/g, '-')}
          cards={reading.cards}
          isRevealed={true}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-purple-900 mb-4">
          Your Interpretation
        </h3>
        <div className="prose max-w-none">
          {reading.interpretation.split('\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-purple-900 mb-4">
          Cards in Your Reading
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reading.cards.map((card, index) => (
            <div key={card.id} className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-1">
                Position {index + 1}: {card.name}
              </h4>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};