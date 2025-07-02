import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoutes = () => {
	const isAuthenticated = useAuth();
	const location = useLocation();

	if (isAuthenticated) {
		// If user is authenticated and trying to access auth pages, redirect to app
		const from = location.state?.from?.pathname || '/app';
		return <Navigate to={from} replace />;
	}

	// If not authenticated, stay on the current auth page
	return null;
};

export default PublicRoutes;