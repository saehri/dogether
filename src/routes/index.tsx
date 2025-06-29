import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/ui/loading-spinner';

// Lazy load pages
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));

// Protected route wrapper
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // This would check authentication status from your store
//   const isAuthenticated = false; // Replace with actual auth check
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
  
//   return <>{children}</>;
// };

// Auth route wrapper (redirect if already authenticated)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This would check authentication status from your store
  const isAuthenticated = false; // Replace with actual auth check
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: (
      <AuthRoute>
        <AuthLayout />
      </AuthRoute>
    ),
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router