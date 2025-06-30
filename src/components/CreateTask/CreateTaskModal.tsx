import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Calendar } from 'lucide-react';

import { useTaskActions } from '../../stores/taskStore';
import { useAuth } from '../../stores/authStore';

import { cn } from '../../lib/utils';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../components/ui/select';
import { Card, CardContent } from '../../components/ui/card';

interface CreateTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
	isOpen,
	onClose,
}) => {
	const [taskType, setTaskType] = useState<'task' | 'goal'>('task');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
	const [duration, setDuration] = useState(7);
	const [targetCount, setTargetCount] = useState(7);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { createTask, createGoal } = useTaskActions();
	const { user } = useAuth();

	const isCreateDisabled = title.trim() === '' || !user;

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setFrequency('daily');
		setDuration(7);
		setTargetCount(7);
		setTaskType('task');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isCreateDisabled || !user) return;

		setIsSubmitting(true);

		try {
			const baseData = {
				title: title.trim(),
				description,
				type: taskType,
				userId: user.id,
				completed: false,
			};

			if (taskType === 'goal') {
				const goalData = {
					...baseData,
					goalDetails: {
						targetCount,
						currentCount: 0,
						frequency,
						duration,
					},
				};
				await createGoal(goalData);
			} else {
				await createTask(baseData);
			}

			resetForm();
			onClose();
		} catch (error) {
			console.error('Failed to create task/goal:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		if (!isSubmitting) {
			resetForm();
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog open={isOpen} onOpenChange={handleClose}>
					<DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
						<DialogHeader className="flex-shrink-0">
							<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
								Create New {taskType === 'task' ? 'Task' : 'Goal'}
							</DialogTitle>
						</DialogHeader>

						<div className="flex-1 overflow-y-auto pr-2 -mr-2">
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Task Type Selection */}
								<div>
									<Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3 block">
										Choose Type
									</Label>
									<div className="grid grid-cols-2 gap-3">
										<Card
											className={cn(
												'cursor-pointer transition-all',
												taskType === 'task'
													? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20'
													: 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
											)}
											onClick={() => setTaskType('task')}
										>
											<CardContent className="p-4 text-center">
												<CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-orange-600" />
												<div className="text-sm font-medium text-gray-900 dark:text-gray-100">
													Task
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400">
													One-time completion
												</div>
											</CardContent>
										</Card>
										<Card
											className={cn(
												'cursor-pointer transition-all',
												taskType === 'goal'
													? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
													: 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
											)}
											onClick={() => setTaskType('goal')}
										>
											<CardContent className="p-4 text-center">
												<Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
												<div className="text-sm font-medium text-gray-900 dark:text-gray-100">
													Goal
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400">
													Repeating activity
												</div>
											</CardContent>
										</Card>
									</div>
								</div>

								{/* Title */}
								<div>
									<Label
										htmlFor="title"
										className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block"
									>
										Title *
									</Label>
									<Input
										id="title"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder={
											taskType === 'task'
												? 'e.g., Finish reading book'
												: 'e.g., Run 2km daily'
										}
										required
										className={cn(
											'transition-colors',
											title.trim() === '' &&
												'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-400'
										)}
										disabled={isSubmitting}
									/>
									{title.trim() === '' && (
										<p className="text-xs text-red-600 dark:text-red-400 mt-1">
											Title is required
										</p>
									)}
								</div>

								{/* Description */}
								<div>
									<Label
										htmlFor="description"
										className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block"
									>
										Description
									</Label>
									<Textarea
										id="description"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Add more details about your goal..."
										rows={3}
										disabled={isSubmitting}
									/>
								</div>

								{/* Goal-specific settings */}
								{taskType === 'goal' && (
									<Card className="bg-blue-50 dark:bg-blue-900/20">
										<CardContent className="p-4 space-y-4">
											<h3 className="font-medium text-blue-900 dark:text-blue-100 flex items-center space-x-2">
												<Target className="w-4 h-4" />
												<span>Goal Settings</span>
											</h3>

											<div className="grid grid-cols-2 gap-4">
												<div>
													<Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
														Frequency
													</Label>
													<Select
														value={frequency}
														onValueChange={(value: 'daily' | 'weekly') =>
															setFrequency(value)
														}
														disabled={isSubmitting}
													>
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
													<Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
														Duration (days)
													</Label>
													<Input
														type="number"
														value={duration}
														onChange={(e) => {
															const days = parseInt(e.target.value);
															setDuration(days);
															setTargetCount(
																frequency === 'daily'
																	? days
																	: Math.ceil(days / 7)
															);
														}}
														min="1"
														max="365"
														disabled={isSubmitting}
													/>
												</div>
											</div>

											<div className="text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/30 p-3 rounded-lg">
												<div className="flex items-center space-x-2">
													<Calendar className="w-4 h-4" />
													<span>
														Target: Complete {targetCount} times over {duration}{' '}
														days
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								)}
							</form>
						</div>

						{/* Action Buttons */}
						<div className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
							<div className="flex space-x-3">
								<Button
									type="button"
									variant="outline"
									className="flex-1"
									onClick={handleClose}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button
									type="button"
									variant="gradient"
									className="flex-1"
									onClick={handleSubmit}
									disabled={isCreateDisabled || isSubmitting}
								>
									{isSubmitting
										? 'Creating...'
										: `Create ${taskType === 'task' ? 'Task' : 'Goal'}`}
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</AnimatePresence>
	);
};

export default CreateTaskModal;

