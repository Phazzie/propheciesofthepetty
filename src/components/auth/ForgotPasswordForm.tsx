import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowLeft, Loader, Mail } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ onBack }) => {
  const { requestPasswordReset, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (_err) {
      setError('Failed to reset password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-purple-600 hover:text-purple-700 p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-purple-900 ml-2">
            Reset Password
          </h2>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
              Password reset instructions have been sent to your email.
            </div>
            <button
              onClick={onBack}
              className="text-purple-600 hover:text-purple-700"
            >
              Return to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Sending...
                </span>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};