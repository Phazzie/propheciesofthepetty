import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Loader, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { logger } from '../../lib/logger';
import { ValidationError } from '../../lib/errors';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationState {
  email: string[];
  password: string[];
}

export const LoginForm: React.FC = () => {
  const { login, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationState>({
    email: [],
    password: []
  });
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  // Clear errors when form data changes
  useEffect(() => {
    setError(null);
    setValidationErrors({ email: [], password: [] });
  }, [formData.email, formData.password]);

  const validateForm = (): boolean => {
    const errors: ValidationState = { email: [], password: [] };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email.push('Email is required');
    } else if (!emailRegex.test(formData.email)) {
      errors.email.push('Please enter a valid email address');
    }

    if (!formData.password) {
      errors.password.push('Password is required');
    } else if (formData.password.length < 8) {
      errors.password.push('Password must be at least 8 characters');
    }

    setValidationErrors(errors);
    return Object.values(errors).every(field => field.length === 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!validateForm()) {
        return;
      }

      await login(formData.email, formData.password, formData.rememberMe);
    } catch (err) {
      const message = err instanceof ValidationError 
        ? err.message 
        : 'Login failed. Please check your credentials and try again.';
      setError(message);
      logger.error('Login form submission failed', err);
    }
  };

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} />;
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div aria-live="polite" className="sr-only">
          {loading ? 'Signing in...' : error ? 'Login error: ' + error : ''}
        </div>

        <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">
          Sign in
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validationErrors.email.length > 0 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
                required
                aria-invalid={validationErrors.email.length > 0}
                aria-describedby={validationErrors.email.length > 0 ? 'email-error' : undefined}
                disabled={loading}
              />
            </div>
            {validationErrors.email.length > 0 && (
              <div id="email-error" className="mt-1 text-sm text-red-600">
                {validationErrors.email.join(', ')}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`pl-10 pr-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validationErrors.password.length > 0 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                required
                aria-invalid={validationErrors.password.length > 0}
                aria-describedby={validationErrors.password.length > 0 ? 'password-error' : undefined}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.password.length > 0 && (
              <div id="password-error" className="mt-1 text-sm text-red-600">
                {validationErrors.password.join(', ')}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-purple-600 hover:text-purple-700"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          {(error || authError) && (
            <div 
              className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
              role="alert"
            >
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              <p className="text-sm">{error || authError}</p>
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
                <Loader className="w-5 h-5 animate-spin mr-2" aria-hidden="true" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-purple-600 hover:text-purple-700"
                disabled={loading}
              >
                Create account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};