import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowLeft, Loader, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { ValidationUtils } from '../../lib/validation';
import { EmailVerification } from '../../lib/emailVerification';
import { logger } from '../../lib/logger';

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

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[]
  });

  useEffect(() => {
    if (formData.password) {
      const { score, feedback } = ValidationUtils.checkPasswordStrength(formData.password);
      setPasswordStrength({ score, feedback });
    }
  }, [formData.password]);

  const validateForm = (): boolean => {
    const emailValidation = ValidationUtils.validateEmail(formData.email);
    const passwordValidation = ValidationUtils.validatePassword(formData.password);
    const confirmValidation = ValidationUtils.validatePasswordConfirmation(
      formData.password,
      formData.confirmPassword
    );
    const termsValidation = ValidationUtils.validateTermsAcceptance(formData.acceptTerms);

    setErrors({
      email: emailValidation.errors,
      password: passwordValidation.errors,
      confirmPassword: confirmValidation.errors,
      terms: termsValidation.errors
    });

    return (
      emailValidation.isValid &&
      passwordValidation.isValid &&
      confirmValidation.isValid &&
      termsValidation.isValid
    );
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

  const getPasswordStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    return colors[passwordStrength.score] || colors[0];
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && (
              <div id="password-strength" className="mt-2">
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
                disabled={loading}
              />
            </div>
            {errors.confirmPassword.length > 0 && (
              <div className="mt-1 text-sm text-red-600">
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
              I accept the terms and conditions
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
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};