import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppRouter from '@/routes';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ui/error-boundary';
import { useAuth, useAuthActions } from '@/stores/authStore';
import { useUI, useUIActions } from '@/stores/uiStore';
import { getAuthToken, removeAuthToken } from '@/utils/api';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated, error: authError } = useAuth();
  const { error: uiError } = useUI();
  const { setAuthenticated } = useAuthActions();
  const { setError: setUIError } = useUIActions();

  // Check for existing auth token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          // In a real app, you'd validate the token with the server
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        removeAuthToken();
        setAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, [setAuthenticated]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (authError || uiError) {
      const timer = setTimeout(() => {
        setUIError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, uiError, setUIError]);

  // Show loading spinner during initialization
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  const displayError = authError || uiError;

  return (
    <ErrorBoundary>
      {/* Global Error Toast */}
      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md"
          >
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span className="flex-1">{displayError}</span>
              <button
                onClick={() => setUIError(null)}
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
      <AppRouter isAuthenticated={isAuthenticated} />
    </ErrorBoundary>
  );
}

export default App;