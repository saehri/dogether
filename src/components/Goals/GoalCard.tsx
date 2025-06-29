import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Camera, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Task } from '@/types';
import { useStore } from '@/store/useStore';
import { useAsyncOperation } from '@/hooks/useApi';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  task: Task;
}

const GoalCard: React.FC<GoalCardProps> = ({ task }) => {
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { completeTask, deleteTask } = useStore();
  const { loading, error, execute } = useAsyncOperation();

  const isGoal = task.type === 'goal';
  const progress = isGoal && task.goalDetails ? 
    (task.goalDetails.currentCount / task.goalDetails.targetCount) * 100 : 100;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleComplete = async () => {
    if (!selectedFile && !task.completed) return;
    
    await execute(async () => {
      await completeTask(task.id, selectedFile || undefined);
      setIsEvidenceModalOpen(false);
      setSelectedFile(null);
    });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await execute(async () => {
        await deleteTask(task.id);
      });
    }
  };

  return (
    <>
      <motion.div layout>
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {isGoal ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className={cn(
                    "font-semibold",
                    "text-gray-900 dark:text-gray-100"
                  )}>
                    {task.title}
                  </h3>
                  <p className={cn(
                    "text-sm flex items-center space-x-1",
                    "text-gray-500 dark:text-gray-300"
                  )}>
                    <Calendar className="w-4 h-4" />
                    <span>Started {new Date(task.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={task.completed ? "success" : isGoal ? "info" : "warning"}>
                  {task.completed ? 'Completed' : isGoal ? 'Goal' : 'Task'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className={cn(
              "text-gray-600 dark:text-gray-200"
            )}>
              {task.description}
            </p>

            {/* Progress for Goals */}
            {isGoal && task.goalDetails && (
              <div>
                <div className={cn(
                  "flex items-center justify-between text-sm mb-2",
                  "text-gray-600 dark:text-gray-200"
                )}>
                  <span>Progress</span>
                  <span>{task.goalDetails.currentCount}/{task.goalDetails.targetCount} days</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className={cn(
                  "flex items-center justify-between text-xs mt-2",
                  "text-gray-500 dark:text-gray-300"
                )}>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{task.goalDetails.frequency}</span>
                  </span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
              </div>
            )}

            {/* Evidence */}
            {task.evidence && (
              <div>
                <img
                  src={task.evidence.imageUrl}
                  alt="Evidence"
                  className="w-full h-48 object-cover rounded-lg"
                />
                {task.evidence.caption && (
                  <p className={cn(
                    "text-sm mt-2",
                    "text-gray-700 dark:text-gray-200"
                  )}>
                    {task.evidence.caption}
                  </p>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900/20 dark:border-red-800/30">
                <p className="text-red-700 text-sm dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Actions */}
            {!task.completed && (
              <Button
                variant="gradient"
                className="w-full flex items-center space-x-2"
                onClick={() => setIsEvidenceModalOpen(true)}
                disabled={loading}
              >
                <Camera className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Complete with Evidence'}</span>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Evidence Modal */}
      <Dialog open={isEvidenceModalOpen} onOpenChange={setIsEvidenceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Evidence</DialogTitle>
            <DialogDescription>
              Take a photo to prove you completed: <span className="font-semibold">{task.title}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              {selectedFile ? (
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className={cn(
                    "text-sm",
                    "text-gray-600 dark:text-gray-200"
                  )}>
                    {selectedFile.name}
                  </p>
                </div>
              ) : (
                <div>
                  <Camera className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className={cn(
                    "mb-4",
                    "text-gray-600 dark:text-gray-200"
                  )}>
                    Choose a photo
                  </p>
                  <Label htmlFor="evidence-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Select Photo</span>
                    </Button>
                  </Label>
                  <Input
                    id="evidence-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEvidenceModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                onClick={handleComplete}
                disabled={!selectedFile || loading}
              >
                {loading ? 'Completing...' : 'Complete Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalCard;