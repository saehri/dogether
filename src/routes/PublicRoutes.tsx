import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoutes = () => {
	const isAuthenticated = useAuth();

	if (!isAuthenticated) return <Navigate to="/login" />;
	return <Navigate to="/feed" />;
};

export default PublicRoutes;

