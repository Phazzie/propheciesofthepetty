import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Loader, Mail } from 'lucide-react';
import { PasswordReset } from '../../lib/passwordReset';
import { ValidationUtils } from '../../lib/validation';
import { logger } from '../../lib/logger';

interface Props {
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, error: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const emailValidation = ValidationUtils.validateEmail(email);
    if (!emailValidation.isValid) {
      setValidation({ isValid: false, error: emailValidation.errors[0] });
      return;
    }

    setLoading(true);
    try {
      await PasswordReset.initiateReset(email);
      setSuccess(true);
      logger.info('Password reset requested', { email });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset instructions';
      setError(message);
      logger.error('Password reset request failed', err);
    } finally {
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
            aria-label="Go back"
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
              Please check your inbox and follow the instructions.
            </div>
            <button
              onClick={onBack}
              className="text-purple-600 hover:text-purple-700"
            >
              Return to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidation({ isValid: true, error: '' });
                  }}
                  className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    !validation.isValid || error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  required
                  aria-invalid={!validation.isValid || !!error}
                  aria-describedby={(!validation.isValid || error) ? 'email-error' : undefined}
                  disabled={loading}
                />
              </div>
              {!validation.isValid && (
                <div id="email-error" className="mt-1 text-sm text-red-600">
                  {validation.error}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg" role="alert">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={loading}
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