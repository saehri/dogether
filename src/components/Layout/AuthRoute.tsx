import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, isAuthenticated }) => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    // Redirect to intended page or dashboard
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;