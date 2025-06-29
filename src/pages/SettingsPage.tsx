import React from 'react';
import { motion } from 'framer-motion';
import Settings from '@/components/Settings/Settings';

const SettingsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Settings />
    </motion.div>
  );
};

export default SettingsPage;