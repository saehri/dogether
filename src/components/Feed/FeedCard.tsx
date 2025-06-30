import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share, Calendar, Target, CheckCircle2 } from 'lucide-react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '../../components/ui/card';
import { Task } from '../../types';
import { cn } from '../../lib/utils';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';

import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from '../../components/ui/avatar';

interface FeedCardProps {
	task: Task;
	index: number;
}

const FeedCard: React.FC<FeedCardProps> = ({ task, index }) => {
	const isGoal = task.type === 'goal';
	const progress =
		isGoal && task.goalDetails
			? (task.goalDetails.currentCount / task.goalDetails.targetCount) * 100
			: 100;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
		>
			<Card
				className={cn(
					'overflow-hidden hover:shadow-md transition-all',
					'dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:bg-gray-800/70 dark:hover:border-gray-600/50'
				)}
			>
				<CardHeader className="pb-3">
					<div className="flex items-center space-x-3">
						<Avatar
							className={cn(
								'w-10 h-10 cursor-pointer hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-500 transition-all',
								'border-2 border-purple-200 dark:border-purple-700'
							)}
						>
							<AvatarImage src={task?.user?.profile_picture} alt={''} />
							<AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
								{task?.user?.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<div className="flex items-center space-x-2">
								<h3
									className={cn(
										'font-semibold cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors',
										'text-gray-900 dark:text-gray-100'
									)}
								>
									{task?.user?.name}
								</h3>
								<span
									className={cn(
										'text-sm cursor-pointer hover:text-purple-500 dark:hover:text-purple-400 transition-colors',
										'text-gray-500 dark:text-gray-300'
									)}
								>
									@{task?.user?.username}
								</span>
							</div>
							<div
								className={cn(
									'flex items-center space-x-2 text-sm',
									'text-gray-500 dark:text-gray-300'
								)}
							>
								{isGoal ? (
									<Target className="w-4 h-4" />
								) : (
									<CheckCircle2 className="w-4 h-4" />
								)}
								<span>{isGoal ? 'Goal' : 'Task'}</span>
								<span>•</span>
								<Calendar className="w-4 h-4" />
								<span>
									{new Intl.DateTimeFormat('en', {
										dateStyle: 'medium',
										timeStyle: 'medium',
										hourCycle: 'h24',
									}).format(new Date(task?.created_at))}
								</span>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					<div>
						<h4
							className={cn(
								'text-lg font-semibold mb-2',
								'text-gray-900 dark:text-gray-100'
							)}
						>
							{task?.title}
						</h4>
						<p
							className={cn(
								'leading-relaxed',
								'text-gray-600 dark:text-gray-200'
							)}
						>
							{task?.description}
						</p>
					</div>

					{/* Progress for Goals */}
					{isGoal && task?.goalDetails && (
						<div>
							<div
								className={cn(
									'flex items-center justify-between text-sm mb-2',
									'text-gray-600 dark:text-gray-200'
								)}
							>
								<span>Progress</span>
								<span className="font-medium">
									{task?.goalDetails?.currentCount}/
									{task?.goalDetails?.targetCount} days
								</span>
							</div>
							<Progress value={progress} className="h-2" />
						</div>
					)}

					{/* Evidence Image */}
					{task.evidence && (
						<div>
							<img
								src={task?.evidence?.imageUrl}
								alt="Evidence"
								className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
							/>
							{task?.evidence?.caption && (
								<p
									className={cn(
										'text-sm mt-2 px-2',
										'text-gray-700 dark:text-gray-200'
									)}
								>
									{task?.evidence.caption}
								</p>
							)}
						</div>
					)}

					{/* Status Badge */}
					<div>
						{task?.completed ? (
							<Badge
								variant="success"
								className={cn(
									'flex items-center space-x-1 w-fit',
									'bg-green-100 text-green-800 border-green-200',
									'dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/50'
								)}
							>
								<CheckCircle2 className="w-3 h-3" />
								<span>Completed</span>
							</Badge>
						) : (
							<Badge
								variant={isGoal ? 'info' : 'warning'}
								className={cn(
									'w-fit',
									isGoal
										? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/50'
										: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700/50'
								)}
							>
								{isGoal ? 'In Progress' : 'Pending'}
							</Badge>
						)}
					</div>
				</CardContent>

				<CardFooter
					className={cn(
						'pt-3 border-t',
						'border-gray-200 dark:border-gray-700'
					)}
				>
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center space-x-6">
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									'text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400',
									'hover:bg-red-50 dark:hover:bg-red-900/20'
								)}
							>
								<Heart className="w-4 h-4 mr-1" />
								<span>12</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									'text-gray-500 hover:text-purple-500 dark:text-gray-300 dark:hover:text-purple-400',
									'hover:bg-purple-50 dark:hover:bg-purple-900/20'
								)}
							>
								<Share className="w-4 h-4" />
							</Button>
						</div>

						{task.completed_at && (
							<span
								className={cn('text-xs', 'text-gray-500 dark:text-gray-300')}
							>
								Completed{' '}
								{new Intl.DateTimeFormat('en', {
									dateStyle: 'medium',
									timeStyle: 'medium',
								}).format(new Date(task?.completed_at))}
							</span>
						)}
					</div>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

export default FeedCard;

