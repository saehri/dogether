import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { friends } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Friends: React.FC = () => {
  const stats = [
    {
      title: 'Total Friends',
      value: friends.length,
      icon: Users,
      gradient: 'from-purple-500 to-blue-600'
    },
    {
      title: 'Online Now',
      value: friends.filter(f => f.isOnline).length,
      icon: () => <div className="w-3 h-3 bg-green-300 rounded-full"></div>,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Active This Week',
      value: Math.floor(friends.length * 0.8),
      icon: () => <div className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">A</div>,
      gradient: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Your Friends
        </h2>
        <p className={cn(
          "text-gray-600 dark:text-gray-200"
        )}>
          Connect and motivate each other
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className={`p-6 bg-gradient-to-br ${stat.gradient} text-white text-center`}>
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-white/80">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Add Friend Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <Button variant="gradient" className="flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add New Friend</span>
        </Button>
      </motion.div>

      {/* Friends List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {friend.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <h3 className={cn(
                  "font-semibold mb-1",
                  "text-gray-900 dark:text-gray-100"
                )}>
                  {friend.name}
                </h3>
                <p className={cn(
                  "text-sm mb-4",
                  "text-gray-600 dark:text-gray-200"
                )}>
                  @{friend.username}
                </p>
                
                <div className="flex justify-center">
                  <Button variant="gradient" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Friends;