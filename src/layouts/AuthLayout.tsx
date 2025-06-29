import React from 'react';
import { Outlet } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';

const AuthLayout: React.FC = () => {
  usePageTitle();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <Outlet />
    </div>
  );
};

export default AuthLayout;