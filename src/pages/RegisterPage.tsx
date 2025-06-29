import React from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '@/components/Auth/Register';
import { useAuthActions } from '@/stores/authStore';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthActions();

  const handleRegister = async (userData: { 
    username: string; 
    fullname: string; 
    email: string; 
    password: string; 
    date_of_birth: string; 
  }) => {
    // This would normally make an API call
    // For now, navigate to login with success message
    navigate('/auth/login', { 
      state: { 
        message: 'Registration successful! Please sign in with your new account.' 
      } 
    });
  };

  const handleGoogleRegister = async () => {
    // Simulate Google registration
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
    navigate('/', { replace: true });
  };

  return (
    <Register
      onRegister={handleRegister}
      onGoogleRegister={handleGoogleRegister}
      onNavigateToLogin={() => navigate('/auth/login')}
    />
  );
};

export default RegisterPage;