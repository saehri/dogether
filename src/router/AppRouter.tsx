import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/Layout/ProtectedRoute';
import AuthRoute from '../components/Layout/AuthRoute';
import LoadingPage from '../components/ui/loading-page';
import { usePageTitle } from '../hooks/usePageTitle';

// Lazy load components for better performance
const FeedPage = lazy(() => import('../pages/FeedPage'));
const GoalsPage = lazy(() => import('../pages/GoalsPage'));
const FriendsPage = lazy(() => import('../pages/FriendsPage'));
const BadgesPage = lazy(() => import('../pages/BadgesPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const Login = lazy(() => import('../components/Auth/Login'));
const Register = lazy(() => import('../components/Auth/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));

interface AppRouterProps {
	isAuthenticated: boolean;
}

const AppRouterContent: React.FC<AppRouterProps> = ({ isAuthenticated }) => {
	usePageTitle();

	return (
		<Suspense fallback={<LoadingPage />}>
			<Routes>
				{/* Auth Routes */}
				<Route
					path="/login"
					element={
						<AuthRoute isAuthenticated={isAuthenticated}>
							<Login />
						</AuthRoute>
					}
				/>
				<Route
					path="/register"
					element={
						<AuthRoute isAuthenticated={isAuthenticated}>
							<Register />
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
					<Route path="goals" element={<GoalsPage />} />
					<Route path="friends" element={<FriendsPage />} />
					<Route path="badges" element={<BadgesPage />} />
					<Route path="profile" element={<ProfilePage />} />
					<Route path="profile/:userId" element={<ProfilePage />} />
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

