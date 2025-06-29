import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { tasks, currentUser } from '@/data/mockData';
import GoalCard from './GoalCard';

interface GoalsProps {
  onCreateTask: () => void;
}

const Goals: React.FC<GoalsProps> = ({ onCreateTask }) => {
  const [filter, setFilter] = useState<'all' | 'tasks' | 'goals' | 'completed'>('all');
  
  const myTasks = tasks.filter(task => task.userId === currentUser.id);
  
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

  const handleCompleteTask = (taskId: string, evidence: File) => {
    console.log(`Completing task ${taskId} with evidence:`, evidence);
  };

  const stats = [
    {
      title: 'Total Goals',
      value: myTasks.length,
      gradient: 'from-purple-500 to-blue-600'
    },
    {
      title: 'Completed',
      value: myTasks.filter(t => t.completed).length,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'In Progress',
      value: myTasks.filter(t => !t.completed).length,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Success Rate',
      value: `${Math.round((myTasks.filter(t => t.completed).length / myTasks.length) * 100) || 0}%`,
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
          <p className="text-gray-600">Track your progress and achieve your goals</p>
        </div>
        
        <Button variant="gradient" onClick={onCreateTask} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className={`p-6 bg-gradient-to-br ${stat.gradient} text-white`}>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-white/80">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center space-x-4"
      >
        <Filter className="w-5 h-5 text-gray-600" />
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

      {/* Goals Grid */}
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
            <GoalCard task={task} onCompleteTask={handleCompleteTask} />
          </motion.div>
        ))}
      </motion.div>

      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-600 mb-6">Create your first goal to get started!</p>
          <Button variant="gradient" onClick={onCreateTask}>
            Create Goal
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Goals;