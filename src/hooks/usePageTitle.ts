import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Feed - Dogether',
  '/goals': 'My Goals - Dogether',
  '/friends': 'Friends - Dogether',
  '/badges': 'Badges - Dogether',
  '/profile': 'Profile - Dogether',
  '/settings': 'Settings - Dogether',
  '/login': 'Sign In - Dogether',
  '/register': 'Create Account - Dogether',
};

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = pageTitles[path];

    // Handle dynamic routes
    if (!title) {
      if (path.startsWith('/profile/')) {
        title = 'Friend Profile - Dogether';
      } else {
        title = 'Dogether - Social Goals & Tasks';
      }
    }

    document.title = title;
  }, [location.pathname]);
};