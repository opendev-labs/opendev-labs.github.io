import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/void/hooks/useAuth';
import { GlobalLoader } from '../features/void/components/common/GlobalLoader';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <GlobalLoader />;
    }

    if (!isAuthenticated) {
        // Redirect to /auth but save the current location they were trying to go to
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
