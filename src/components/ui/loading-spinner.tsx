import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="relative">
          <div className="w-8 h-8 border-4 border-purple-200 rounded-full"></div>
          <motion.div
            className="absolute inset-0 w-8 h-8 border-4 border-purple-600 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="text-gray-700 font-medium">Loading...</span>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;