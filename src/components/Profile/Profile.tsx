import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Trophy, Target, CheckCircle2, Calendar, Users, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCurrentUser, useBadges, useUserStats, useCompletedTasks } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface ProfileProps {
  onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const currentUser = useCurrentUser();
  const allBadges = useBadges();
  const stats = useUserStats(currentUser.id);
  const completedTasks = useCompletedTasks(currentUser.id);
  
  const userBadges = currentUser.badges;
  const visibleBadges = showAllBadges ? userBadges : userBadges.slice(0, 5);
  const shouldShowToggle = userBadges.length > 5;

  const statsData = [
    {
      label: 'Tasks Completed',
      value: stats.completedTasks,
      total: stats.totalTasks,
      color: 'from-green-500 to-emerald-600',
      icon: CheckCircle2
    },
    {
      label: 'Goals Achieved',
      value: stats.completedGoals,
      total: stats.totalGoals,
      color: 'from-blue-500 to-purple-600',
      icon: Target
    },
    {
      label: 'Badges Earned',
      value: userBadges.length,
      total: allBadges.length,
      color: 'from-yellow-500 to-orange-600',
      icon: Trophy
    },
    {
      label: 'Friends',
      value: currentUser.friends.length,
      total: 50, // Max friends for visualization
      color: 'from-purple-500 to-pink-600',
      icon: Users
    }
  ];

  const userBio = "Passionate about personal growth and achieving goals. Love connecting with like-minded people who push each other to be better every day. Currently focusing on fitness, reading, and learning new skills!";

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative inline-block mb-6">
          <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
        </div>
        
        <h1 className={cn(
          "text-3xl font-bold mb-2",
          "text-gray-900 dark:text-gray-100"
        )}>
          {currentUser.name}
        </h1>
        <p className={cn(
          "text-xl mb-4",
          "text-gray-600 dark:text-gray-200"
        )}>
          @{currentUser.username}
        </p>

        {/* Logout Button */}
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800/30 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
        
        {/* Bio */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h2 className={cn(
              "text-lg font-semibold mb-3",
              "text-gray-900 dark:text-gray-100"
            )}>
              About Me
            </h2>
            <p className={cn(
              "leading-relaxed",
              "text-gray-700 dark:text-gray-200"
            )}>
              {userBio}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats with Bar Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className={cn(
          "text-2xl font-bold mb-6 text-center",
          "text-gray-900 dark:text-gray-100"
        )}>
          My Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statsData.map((stat, index) => {
            const percentage = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;
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
                          <h3 className={cn(
                            "font-semibold",
                            "text-gray-900 dark:text-gray-100"
                          )}>
                            {stat.label}
                          </h3>
                          <p className={cn(
                            "text-sm",
                            "text-gray-600 dark:text-gray-200"
                          )}>
                            {stat.value} of {stat.total}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "text-2xl font-bold",
                          "text-gray-900 dark:text-gray-100"
                        )}>
                          {stat.value}
                        </div>
                        <div className={cn(
                          "text-sm",
                          "text-gray-500 dark:text-gray-300"
                        )}>
                          {Math.round(percentage)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Bar Chart */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
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
          <h2 className={cn(
            "text-2xl font-bold flex items-center space-x-2",
            "text-gray-900 dark:text-gray-100"
          )}>
            <Trophy className="w-7 h-7 text-yellow-500" />
            <span>My Badges</span>
          </h2>
          <Badge variant="info" className="text-sm">
            {userBadges.length} earned
          </Badge>
        </div>

        {userBadges.length > 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {visibleBadges.map((badge, index) => (
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
                    <h4 className={cn(
                      "font-semibold text-sm mb-1",
                      "text-gray-900 dark:text-gray-100"
                    )}>
                      {badge.name}
                    </h4>
                    <p className={cn(
                      "text-xs line-clamp-2",
                      "text-gray-600 dark:text-gray-200"
                    )}>
                      {badge.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {shouldShowToggle && (
                <div className="text-center mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAllBadges(!showAllBadges)}
                    className="flex items-center space-x-2 mx-auto"
                  >
                    {showAllBadges ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Show All ({userBadges.length - 5} more)</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className={cn(
                "text-xl font-semibold mb-2",
                "text-gray-600 dark:text-gray-200"
              )}>
                No badges yet
              </h3>
              <p className={cn(
                "text-gray-500 dark:text-gray-300"
              )}>
                Complete goals and tasks to earn your first badge!
              </p>
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
        <h2 className={cn(
          "text-2xl font-bold mb-6 flex items-center space-x-2",
          "text-gray-900 dark:text-gray-100"
        )}>
          <Calendar className="w-7 h-7 text-blue-500" />
          <span>Recent Activity</span>
        </h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {completedTasks.slice(0, 3).map((task, index) => (
                <div key={task.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className={`w-10 h-10 bg-gradient-to-br ${task.type === 'goal' ? 'from-blue-500 to-purple-600' : 'from-orange-500 to-red-500'} rounded-lg flex items-center justify-center`}>
                    {task.type === 'goal' ? (
                      <Target className="w-5 h-5 text-white" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn(
                      "font-semibold",
                      "text-gray-900 dark:text-gray-100"
                    )}>
                      {task.title}
                    </h4>
                    <p className={cn(
                      "text-sm",
                      "text-gray-600 dark:text-gray-200"
                    )}>
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
                  <CheckCircle2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className={cn(
                    "text-gray-500 dark:text-gray-300"
                  )}>
                    No completed activities yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <LogOut className="w-5 h-5 text-red-500" />
              <span>Sign Out</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? You'll need to log in again to access your account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 flex items-center space-x-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;