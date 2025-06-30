import { createBrowserRouter } from 'react-router-dom';

import PublicRoutes from './PublicRoutes';
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

export const router = createBrowserRouter([
	{
		element: <PublicRoutes />,
		children: [
			{
				path: '/',
				element: <AuthLayout />,
				children: [
					{ path: '/login', element: <Login /> },
					{ path: '/register', element: <Register /> },
				],
			},
		],
	},
	{
		element: <PrivateRoutes />,
		children: [
			{
				path: '/',
				element: <AppLayout />,
				children: [
					{ path: '/feed', element: <Feed /> },
					{ path: '/goals', element: <Goals /> },
					{ path: '/friends', element: <Friends /> },
					{ path: '/badges', element: <Badges /> },
					{ path: '/profile', element: <Profile /> },
					{ path: '/settings', element: <Settings /> },
				],
			},
		],
	},
]);

