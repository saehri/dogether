import React from 'react';
import { motion } from 'framer-motion';
import Goals from '@/components/Goals/Goals';
import { useUIActions } from '@/stores/uiStore';

const GoalsPage: React.FC = () => {
  const { setCreateTaskModalOpen } = useUIActions();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Goals onCreateTask={() => setCreateTaskModalOpen(true)} />
    </motion.div>
  );
};

export default GoalsPage;