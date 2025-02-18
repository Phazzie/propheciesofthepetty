import React from 'react';
import type { Card, ReadingInterpretation } from '../../types';
import { ReadingScores } from './ReadingScores';
import { SPREADS, type SpreadConfig } from './SpreadSelector';

interface Props {
  spreadType: string;
  cards: (Card & { position: number; isReversed: boolean })[];
  interpretation?: ReadingInterpretation;
  onQuestionSubmit?: (question: string) => void;
}

const getPositionName = (spreadType: string, position: number): string => {
  const spread = SPREADS.find((s: SpreadConfig) => s.id === spreadType);
  if (spread && spread.positions[position]) {
    return `${spread.positions[position].name} - ${spread.positions[position].description}`;
  }
  return '';
};

export const ReadingLayout: React.FC<Props> = ({
  spreadType,
  cards,
  interpretation,
  onQuestionSubmit
}) => {
  const [question, setQuestion] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onQuestionSubmit && question.trim()) {
      onQuestionSubmit(question.trim());
    }
  };

  return (
    <div className="space-y-8">
      {/* Question input section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="question" className="block text-lg font-semibold text-purple-900">
            What's on your mind? (But like, actually?)
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Tell us what's bothering you (we already know, but let's pretend)"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            disabled={!question.trim()}
          >
            Ask Away
          </button>
        </form>
      </div>

      {/* Card layout section */}
      <div className={`grid gap-4 ${
        spreadType === 'celtic-cross' 
          ? 'grid-cols-4 grid-rows-4'
          : 'grid-cols-3'
      }`}>
        {cards.map((card, index) => (
          <div key={index} className="relative">
            <div 
              className={`aspect-[2/3] bg-purple-100 rounded-lg p-4 ${
                card.isReversed ? 'transform rotate-180' : ''
              }`}
              data-testid={card.isReversed ? 'reversed-card' : undefined}
            >
              <div className={`text-center ${card.isReversed ? 'transform rotate-180' : ''}`}>
                <h3 className="font-medium text-purple-900">{card.name}</h3>
                {card.isReversed && (
                  <span className="text-sm text-purple-600">(Reversed)</span>
                )}
                <div className="mt-2 text-sm text-purple-700">
                  {getPositionName(spreadType, card.position)}
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Empty positions */}
        {Array.from({ length: (spreadType === 'celtic-cross' ? 10 : 3) - cards.length }).map((_, i) => (
          <div key={`empty-${i}`} className="relative">
            <div 
              className="aspect-[2/3] bg-purple-100 rounded-lg flex items-center justify-center"
              role="img"
              aria-label="empty position"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-purple-300 lucide lucide-help-circle"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="presentation"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      {/* Reading interpretation and scores */}
      {interpretation && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Your Reading</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{interpretation.text}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ReadingScores interpretation={interpretation} />
          </div>
        </div>
      )}
    </div>
  );
};