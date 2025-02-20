import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSession } from '../../hooks/useSession';
import { LoadingSpinner } from '../LoadingSpinner';

interface Props {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<Props> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isValid } = useSession({
    onExpire: () => {
      // Session expired, user will be redirected to login
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <LoadingSpinner size={32} message="Loading..." />
      </div>
    );
  }

  if (requireAuth && !user) {
    // Save the attempted URL to redirect back after login
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname + location.search);
    
    return <Navigate to={`${redirectTo}?${searchParams.toString()}`} replace />;
  }

  if (requireAuth && !isValid) {
    return <Navigate to={redirectTo} replace />;
  }

  // Prevent authenticated users from accessing auth pages
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};