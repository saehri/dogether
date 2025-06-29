import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { tasks } from '@/data/mockData';
import FeedCard from './FeedCard';

const Feed: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Your Social Feed
        </h2>
        <p className="text-gray-600">See what your friends are achieving</p>
      </motion.div>

      <div className="space-y-6">
        {tasks.map((task, index) => (
          <FeedCard key={task.id} task={task} index={index} />
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8"
      >
        <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
          Load more posts
        </Button>
      </motion.div>
    </div>
  );
};

export default Feed;