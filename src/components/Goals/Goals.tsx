import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/stores/authStore';
import { useUserTasks, useTaskStats } from '@/stores/taskStore';
import GoalCard from './GoalCard';
import { cn } from '@/lib/utils';

interface GoalsProps {
  onCreateTask: () => void;
}

const Goals: React.FC<GoalsProps> = ({ onCreateTask }) => {
  const [filter, setFilter] = useState<'all' | 'tasks' | 'goals' | 'completed'>('all');
  
  const { user } = useAuth();
  const myTasks = useUserTasks(user?.id || '');
  const stats = useTaskStats(user?.id || '');
  
  const filteredTasks = myTasks.filter(task => {
    switch (filter) {
      case 'tasks':
        return task.type === 'task';
      case 'goals':
        return task.type === 'goal';
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const statsData = [
    {
      title: 'Total Goals',
      value: stats.totalTasks,
      gradient: 'from-purple-500 to-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'In Progress',
      value: stats.totalTasks - stats.completedTasks,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Success Rate',
      value: `${Math.round(stats.completionRate)}%`,
      gradient: 'from-blue-500 to-cyan-600'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'goals', label: 'Goals' },
    { key: 'tasks', label: 'Tasks' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Goals & Tasks
          </h2>
          <p className={cn(
            "text-gray-600 dark:text-gray-200"
          )}>
            Track your progress and achieve your goals
          </p>
        </div>
        
        <Button variant="gradient" onClick={onCreateTask} className="flex items-center space-x-2" data-create-task>
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </Button>
      </motion.div>

      {/* Stats - Only show if there are tasks */}
      {myTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {statsData.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className={`p-6 bg-gradient-to-br ${stat.gradient} text-white`}>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-white/80">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Filters - Only show if there are tasks */}
      {myTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          <Filter className={cn(
            "w-5 h-5",
            "text-gray-600 dark:text-gray-200"
          )} />
          <div className="flex space-x-2">
            {filterOptions.map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "ghost"}
                onClick={() => setFilter(key as typeof filter)}
                className={filter === key ? "bg-gradient-to-r from-purple-500 to-blue-600" : ""}
              >
                {label}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Goals Grid or Empty State */}
      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                "text-gray-900 dark:text-gray-100"
              )}>
                {myTasks.length === 0 ? 'No goals yet' : `No ${filter === 'all' ? '' : filter} goals found`}
              </h3>
              <p className={cn(
                "mb-6 leading-relaxed",
                "text-gray-600 dark:text-gray-300"
              )}>
                {myTasks.length === 0 
                  ? 'Start your journey by creating your first goal or task. Set targets, track progress, and achieve success!'
                  : `You don't have any ${filter === 'all' ? '' : filter} goals yet. Try a different filter or create a new goal.`
                }
              </p>
              <Button variant="gradient" onClick={onCreateTask} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Goal</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GoalCard task={task} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Goals;