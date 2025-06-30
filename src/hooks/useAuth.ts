import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
	const { isAuthenticated } = useAuthStore();
	return isAuthenticated;
};

