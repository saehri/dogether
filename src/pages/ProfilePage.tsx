import React from 'react';
import { motion } from 'framer-motion';
import { useAuth} from '../stores/authStore';
import { useParams, useNavigate } from 'react-router-dom';

import Profile from '../components/Profile/Profile';
import FriendProfile from '../components/Profile/FriendProfile';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
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
        <Profile />
      ) : (
        <FriendProfile friendId={userId!} onBack={handleBack} />
      )}
    </motion.div>
  );
};

export default ProfilePage;