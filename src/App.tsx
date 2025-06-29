import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Feed from './components/Feed/Feed';
import Goals from './components/Goals/Goals';
import Friends from './components/Friends/Friends';
import Badges from './components/Badges/Badges';
import Profile from './components/Profile/Profile';
import CreateTask from './components/CreateTask/CreateTask';

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const handleCreateTask = (task: any) => {
    // This would normally make an API call to your backend
    console.log('Creating task:', task);
  };

  const handleLogoClick = () => {
    setActiveTab('feed');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed />;
      case 'goals':
        return <Goals onCreateTask={() => setIsCreateTaskOpen(true)} />;
      case 'friends':
        return <Friends />;
      case 'badges':
        return <Badges />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
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
          onTabChange={setActiveTab}
        />

        {/* Main Content - Adjusted for fixed sidebar */}
        <main className="flex-1 lg:ml-64 p-6">
          <motion.div
            key={activeTab}
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
  );
}

export default App;