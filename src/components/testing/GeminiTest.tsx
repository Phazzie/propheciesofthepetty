import React, { useState } from 'react';
import { testGeminiTarotKnowledge } from '../../lib/gemini';
import { Loader } from 'lucide-react';

export const GeminiTest: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testKnowledge = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testGeminiTarotKnowledge();
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test Gemini');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={testKnowledge}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Testing Gemini...
            </span>
          ) : (
            'Test Gemini Knowledge'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {response && (
        <div className="prose max-w-none">
          <h2 className="text-xl font-bold text-purple-900 mb-4">Gemini's Response:</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {response.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}