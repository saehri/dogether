import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CreateTaskProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: any) => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ isOpen, onClose, onCreateTask }) => {
  const [taskType, setTaskType] = useState<'task' | 'goal'>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [duration, setDuration] = useState(7);
  const [targetCount, setTargetCount] = useState(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      type: taskType,
      userId: '1', // Current user
      completed: false,
      createdAt: new Date(),
      ...(taskType === 'goal' && {
        goalDetails: {
          targetCount,
          currentCount: 0,
          frequency,
          duration
        }
      })
    };

    onCreateTask(newTask);
    onClose();
    
    // Reset form
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setDuration(7);
    setTargetCount(7);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create New {taskType === 'task' ? 'Task' : 'Goal'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Type Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Choose Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={cn(
                  "cursor-pointer transition-all",
                  taskType === 'task' ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                )}
                onClick={() => setTaskType('task')}
              >
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-sm font-medium">Task</div>
                  <div className="text-xs text-gray-500">One-time completion</div>
                </CardContent>
              </Card>
              <Card
                className={cn(
                  "cursor-pointer transition-all",
                  taskType === 'goal' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                )}
                onClick={() => setTaskType('goal')}
              >
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Goal</div>
                  <div className="text-xs text-gray-500">Repeating activity</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={taskType === 'task' ? 'e.g., Finish reading book' : 'e.g., Run 2km daily'}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about your goal..."
              rows={3}
              required
            />
          </div>

          {/* Goal-specific settings */}
          {taskType === 'goal' && (
            <Card className="bg-blue-50">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium text-blue-900 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Goal Settings</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Frequency
                    </Label>
                    <Select value={frequency} onValueChange={(value: 'daily' | 'weekly') => setFrequency(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Duration (days)
                    </Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => {
                        const days = parseInt(e.target.value);
                        setDuration(days);
                        setTargetCount(frequency === 'daily' ? days : Math.ceil(days / 7));
                      }}
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Target: Complete {targetCount} times over {duration} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              className="flex-1"
            >
              Create {taskType === 'task' ? 'Task' : 'Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;