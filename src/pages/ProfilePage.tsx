import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Profile from '@/components/Profile/Profile';
import FriendProfile from '@/components/Profile/FriendProfile';
import { useAuth, useAuthActions } from '@/stores/authStore';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuthActions();

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // If no userId or userId matches current user, show own profile
  const isOwnProfile = !userId || userId === user?.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {isOwnProfile ? (
        <Profile onLogout={handleLogout} />
      ) : (
        <FriendProfile friendId={userId!} onBack={handleBack} />
      )}
    </motion.div>
  );
};

export default ProfilePage;