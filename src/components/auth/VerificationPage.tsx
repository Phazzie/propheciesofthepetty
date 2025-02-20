import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { EmailVerification } from '../../lib/emailVerification';
import { logger } from '../../lib/logger';

export const VerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          throw new Error('No verification token provided');
        }

        const result = await EmailVerification.verifyEmail(token);
        if (result.success) {
          setStatus('success');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        logger.error('Email verification failed', err);
        setError(err instanceof Error ? err.message : 'Verification failed');
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {status === 'verifying' && (
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified. You will be redirected to login...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="text-purple-600 hover:text-purple-700"
            >
              Return to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};