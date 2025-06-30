import React from 'react';
import { cn, fetchWithToken } from '../../lib/utils';
import { motion } from 'framer-motion';
import { getAuthToken } from '../../services/api';
import { Task } from '../../types';
import useSWR from 'swr';

import FeedCard from '../Feed/FeedCard';

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

	if (!tasks || !goals) return <div></div>;

	const taskData: Task[] = tasks?.todos || [];
	const goalData: Task[] = goals?.goals || [];

	console.log(goals, tasks);

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

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
			>
				{goalData.map((task, index) => (
					<FeedCard key={task.id} task={task} index={index} />
				))}

				{taskData.map((task, index) => (
					<FeedCard key={task.id} task={task} index={index} />
				))}
			</motion.div>
		</div>
	);
};

export default Goals;

// import React from 'react';
// import { cn } from '../../lib/utils';
// import { motion } from 'framer-motion';

// import { getAuthToken } from '../../services/api';

// import useSWR from 'swr';

// interface GoalsProps {}

// const fetchWithToken = async (
// 	url: string,
// 	token: string,
// 	options: RequestInit = {}
// ) => {
// 	const response = await fetch(url, {
// 		...options,
// 		headers: {
// 			...(options.headers || {}),
// 			Authorization: `Bearer ${token}`,
// 			'Content-Type': 'application/json',
// 		},
// 	});

// 	if (!response.ok) {
// 		const errorText = await response.text();
// 		throw new Error(
// 			`Fetch error: ${response.status} ${response.statusText} - ${errorText}`
// 		);
// 	}

// 	return response.json();
// };

// const Goals: React.FC<GoalsProps> = () => {
// 	const authToken = getAuthToken();

// 	const { data, isLoading } = useSWR(
// 		['https://dogether.etalasepro.com/api/goals', authToken],
// 		([url, token]) => fetchWithToken(url, token!)
// 	);

// 	// const [filter, setFilter] = useState<'all' | 'tasks' | 'goals' | 'completed'>(
// 	// 	'all'
// 	// );

// 	// const { user } = useAuth();
// 	// const { fetchTasks, fetchGoals, clearError } = useTaskActions();
// 	// const myTasks = useUserTasks(user?.id || '');
// 	// const stats = useTaskStats(user?.id || '');
// 	// const isLoading = useTasksLoading();
// 	// const error = useTasksError();

// 	// // Fetch data on component mount
// 	// useEffect(() => {
// 	// 	if (user?.id) {
// 	// 		fetchTasks();
// 	// 		fetchGoals();
// 	// 	}
// 	// }, [user?.id, fetchTasks, fetchGoals]);

// 	// const filteredTasks = myTasks.filter((task) => {
// 	// 	switch (filter) {
// 	// 		case 'tasks':
// 	// 			return task.type === 'task';
// 	// 		case 'goals':
// 	// 			return task.type === 'goal';
// 	// 		case 'completed':
// 	// 			return task.completed;
// 	// 		default:
// 	// 			return true;
// 	// 	}
// 	// });

// 	// const statsData = [
// 	// 	{
// 	// 		title: 'Total Goals',
// 	// 		value: stats.totalTasks,
// 	// 		gradient: 'from-purple-500 to-blue-600',
// 	// 	},
// 	// 	{
// 	// 		title: 'Completed',
// 	// 		value: stats.completedTasks,
// 	// 		gradient: 'from-green-500 to-emerald-600',
// 	// 	},
// 	// 	{
// 	// 		title: 'In Progress',
// 	// 		value: stats.totalTasks - stats.completedTasks,
// 	// 		gradient: 'from-orange-500 to-red-500',
// 	// 	},
// 	// 	{
// 	// 		title: 'Success Rate',
// 	// 		value: `${Math.round(stats.completionRate)}%`,
// 	// 		gradient: 'from-blue-500 to-cyan-600',
// 	// 	},
// 	// ];

// 	// const filterOptions = [
// 	// 	{ key: 'all', label: 'All' },
// 	// 	{ key: 'goals', label: 'Goals' },
// 	// 	{ key: 'tasks', label: 'Tasks' },
// 	// 	{ key: 'completed', label: 'Completed' },
// 	// ];

// 	// const handleRefresh = () => {
// 	// 	if (user?.id) {
// 	// 		fetchTasks();
// 	// 		fetchGoals();
// 	// 	}
// 	// };

// 	return (
// 		<div className="max-w-4xl mx-auto space-y-6">
// 			{/* Header */}
// 			<motion.div
// 				initial={{ opacity: 0, y: -20 }}
// 				animate={{ opacity: 1, y: 0 }}
// 				className="flex items-center justify-between"
// 			>
// 				<div>
// 					<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
// 						My Goals & Tasks
// 					</h2>
// 					<p className={cn('text-gray-600 dark:text-gray-200')}>
// 						Track your progress and achieve your goals
// 					</p>
// 				</div>
// 				{/* <Button
// 					variant="outline"
// 					onClick={handleRefresh}
// 					disabled={isLoading}
// 					className="flex items-center space-x-2"
// 				>
// 					<RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
// 					<span>Refresh</span>
// 				</Button> */}
// 			</motion.div>

// 			{/* Error Display */}
// 			{/* {error && (
// 				<motion.div
// 					initial={{ opacity: 0, y: -10 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800/30"
// 				>
// 					<div className="flex items-center justify-between">
// 						<p className="text-red-700 dark:text-red-300">{error}</p>
// 						<Button
// 							variant="ghost"
// 							size="sm"
// 							onClick={clearError}
// 							className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
// 						>
// 							Dismiss
// 						</Button>
// 					</div>
// 				</motion.div>
// 			)} */}

// 			{/* Loading State */}
// 			{isLoading && (
// 				<motion.div
// 					initial={{ opacity: 0 }}
// 					animate={{ opacity: 1 }}
// 					className="flex items-center justify-center py-12"
// 				>
// 					<div className="flex items-center space-x-3">
// 						<div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
// 						<span className={cn('text-gray-600 dark:text-gray-300')}>
// 							Loading your goals and tasks...
// 						</span>
// 					</div>
// 				</motion.div>
// 			)}

// 			{/* Stats - Only show if there are tasks */}
// 			{/* {!isLoading && myTasks.length > 0 && (
// 				<motion.div
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.1 }}
// 					className="grid grid-cols-1 md:grid-cols-4 gap-4"
// 				>
// 					{statsData.map((stat, index) => (
// 						<Card key={index} className="overflow-hidden">
// 							<CardContent
// 								className={`p-6 bg-gradient-to-br ${stat.gradient} text-white`}
// 							>
// 								<h3 className="text-2xl font-bold">{stat.value}</h3>
// 								<p className="text-white/80">{stat.title}</p>
// 							</CardContent>
// 						</Card>
// 					))}
// 				</motion.div>
// 			)} */}

// 			{/* Filters - Only show if there are tasks */}
// 			{/* {!isLoading && myTasks.length > 0 && (
// 				<motion.div
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.2 }}
// 					className="flex items-center space-x-4"
// 				>
// 					<Filter
// 						className={cn('w-5 h-5', 'text-gray-600 dark:text-gray-200')}
// 					/>
// 					<div className="flex space-x-2">
// 						{filterOptions.map(({ key, label }) => (
// 							<Button
// 								key={key}
// 								variant={filter === key ? 'default' : 'ghost'}
// 								onClick={() => setFilter(key as typeof filter)}
// 								className={
// 									filter === key
// 										? 'bg-gradient-to-r from-purple-500 to-blue-600'
// 										: ''
// 								}
// 							>
// 								{label}
// 							</Button>
// 						))}
// 					</div>
// 				</motion.div>
// 			)} */}

// 			{/* Goals Grid or Empty State */}
// 			{/* {!isLoading && filteredTasks.length === 0 ? (
// 				<motion.div
// 					initial={{ opacity: 0 }}
// 					animate={{ opacity: 1 }}
// 					className="text-center py-16"
// 				>
// 					<Card className="max-w-md mx-auto">
// 						<CardContent className="p-12 text-center">
// 							<div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
// 								<Target className="w-10 h-10 text-purple-600 dark:text-purple-400" />
// 							</div>
// 							<h3
// 								className={cn(
// 									'text-xl font-semibold mb-3',
// 									'text-gray-900 dark:text-gray-100'
// 								)}
// 							>
// 								{myTasks.length === 0
// 									? 'No goals yet'
// 									: `No ${filter === 'all' ? '' : filter} goals found`}
// 							</h3>
// 							<p
// 								className={cn(
// 									'mb-6 leading-relaxed',
// 									'text-gray-600 dark:text-gray-300'
// 								)}
// 							>
// 								{myTasks.length === 0
// 									? 'Start your journey by creating your first goal or task. Set targets, track progress, and achieve success!'
// 									: `You don't have any ${
// 											filter === 'all' ? '' : filter
// 									  } goals yet. Try a different filter or create a new goal.`}
// 							</p>
// 						</CardContent>
// 					</Card>
// 				</motion.div>
// 			) : !isLoading ? (
// 				<motion.div
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ delay: 0.3 }}
// 					className="grid grid-cols-1 md:grid-cols-2 gap-6"
// 				>
// 					{filteredTasks.map((task, index) => (
// 						<motion.div
// 							key={task.id}
// 							initial={{ opacity: 0, y: 20 }}
// 							animate={{ opacity: 1, y: 0 }}
// 							transition={{ delay: index * 0.1 }}
// 						>
// 							<GoalCard task={task} />
// 						</motion.div>
// 					))}
// 				</motion.div>
// 			) : null} */}
// 		</div>
// 	);
// };

// export default Goals;

