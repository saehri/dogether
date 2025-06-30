import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Plus, Users, RefreshCw } from 'lucide-react';
import { useTaskActions, useAllTasks, useTasksLoading, useTasksError } from '../../stores/taskStore';
import { useAuth } from '../../stores/authStore';

import FeedCard from './FeedCard';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

interface FeedProps {}

const Feed: React.FC<FeedProps> = () => {
	const { user } = useAuth();
	const { fetchTasks, fetchGoals, clearError } = useTaskActions();
	const tasks = useAllTasks();
	const isLoading = useTasksLoading();
	const error = useTasksError();

	// Fetch data on component mount
	useEffect(() => {
		if (user?.id) {
			fetchTasks();
			fetchGoals();
		}
	}, [user?.id, fetchTasks, fetchGoals]);

	const handleRefresh = () => {
		if (user?.id) {
			fetchTasks();
			fetchGoals();
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center mb-8"
			>
				<div className="flex items-center justify-between mb-4">
					<div className="flex-1">
						<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
							Your Social Feed
						</h2>
						<p className={cn('text-gray-600 dark:text-gray-300')}>
							See what your friends are achieving
						</p>
					</div>
					<Button
						variant="outline"
						onClick={handleRefresh}
						disabled={isLoading}
						className="flex items-center space-x-2"
					>
						<RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
						<span>Refresh</span>
					</Button>
				</div>
			</motion.div>

			{/* Error Display */}
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800/30"
				>
					<div className="flex items-center justify-between">
						<p className="text-red-700 dark:text-red-300">{error}</p>
						<Button
							variant="ghost"
							size="sm"
							onClick={clearError}
							className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
						>
							Dismiss
						</Button>
					</div>
				</motion.div>
			)}

			{/* Loading State */}
			{isLoading && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex items-center justify-center py-12"
				>
					<div className="flex items-center space-x-3">
						<div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
						<span className={cn('text-gray-600 dark:text-gray-300')}>
							Loading your feed...
						</span>
					</div>
				</motion.div>
			)}

			{!isLoading && tasks.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center py-16"
				>
					<Card className="max-w-md mx-auto">
						<CardContent className="p-12 text-center">
							<div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
								<Users className="w-10 h-10 text-purple-600 dark:text-purple-400" />
							</div>
							<h3
								className={cn(
									'text-xl font-semibold mb-3',
									'text-gray-900 dark:text-gray-100'
								)}
							>
								Welcome to Dogether!
							</h3>
							<p
								className={cn(
									'mb-6 leading-relaxed',
									'text-gray-600 dark:text-gray-300'
								)}
							>
								Your feed is empty right now. Start by creating your first goal
								or task, and connect with friends to see their achievements
								here.
							</p>
							<div className="space-y-3">
								<Button
									variant="gradient"
									className="w-full flex items-center space-x-2"
									onClick={() => {
										const createButton = document.querySelector(
											'[data-create-task]'
										) as HTMLButtonElement;
										createButton?.click();
									}}
								>
									<Plus className="w-4 h-4" />
									<span>Create Your First Goal</span>
								</Button>
								<p
									className={cn('text-sm', 'text-gray-500 dark:text-gray-400')}
								>
									Or add friends to see their progress
								</p>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			) : !isLoading ? (
				<div className="space-y-6">
					{tasks.map((task, index) => (
						<FeedCard key={task.id} task={task} index={index} />
					))}

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="text-center py-8"
					>
						<Button
							variant="ghost"
							className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
							onClick={handleRefresh}
							disabled={isLoading}
						>
							{isLoading ? 'Loading...' : 'Load more posts'}
						</Button>
					</motion.div>
				</div>
			) : null}
		</div>
	);
};

export default Feed;