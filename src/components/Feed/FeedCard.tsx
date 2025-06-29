import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share, Calendar, Target, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types';
import { useCurrentUser, useFriends } from '@/store/useStore';

interface FeedCardProps {
  task: Task;
  index: number;
  onProfileClick: (userId: string) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ task, index, onProfileClick }) => {
  const currentUser = useCurrentUser();
  const friends = useFriends();
  
  const user = task.userId === currentUser.id ? currentUser : friends.find(f => f.id === task.userId);
  
  if (!user) return null;

  const isGoal = task.type === 'goal';
  const progress = isGoal && task.goalDetails ? 
    (task.goalDetails.currentCount / task.goalDetails.targetCount) * 100 : 100;

  const handleUserClick = () => {
    onProfileClick(user.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar 
              className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all"
              onClick={handleUserClick}
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 
                  className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                  onClick={handleUserClick}
                >
                  {user.name}
                </h3>
                <span 
                  className="text-gray-500 text-sm cursor-pointer hover:text-purple-500 transition-colors"
                  onClick={handleUserClick}
                >
                  @{user.username}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {isGoal ? (
                  <Target className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isGoal ? 'Goal' : 'Task'}</span>
                <span>•</span>
                <Calendar className="w-4 h-4" />
                <span>{task.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h4>
            <p className="text-gray-600">{task.description}</p>
          </div>

          {/* Progress for Goals */}
          {isGoal && task.goalDetails && (
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{task.goalDetails.currentCount}/{task.goalDetails.targetCount} days</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Evidence Image */}
          {task.evidence && (
            <div>
              <img
                src={task.evidence.imageUrl}
                alt="Evidence"
                className="w-full h-64 object-cover rounded-lg"
              />
              {task.evidence.caption && (
                <p className="text-sm text-gray-700 mt-2 px-2">{task.evidence.caption}</p>
              )}
            </div>
          )}

          {/* Status Badge */}
          <div>
            {task.completed ? (
              <Badge variant="success" className="flex items-center space-x-1 w-fit">
                <CheckCircle2 className="w-3 h-3" />
                <span>Completed</span>
              </Badge>
            ) : (
              <Badge variant={isGoal ? "info" : "warning"} className="w-fit">
                {isGoal ? 'In Progress' : 'Pending'}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                <Heart className="w-4 h-4 mr-1" />
                <span>12</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-500">
                <Share className="w-4 h-4" />
              </Button>
            </div>
            
            {task.completedAt && (
              <span className="text-xs text-gray-500">
                Completed {task.completedAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FeedCard;