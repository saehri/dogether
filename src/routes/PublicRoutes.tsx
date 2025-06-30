import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoutes = () => {
	const isAuthenticated = useAuth();
	return !isAuthenticated ? <Outlet /> : <Navigate to="/feed" />;
};

export default PublicRoutes;

