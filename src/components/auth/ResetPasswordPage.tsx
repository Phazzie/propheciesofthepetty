import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { PasswordReset } from '../../lib/passwordReset';
import { ValidationUtils } from '../../lib/validation';
import { logger } from '../../lib/logger';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[]
  });

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('Invalid or expired reset link');
        setIsLoading(false);
        return;
      }

      try {
        const isValid = await PasswordReset.validateResetToken(token);
        setIsValid(isValid);
        if (!isValid) {
          setError('Reset link has expired. Please request a new one.');
        }
      } catch (err) {
        logger.error('Token validation failed', err);
        setError('Unable to verify reset link');
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [searchParams]);

  useEffect(() => {
    if (password) {
      const strength = ValidationUtils.checkPasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    const passwordValidation = ValidationUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const result = await PasswordReset.resetPassword(token, password);
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      logger.error('Password reset failed', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    return colors[passwordStrength.score] || colors[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValid && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Link Invalid</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:text-purple-700"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600">
            Your password has been reset. You will be redirected to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-purple-900 mb-6">Reset Your Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {password && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                  />
                </div>
                <ul className="mt-2 space-y-1">
                  {passwordStrength.feedback.map((feedback, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      {feedback}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};