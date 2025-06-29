import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { badges, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Badges: React.FC = () => {
  const unlockedBadges = currentUser.badges;
  const lockedBadges = badges.filter(badge => !unlockedBadges.find(ub => ub.id === badge.id));
  const progressPercentage = (unlockedBadges.length / badges.length) * 100;

  const stats = [
    {
      title: 'Badges Earned',
      value: unlockedBadges.length,
      icon: Trophy,
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'Total Available',
      value: badges.length,
      icon: Star,
      gradient: 'from-purple-500 to-blue-600'
    },
    {
      title: 'Complete',
      value: `${Math.round(progressPercentage)}%`,
      icon: () => <div className="text-2xl">{Math.round(progressPercentage)}%</div>,
      gradient: 'from-green-500 to-emerald-600'
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
          Your Badges
        </h2>
        <p className={cn(
          "text-gray-600 dark:text-gray-200"
        )}>
          Achievements unlock as you complete goals
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

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={cn(
            "text-xl font-bold mb-4 flex items-center space-x-2",
            "text-gray-900 dark:text-gray-100"
          )}>
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Earned Badges</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-all relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-5`}></div>
                  <CardContent className="p-6 text-center relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl`}>
                      {badge.icon}
                    </div>
                    <h4 className={cn(
                      "font-bold mb-1",
                      "text-gray-900 dark:text-gray-100"
                    )}>
                      {badge.name}
                    </h4>
                    <p className={cn(
                      "text-sm mb-3",
                      "text-gray-600 dark:text-gray-200"
                    )}>
                      {badge.description}
                    </p>
                    <Badge variant="success" className="flex items-center space-x-1 w-fit mx-auto">
                      <Trophy className="w-3 h-3" />
                      <span>Earned</span>
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Locked Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className={cn(
          "text-xl font-bold mb-4 flex items-center space-x-2",
          "text-gray-900 dark:text-gray-100"
        )}>
          <Lock className="w-6 h-6 text-gray-400" />
          <span>Locked Badges</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-all opacity-75">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl grayscale">
                    {badge.icon}
                  </div>
                  <h4 className={cn(
                    "font-bold mb-1",
                    "text-gray-600 dark:text-gray-200"
                  )}>
                    {badge.name}
                  </h4>
                  <p className={cn(
                    "text-sm mb-3",
                    "text-gray-500 dark:text-gray-300"
                  )}>
                    {badge.description}
                  </p>
                  <Badge variant="outline" className="flex items-center space-x-1 w-fit mx-auto">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardContent className="p-6 text-center">
            <h3 className={cn(
              "text-lg font-semibold mb-2",
              "text-gray-900 dark:text-gray-100"
            )}>
              Keep Going!
            </h3>
            <p className={cn(
              "mb-4",
              "text-gray-600 dark:text-gray-200"
            )}>
              Complete more goals and tasks to unlock amazing badges and show off your achievements.
            </p>
            <Progress value={progressPercentage} className="mb-2" />
            <p className={cn(
              "text-sm",
              "text-gray-600 dark:text-gray-200"
            )}>
              {unlockedBadges.length} of {badges.length} badges earned
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Badges;