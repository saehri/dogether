import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '@/components/Auth/Login';
import { useAuthActions } from '@/stores/authStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthActions();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (credentials: { email: string; password: string }) => {
    // This would normally make an API call
    // For now, simulate successful login
    const mockUser = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: credentials.email,
      avatar: '',
      badges: [],
      friends: []
    };

    login(mockUser, 'mock-token');
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = async () => {
    // Simulate Google login
    const mockUser = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatar: '',
      badges: [],
      friends: []
    };

    login(mockUser, 'mock-token');
    navigate(from, { replace: true });
  };

  return (
    <Login
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onNavigateToRegister={() => navigate('/auth/register')}
    />
  );
};

export default LoginPage;