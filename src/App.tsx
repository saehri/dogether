import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppRouter from './router/AppRouter';
import LoadingSpinner from './components/ui/loading-spinner';
import ErrorBoundary from './components/ui/error-boundary';
import { useStore, useCurrentUser, useLoading, useError } from './store/useStore';
import { getAuthToken, removeAuthToken } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const currentUser = useCurrentUser();
  const isLoading = useLoading();
  const error = useError();
  const { createTask, setError, updateUser } = useStore();

  // Check for existing auth token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          // In a real app, you'd validate the token with the server
          // For now, we'll assume it's valid if it exists
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        removeAuthToken();
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Authentication handlers
  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      // The actual API call is handled in the Login component
      // This is called after successful authentication
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login handler error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleRegister = async (userData: { 
    username: string; 
    fullname: string; 
    email: string; 
    password: string; 
    date_of_birth: string; 
  }) => {
    try {
      // The actual API call is handled in the Register component
      // This is called after successful registration
      console.log('Registration completed:', userData);
    } catch (error) {
      console.error('Registration handler error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // In a real app, you'd integrate with Google OAuth
      console.log('Google authentication');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Google auth error:', error);
      setError('Google authentication failed. Please try again.');
    }
  };

  const handleLogout = () => {
    try {
      // Clear auth token and user data
      removeAuthToken();
      setIsAuthenticated(false);
      
      // Reset store to initial state
      // In a real app, you might want to clear sensitive data
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  // Show loading spinner during initialization
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      {/* Global Loading Overlay */}
      {isLoading && <LoadingSpinner />}

      {/* Global Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md"
          >
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-white hover:text-gray-200 transition-colors"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Router */}
      <AppRouter
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGoogleAuth={handleGoogleAuth}
        onLogout={handleLogout}
        onCreateTask={() => {
          // This will be handled by the Layout component
        }}
      />
    </ErrorBoundary>
  );
}

export default App;