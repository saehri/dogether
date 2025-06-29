import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import AuthRoute from '@/components/Layout/AuthRoute';
import LoadingPage from '@/components/ui/loading-page';
import { usePageTitle } from '@/hooks/usePageTitle';

// Lazy load components for better performance
const FeedPage = lazy(() => import('@/pages/FeedPage'));
const GoalsPage = lazy(() => import('@/pages/GoalsPage'));
const FriendsPage = lazy(() => import('@/pages/FriendsPage'));
const BadgesPage = lazy(() => import('@/pages/BadgesPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const Login = lazy(() => import('@/components/Auth/Login'));
const Register = lazy(() => import('@/components/Auth/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));

interface AppRouterProps {
  isAuthenticated: boolean;
  onLogin: (credentials: { email: string; password: string }) => void;
  onRegister: (userData: { username: string; fullname: string; email: string; password: string; date_of_birth: string }) => void;
  onGoogleAuth: () => void;
  onLogout: () => void;
  onCreateTask: () => void;
}

const AppRouterContent: React.FC<AppRouterProps> = ({
  isAuthenticated,
  onLogin,
  onRegister,
  onGoogleAuth,
  onLogout,
  onCreateTask
}) => {
  usePageTitle();

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <Login
                onLogin={onLogin}
                onGoogleLogin={onGoogleAuth}
                onNavigateToRegister={() => window.location.href = '/register'}
              />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <Register
                onRegister={onRegister}
                onGoogleRegister={onGoogleAuth}
                onNavigateToLogin={() => window.location.href = '/login'}
              />
            </AuthRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FeedPage />} />
          <Route path="goals" element={<GoalsPage onCreateTask={onCreateTask} />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="badges" element={<BadgesPage />} />
          <Route path="profile" element={<ProfilePage onLogout={onLogout} />} />
          <Route path="profile/:userId" element={<ProfilePage onLogout={onLogout} />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const AppRouter: React.FC<AppRouterProps> = (props) => {
  return (
    <BrowserRouter>
      <AppRouterContent {...props} />
    </BrowserRouter>
  );
};

export default AppRouter;