import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RouteConfig } from '@/types';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import AuthRoute from '@/components/Layout/AuthRoute';
import Layout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import LoadingPage from '@/components/ui/loading-page';
import ErrorBoundary from '@/components/ui/error-boundary';

// Lazy load pages for better performance
const FeedPage = lazy(() => import('@/pages/FeedPage'));
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const FriendsPage = lazy(() => import('@/pages/FriendsPage'));
const BadgesPage = lazy(() => import('@/pages/BadgesPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

interface AppRouterProps {
  isAuthenticated: boolean;
}

const createAppRouter = (isAuthenticated: boolean) => {
  return createBrowserRouter([
    {
      path: '/',
      element: (
        <ErrorBoundary>
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout />
          </ProtectedRoute>
        </ErrorBoundary>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <FeedPage />
            </Suspense>
          ),
        },
        {
          path: 'goals',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <GoalsPage />
            </Suspense>
          ),
        },
        {
          path: 'friends',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <FriendsPage />
            </Suspense>
          ),
        },
        {
          path: 'badges',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <BadgesPage />
            </Suspense>
          ),
        },
        {
          path: 'profile',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ProfilePage />
            </Suspense>
          ),
        },
        {
          path: 'profile/:userId',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ProfilePage />
            </Suspense>
          ),
        },
        {
          path: 'settings',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <SettingsPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '/auth',
      element: (
        <ErrorBoundary>
          <AuthRoute isAuthenticated={isAuthenticated}>
            <AuthLayout />
          </AuthRoute>
        </ErrorBoundary>
      ),
      children: [
        {
          path: 'login',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <LoginPage />
            </Suspense>
          ),
        },
        {
          path: 'register',
          element: (
            <Suspense fallback={<LoadingPage />}>
              <RegisterPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<LoadingPage />}>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ]);
};

const AppRouter: React.FC<AppRouterProps> = ({ isAuthenticated }) => {
  const router = createAppRouter(isAuthenticated);

  return <RouterProvider router={router} />;
};

export default AppRouter;