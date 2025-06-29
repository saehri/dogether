import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Camera, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Task } from '@/types';

interface GoalCardProps {
  task: Task;
  onCompleteTask: (taskId: string, evidence: File) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ task, onCompleteTask }) => {
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isGoal = task.type === 'goal';
  const progress = isGoal && task.goalDetails ? 
    (task.goalDetails.currentCount / task.goalDetails.targetCount) * 100 : 100;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleComplete = () => {
    if (selectedFile) {
      onCompleteTask(task.id, selectedFile);
      setIsEvidenceModalOpen(false);
      setSelectedFile(null);
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
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Started {task.createdAt.toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              
              <Badge variant={task.completed ? "success" : isGoal ? "info" : "warning"}>
                {task.completed ? 'Completed' : isGoal ? 'Goal' : 'Task'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-600">{task.description}</p>

            {/* Progress for Goals */}
            {isGoal && task.goalDetails && (
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{task.goalDetails.currentCount}/{task.goalDetails.targetCount} days</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
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
                  <p className="text-sm text-gray-700 mt-2">{task.evidence.caption}</p>
                )}
              </div>
            )}

            {/* Actions */}
            {!task.completed && (
              <Button
                variant="gradient"
                className="w-full flex items-center space-x-2"
                onClick={() => setIsEvidenceModalOpen(true)}
              >
                <Camera className="w-4 h-4" />
                <span>Complete with Evidence</span>
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {selectedFile ? (
                <div>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                </div>
              ) : (
                <div>
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Choose a photo</p>
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
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                onClick={handleComplete}
                disabled={!selectedFile}
              >
                Complete Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalCard;