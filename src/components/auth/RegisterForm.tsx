import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowLeft, Loader, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { logger } from '../../lib/logger';
import { EmailVerification } from '../../lib/emailVerification';

interface Props {
  onBack: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  email: string[];
  password: string[];
  confirmPassword: string[];
  terms: string[];
}

export const RegisterForm: React.FC<Props> = ({ onBack }) => {
  const { register, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: [],
    password: [],
    confirmPassword: [],
    terms: []
  });

  useEffect(() => {
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ['Passwords do not match']
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: []
      }));
    }
  }, [formData.password, formData.confirmPassword]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (!password) {
      errors.push('Password is required');
      return errors;
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain one number');
    }
    return errors;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: [],
      password: [],
      confirmPassword: [],
      terms: []
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email.push('Email is required');
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email.push('Please enter a valid email address');
    }

    newErrors.password = validatePassword(formData.password);

    if (!formData.confirmPassword) {
      newErrors.confirmPassword.push('Please confirm your password');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword.push('Passwords do not match');
    }

    if (!formData.acceptTerms) {
      newErrors.terms.push('You must accept the terms and conditions');
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(field => field.length === 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.email, formData.password);
      await EmailVerification.sendVerificationEmail(formData.email);
      logger.info('Registration successful, verification email sent', { email: formData.email });
    } catch (err) {
      logger.error('Registration failed', err);
      const message = err instanceof Error ? err.message : 'Registration failed';
      setErrors(prev => ({
        ...prev,
        email: [message]
      }));
    }
  };

  const getPasswordStrengthColor = (errors: string[]) => {
    const score = 4 - errors.length;
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    return colors[score] || colors[0];
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-purple-600 hover:text-purple-700 p-2 -ml-2"
            aria-label="Go back"
            type="button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-purple-900 ml-2">Create Account</h2>
        </div>

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
                  errors.email.length > 0 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
                required
                aria-invalid={errors.email.length > 0}
                aria-describedby={errors.email.length > 0 ? 'email-error' : undefined}
                disabled={loading}
              />
            </div>
            {errors.email.length > 0 && (
              <div id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email.join(', ')}
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
                  errors.password.length > 0 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                required
                aria-invalid={errors.password.length > 0}
                aria-describedby="password-strength"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="show password"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && (
              <div id="password-strength" className="mt-2">
                {errors.password.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {errors.password.map((error, index) => (
                      <li key={index} className="text-sm text-red-600">{error}</li>
                    ))}
                  </ul>
                )}
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPasswordStrengthColor(errors.password)} transition-all duration-300`}
                    style={{ width: `${(4 - errors.password.length) * 25}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.confirmPassword.length > 0 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                required
                aria-invalid={errors.confirmPassword.length > 0}
                aria-describedby={errors.confirmPassword.length > 0 ? 'confirm-password-error' : undefined}
                disabled={loading}
              />
            </div>
            {errors.confirmPassword.length > 0 && (
              <div id="confirm-password-error" className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.join(', ')}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className={`rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${
                errors.terms.length > 0 ? 'border-red-500' : ''
              }`}
              disabled={loading}
            />
            <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
              Terms and conditions
            </label>
          </div>
          {errors.terms.length > 0 && (
            <div className="text-sm text-red-600">{errors.terms.join(', ')}</div>
          )}

          {authError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg" role="alert">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{authError}</p>
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
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};