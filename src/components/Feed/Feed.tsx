import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import { useTasks } from '@/store/useStore';
import FeedCard from './FeedCard';
import { cn } from '@/lib/utils';

interface FeedProps {
  onProfileClick: (userId: string) => void;
}

const Feed: React.FC<FeedProps> = ({ onProfileClick }) => {
  const tasks = useTasks();

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
        <p className={cn(
          "text-gray-600 dark:text-gray-300"
        )}>
          See what your friends are achieving
        </p>
      </motion.div>

      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                "text-gray-900 dark:text-gray-100"
              )}>
                Welcome to Dogether!
              </h3>
              <p className={cn(
                "mb-6 leading-relaxed",
                "text-gray-600 dark:text-gray-300"
              )}>
                Your feed is empty right now. Start by creating your first goal or task, and connect with friends to see their achievements here.
              </p>
              <div className="space-y-3">
                <Button 
                  variant="gradient" 
                  className="w-full flex items-center space-x-2"
                  onClick={() => {
                    // This would trigger the create task modal
                    const createButton = document.querySelector('[data-create-task]') as HTMLButtonElement;
                    createButton?.click();
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Goal</span>
                </Button>
                <p className={cn(
                  "text-sm",
                  "text-gray-500 dark:text-gray-400"
                )}>
                  Or add friends to see their progress
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {tasks.map((task, index) => (
            <FeedCard 
              key={task.id} 
              task={task} 
              index={index} 
              onProfileClick={onProfileClick}
            />
          ))}

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8"
          >
            <Button variant="ghost" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
              Load more posts
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Feed;