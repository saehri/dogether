import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

const PrivateRoutes = () => {
	const isAuthenticated = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		// Save the attempted location for redirecting after login
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <Outlet />;
};

export default PrivateRoutes;