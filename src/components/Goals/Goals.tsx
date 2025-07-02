import React from 'react';
import { cn, fetchWithToken } from '../../lib/utils';
import { motion } from 'framer-motion';
import { getAuthToken } from '../../services/api';
import { Task } from '../../types';
import useSWR from 'swr';

import GoalCard from './GoalCard';

interface GoalsProps {}

const Goals: React.FC<GoalsProps> = () => {
	const authToken = getAuthToken();

	const {
		data: goals,
		isLoading: isLoadingGoals,
		error: isGoalsError,
	} = useSWR(
		authToken ? ['https://dogether.etalasepro.com/api/goals', authToken] : null,
		([url, token]) => fetchWithToken(url, token)
	);
	const {
		data: tasks,
		isLoading: isLoadingTasks,
		error: isTasksError,
	} = useSWR(
		authToken ? ['https://dogether.etalasepro.com/api/todos', authToken] : null,
		([url, token]) => fetchWithToken(url, token)
	);

	if (isLoadingGoals || isLoadingTasks)
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex items-center justify-center py-12"
				>
					<div className="flex items-center space-x-3">
						<div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
						<span className={cn('text-gray-600 dark:text-gray-300')}>
							Loading your goals and tasks...
						</span>
					</div>
				</motion.div>
			</div>
		);

	if (isGoalsError || isTasksError)
		return (
			<div className="max-w-4xl mx-auto space-y-6 flex flex-col gap-4">
				{isGoalsError && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-6"
					>
						<p className="text-red-600 dark:text-red-400">
							⚠️ Failed to load goals: {isGoalsError.message}
						</p>
					</motion.div>
				)}

				{isTasksError && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-6"
					>
						<p className="text-red-600 dark:text-red-400">
							⚠️ Failed to load goals: {isTasksError.message}
						</p>
					</motion.div>
				)}
			</div>
		);

	const taskData: Task[] = tasks?.todos || [];
	const goalData: Task[] = goals?.goals || [];

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center justify-between"
			>
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
						My Goals & Tasks
					</h2>
					<p className={cn('text-gray-600 dark:text-gray-200')}>
						Track your progress and achieve your goals
					</p>
				</div>
			</motion.div>

			<div className="grid md:grid-cols-2 gap-4">
				{goalData.map((goal) => (
					<GoalCard key={goal.id} task={goal} />
				))}

				{taskData.map((task) => (
					<GoalCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
};

export default Goals;

