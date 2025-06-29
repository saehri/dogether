import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { badges, currentUser } from '@/data/mockData';

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
        <p className="text-gray-600">Achievements unlock as you complete goals</p>
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
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
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
                    <h4 className="font-bold text-gray-900 mb-1">{badge.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
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
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
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
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl grayscale">
                    {badge.icon}
                  </div>
                  <h4 className="font-bold text-gray-600 mb-1">{badge.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{badge.description}</p>
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
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keep Going!</h3>
            <p className="text-gray-600 mb-4">
              Complete more goals and tasks to unlock amazing badges and show off your achievements.
            </p>
            <Progress value={progressPercentage} className="mb-2" />
            <p className="text-sm text-gray-600">
              {unlockedBadges.length} of {badges.length} badges earned
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Badges;