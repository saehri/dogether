import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Feed from './components/Feed/Feed';
import Goals from './components/Goals/Goals';
import Friends from './components/Friends/Friends';
import Badges from './components/Badges/Badges';
import Profile from './components/Profile/Profile';
import FriendProfile from './components/Profile/FriendProfile';
import Settings from './components/Settings/Settings';
import CreateTask from './components/CreateTask/CreateTask';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import LoadingSpinner from './components/ui/loading-spinner';
import ErrorBoundary from './components/ui/error-boundary';
import { useStore, useCurrentUser, useLoading, useError } from './store/useStore';

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [viewingFriendId, setViewingFriendId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to false to show auth pages
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

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

  const handleLogoClick = () => {
    setActiveTab('feed');
    setViewingFriendId(null);
  };

  const handleProfileClick = (userId: string) => {
    if (userId === currentUser.id) {
      setActiveTab('profile');
      setViewingFriendId(null);
    } else {
      setViewingFriendId(userId);
      setActiveTab('friend-profile');
    }
  };

  const handleBackToFeed = () => {
    setActiveTab('feed');
    setViewingFriendId(null);
  };

  // Authentication handlers
  const handleLogin = async (credentials: { email: string; password: string }) => {
    // Simulate login process
    console.log('Login attempt:', credentials);
    // In a real app, you'd validate credentials with your backend
    setIsAuthenticated(true);
    setActiveTab('feed');
  };

  const handleRegister = async (userData: { name: string; username: string; email: string; password: string }) => {
    // Simulate registration process
    console.log('Registration attempt:', userData);
    // In a real app, you'd create the user account with your backend
    setIsAuthenticated(true);
    setActiveTab('feed');
  };

  const handleGoogleAuth = async () => {
    // Simulate Google OAuth
    console.log('Google authentication');
    // In a real app, you'd integrate with Google OAuth
    setIsAuthenticated(true);
    setActiveTab('feed');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('login');
    setActiveTab('feed');
    setViewingFriendId(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed onProfileClick={handleProfileClick} />;
      case 'goals':
        return <Goals onCreateTask={() => setIsCreateTaskOpen(true)} />;
      case 'friends':
        return <Friends />;
      case 'badges':
        return <Badges />;
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      case 'friend-profile':
        return viewingFriendId ? (
          <FriendProfile 
            friendId={viewingFriendId} 
            onBack={handleBackToFeed}
          />
        ) : <Feed onProfileClick={handleProfileClick} />;
      case 'settings':
        return <Settings />;
      default:
        return <Feed onProfileClick={handleProfileClick} />;
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

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {authView === 'login' ? (
            <Login
              key="login"
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleAuth}
              onNavigateToRegister={() => setAuthView('register')}
            />
          ) : (
            <Register
              key="register"
              onRegister={handleRegister}
              onGoogleRegister={handleGoogleAuth}
              onNavigateToLogin={() => setAuthView('login')}
            />
          )}
        </AnimatePresence>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
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

        {/* Header */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onCreateTask={() => setIsCreateTaskOpen(true)}
          onProfileClick={() => setActiveTab('profile')}
          onLogoClick={handleLogoClick}
        />

        <div className="flex">
          {/* Sidebar - Always Fixed */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setViewingFriendId(null);
            }}
          />

          {/* Main Content - Adjusted for fixed sidebar */}
          <main className="flex-1 lg:ml-64 p-6">
            <motion.div
              key={activeTab + (viewingFriendId || '')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>

        {/* Create Task Modal */}
        <AnimatePresence>
          {isCreateTaskOpen && (
            <CreateTask
              isOpen={isCreateTaskOpen}
              onClose={() => setIsCreateTaskOpen(false)}
              onCreateTask={handleCreateTask}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;