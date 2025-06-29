import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppRouter from './router/AppRouter';
import LoadingSpinner from './components/ui/loading-spinner';
import ErrorBoundary from './components/ui/error-boundary';
import { useStore, useCurrentUser, useLoading, useError } from './store/useStore';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const currentUser = useCurrentUser();
  const isLoading = useLoading();
  const error = useError();
  const { createTask, setError } = useStore();

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      setIsCreateTaskOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // Authentication handlers
  const handleLogin = async (credentials: { email: string; password: string }) => {
    // Simulate login process
    console.log('Login attempt:', credentials);
    // In a real app, you'd validate credentials with your backend
    setIsAuthenticated(true);
  };

  const handleRegister = async (userData: { username: string; fullname: string; email: string; password: string; date_of_birth: string }) => {
    // Simulate registration process
    console.log('Registration attempt:', userData);
    // In a real app, you'd create the user account with your backend
    setIsAuthenticated(true);
  };

  const handleGoogleAuth = async () => {
    // Simulate Google OAuth
    console.log('Google authentication');
    // In a real app, you'd integrate with Google OAuth
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
            className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-white hover:text-gray-200"
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
        onCreateTask={() => setIsCreateTaskOpen(true)}
      />
    </ErrorBoundary>
  );
}

export default App;