import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Profile from '@/components/Profile/Profile';
import FriendProfile from '@/components/Profile/FriendProfile';
import { useCurrentUser } from '@/store/useStore';

interface ProfilePageProps {
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const handleBack = () => {
    navigate('/');
  };

  // If no userId or userId matches current user, show own profile
  const isOwnProfile = !userId || userId === currentUser.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {isOwnProfile ? (
        <Profile onLogout={onLogout} />
      ) : (
        <FriendProfile friendId={userId!} onBack={handleBack} />
      )}
    </motion.div>
  );
};

export default ProfilePage;