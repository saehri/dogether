import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, CheckCircle2, Calendar, Users, UserMinus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { friends, tasks, badges } from '@/data/mockData';

interface FriendProfileProps {
  friendId: string;
  onBack: () => void;
}

const FriendProfile: React.FC<FriendProfileProps> = ({ friendId, onBack }) => {
  const friend = friends.find(f => f.id === friendId);
  
  if (!friend) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Friend not found</h2>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  // Mock data for friend (in a real app, this would come from API)
  const friendTasks = tasks.filter(task => task.userId === friendId);
  const completedTasks = friendTasks.filter(task => task.completed);
  const goals = friendTasks.filter(task => task.type === 'goal');
  const completedGoals = goals.filter(goal => goal.completed);
  
  // Mock badges for friend
  const friendBadges = badges.slice(0, 3); // Show first 3 badges as earned
  
  const stats = [
    {
      label: 'Tasks Completed',
      value: completedTasks.length,
      total: friendTasks.length,
      color: 'from-green-500 to-emerald-600',
      icon: CheckCircle2
    },
    {
      label: 'Goals Achieved',
      value: completedGoals.length,
      total: goals.length,
      color: 'from-blue-500 to-purple-600',
      icon: Target
    },
    {
      label: 'Badges Earned',
      value: friendBadges.length,
      total: badges.length,
      color: 'from-yellow-500 to-orange-600',
      icon: Trophy
    },
    {
      label: 'Friends',
      value: Math.floor(Math.random() * 20) + 10, // Random number for demo
      total: 50,
      color: 'from-purple-500 to-pink-600',
      icon: Users
    }
  ];

  const friendBio = `Hey there! I'm ${friend.name} and I love setting goals and achieving them. Always looking for motivation and new challenges. Let's support each other on our journey to success!`;

  const handleUnfriend = () => {
    // This would normally make an API call to unfriend the user
    console.log(`Unfriending ${friend.name}`);
    // You could show a confirmation dialog here
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center space-x-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Button>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative inline-block mb-6">
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            <AvatarImage src={friend.avatar} alt={friend.name} />
            <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              {friend.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {friend.isOnline && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{friend.name}</h1>
        <p className="text-xl text-gray-600 mb-4">@{friend.username}</p>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={handleUnfriend}
          >
            <UserMinus className="w-4 h-4" />
            <span>Unfriend</span>
          </Button>
          <Button variant="gradient">
            Message
          </Button>
        </div>
        
        {/* Bio */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About {friend.name}</h2>
            <p className="text-gray-700 leading-relaxed">{friendBio}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats with Bar Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{friend.name}'s Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => {
            const percentage = (stat.value / stat.total) * 100;
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{stat.label}</h3>
                          <p className="text-sm text-gray-600">{stat.value} of {stat.total}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500">{Math.round(percentage)}%</div>
                      </div>
                    </div>
                    
                    {/* Bar Chart */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className={`h-3 bg-gradient-to-r ${stat.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Trophy className="w-7 h-7 text-yellow-500" />
            <span>{friend.name}'s Badges</span>
          </h2>
          <Badge variant="info" className="text-sm">
            {friendBadges.length} earned
          </Badge>
        </div>

        {friendBadges.length > 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {friendBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg`}>
                      {badge.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{badge.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No badges yet</h3>
              <p className="text-gray-500">{friend.name} hasn't earned any badges yet.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Calendar className="w-7 h-7 text-blue-500" />
          <span>Recent Activity</span>
        </h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {completedTasks.slice(0, 3).map((task, index) => (
                <div key={task.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 bg-gradient-to-br ${task.type === 'goal' ? 'from-blue-500 to-purple-600' : 'from-orange-500 to-red-500'} rounded-lg flex items-center justify-center`}>
                    {task.type === 'goal' ? (
                      <Target className="w-5 h-5 text-white" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">
                      Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <Badge variant="success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done
                  </Badge>
                </div>
              ))}
              
              {completedTasks.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No completed activities yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FriendProfile;