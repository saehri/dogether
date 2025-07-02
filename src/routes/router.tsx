import { createBrowserRouter } from 'react-router-dom';

import PrivateRoutes from './PrivateRoutes';

import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';

import Feed from '../pages/FeedPage';
import Goals from '../pages/GoalsPage';
import Login from '../pages/LoginPage';
import Badges from '../pages/BadgesPage';
import Profile from '../pages/ProfilePage';
import Friends from '../pages/FriendsPage';
import Register from '../pages/RegisterPage';
import Settings from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
	// Public routes (authentication pages)
	{
		path: '/',
		element: <AuthLayout />,
		children: [
			{ index: true, element: <Login /> }, // Default route shows login
			{ path: 'login', element: <Login /> },
			{ path: 'register', element: <Register /> },
		],
	},
	// Protected routes (main app)
	{
		element: <PrivateRoutes />,
		children: [
			{
				path: '/app',
				element: <AppLayout />,
				children: [
					{ index: true, element: <Feed /> }, // Default app route
					{ path: 'feed', element: <Feed /> },
					{ path: 'goals', element: <Goals /> },
					{ path: 'friends', element: <Friends /> },
					{ path: 'badges', element: <Badges /> },
					{ path: 'profile', element: <Profile /> },
					{ path: 'profile/:userId', element: <Profile /> },
					{ path: 'settings', element: <Settings /> },
				],
			},
		],
	},
	// 404 page
	{
		path: '*',
		element: <NotFoundPage />,
	},
]);