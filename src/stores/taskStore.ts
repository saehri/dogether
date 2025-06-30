import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Task } from '../types';
import { taskApi, goalApi } from '../services/api';

interface TaskState {
	tasks: Task[];
	goals: Task[];
	isLoading: boolean;
	error: string | null;
}

interface TaskActions {
	// Task actions
	fetchTasks: () => Promise<void>;
	createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
	updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
	deleteTask: (taskId: string) => Promise<void>;
	completeTask: (taskId: string, evidence?: File) => Promise<void>;
	
	// Goal actions
	fetchGoals: () => Promise<void>;
	createGoal: (goal: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
	updateGoal: (goalId: string, updates: Partial<Task>) => Promise<void>;
	deleteGoal: (goalId: string) => Promise<void>;
	completeGoal: (goalId: string, evidence?: File) => Promise<void>;
	updateGoalProgress: (goalId: string, progress: number) => Promise<void>;
	
	// Local state management
	setTasks: (tasks: Task[]) => void;
	setGoals: (goals: Task[]) => void;
	addTask: (task: Task) => void;
	addGoal: (goal: Task) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearError: () => void;
}

type TaskStore = TaskState & TaskActions;

const initialState: TaskState = {
	tasks: [],
	goals: [],
	isLoading: false,
	error: null,
};

// Helper function to transform API response to Task format
const transformApiGoalToTask = (apiGoal: any): Task => {
	return {
		id: String(apiGoal.id),
		title: apiGoal.title,
		description: apiGoal.description,
		type: 'goal' as const,
		userId: String(apiGoal.user_id),
		completed: !apiGoal.is_active, // Assuming is_active false means completed
		createdAt: new Date(apiGoal.created_at),
		completedAt: !apiGoal.is_active ? new Date(apiGoal.updated_at) : undefined,
		goalDetails: {
			targetCount: 30, // Default target, could be configurable
			currentCount: apiGoal.current_streak || 0,
			frequency: 'daily' as const,
			duration: 30, // Default duration
		},
	};
};

const transformApiTodoToTask = (apiTodo: any): Task => {
	return {
		id: String(apiTodo.id),
		title: apiTodo.title,
		description: apiTodo.description,
		type: 'task' as const,
		userId: String(apiTodo.user_id),
		completed: apiTodo.completed || false,
		createdAt: new Date(apiTodo.created_at),
		completedAt: apiTodo.completed_at ? new Date(apiTodo.completed_at) : undefined,
	};
};

export const useTaskStore = create<TaskStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				// Fetch tasks from API
				fetchTasks: async () => {
					set({ isLoading: true, error: null });
					try {
						const response = await taskApi.getTasks();
						console.log('Fetch tasks response:', response);
						
						if (response.success && response.data) {
							// Handle different possible response structures
							const todosData = response.data.todos || response.data.data || response.data || [];
							const transformedTasks = Array.isArray(todosData) 
								? todosData.map(transformApiTodoToTask)
								: [];
							
							console.log('Transformed tasks:', transformedTasks);
							set({ tasks: transformedTasks, isLoading: false });
						} else {
							console.warn('No tasks data in response:', response);
							set({ tasks: [], isLoading: false });
						}
					} catch (error: any) {
						console.error('Fetch tasks error:', error);
						set({ error: error.message || 'Failed to fetch tasks', isLoading: false });
					}
				},

				// Create new task
				createTask: async (taskData) => {
					set({ isLoading: true, error: null });
					try {
						console.log('Creating task with data:', taskData);
						const response = await taskApi.createTask(taskData);
						console.log('Create task response:', response);
						
						if (response.success && response.data) {
							// Handle different possible response structures
							const taskResponseData = response.data.todo || response.data.data || response.data;
							const newTask = transformApiTodoToTask(taskResponseData);
							
							console.log('New task created:', newTask);
							set((state) => ({
								tasks: [...state.tasks, newTask],
								isLoading: false
							}));
							
							// Refresh tasks to ensure we have the latest data
							setTimeout(() => {
								get().fetchTasks();
							}, 500);
						} else {
							console.error('Create task failed:', response);
							set({ error: response.message || 'Failed to create task', isLoading: false });
						}
					} catch (error: any) {
						console.error('Create task error:', error);
						set({ error: error.message || 'Failed to create task', isLoading: false });
					}
				},

				// Update task
				updateTask: async (taskId, updates) => {
					set({ isLoading: true, error: null });
					try {
						const response = await taskApi.updateTask(taskId, updates);
						if (response.success && response.data) {
							const taskResponseData = response.data.todo || response.data.data || response.data;
							const updatedTask = transformApiTodoToTask(taskResponseData);
							set((state) => ({
								tasks: state.tasks.map(task =>
									task.id === taskId ? updatedTask : task
								),
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to update task', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to update task', isLoading: false });
					}
				},

				// Delete task
				deleteTask: async (taskId) => {
					set({ isLoading: true, error: null });
					try {
						const response = await taskApi.deleteTask(taskId);
						if (response.success) {
							set((state) => ({
								tasks: state.tasks.filter(task => task.id !== taskId),
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to delete task', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to delete task', isLoading: false });
					}
				},

				// Complete task
				completeTask: async (taskId, evidence) => {
					set({ isLoading: true, error: null });
					try {
						let formData;
						if (evidence) {
							formData = new FormData();
							formData.append('evidence', evidence);
						}

						const response = await taskApi.completeTask(taskId, formData);
						if (response.success) {
							set((state) => ({
								tasks: state.tasks.map(task =>
									task.id === taskId 
										? { ...task, completed: true, completedAt: new Date(), evidence: response.data?.evidence }
										: task
								),
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to complete task', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to complete task', isLoading: false });
					}
				},

				// Fetch goals from API
				fetchGoals: async () => {
					set({ isLoading: true, error: null });
					try {
						const response = await goalApi.getGoals();
						console.log('Fetch goals response:', response);
						
						if (response.success && response.data) {
							// Handle different possible response structures
							const goalsData = response.data.goals || response.data.data || response.data || [];
							const transformedGoals = Array.isArray(goalsData) 
								? goalsData.map(transformApiGoalToTask)
								: [];
							
							console.log('Transformed goals:', transformedGoals);
							set({ goals: transformedGoals, isLoading: false });
						} else {
							console.warn('No goals data in response:', response);
							set({ goals: [], isLoading: false });
						}
					} catch (error: any) {
						console.error('Fetch goals error:', error);
						set({ error: error.message || 'Failed to fetch goals', isLoading: false });
					}
				},

				// Create new goal
				createGoal: async (goalData) => {
					set({ isLoading: true, error: null });
					try {
						console.log('Creating goal with data:', goalData);
						
						// Transform goal data to API format
						const apiGoalData = {
							title: goalData.title,
							description: goalData.description,
							start_date: new Date().toISOString().split('T')[0], // Today's date
							end_date: goalData.goalDetails?.duration 
								? new Date(Date.now() + goalData.goalDetails.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
								: undefined,
							current_streak: 0,
							is_active: 1,
						};

						console.log('API goal data:', apiGoalData);
						const response = await goalApi.createGoal(apiGoalData);
						console.log('Create goal response:', response);
						
						if (response.success && response.data) {
							// Handle different possible response structures
							const goalResponseData = response.data.goal || response.data.data || response.data;
							const newGoal = transformApiGoalToTask(goalResponseData);
							
							console.log('New goal created:', newGoal);
							set((state) => ({
								goals: [...state.goals, newGoal],
								isLoading: false
							}));
							
							// Refresh goals to ensure we have the latest data
							setTimeout(() => {
								get().fetchGoals();
							}, 500);
						} else {
							console.error('Create goal failed:', response);
							set({ error: response.message || 'Failed to create goal', isLoading: false });
						}
					} catch (error: any) {
						console.error('Create goal error:', error);
						set({ error: error.message || 'Failed to create goal', isLoading: false });
					}
				},

				// Update goal
				updateGoal: async (goalId, updates) => {
					set({ isLoading: true, error: null });
					try {
						const response = await goalApi.updateGoal(goalId, updates);
						if (response.success && response.data) {
							const goalResponseData = response.data.goal || response.data.data || response.data;
							const updatedGoal = transformApiGoalToTask(goalResponseData);
							set((state) => ({
								goals: state.goals.map(goal =>
									goal.id === goalId ? updatedGoal : goal
								),
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to update goal', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to update goal', isLoading: false });
					}
				},

				// Delete goal
				deleteGoal: async (goalId) => {
					set({ isLoading: true, error: null });
					try {
						// Get goal data for required fields in delete request
						const goalToDelete = get().goals.find(goal => goal.id === goalId);
						const goalData = goalToDelete ? {
							title: goalToDelete.title,
							description: goalToDelete.description
						} : undefined;

						const response = await goalApi.deleteGoal(goalId, goalData);
						if (response.success) {
							set((state) => ({
								goals: state.goals.filter(goal => goal.id !== goalId),
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to delete goal', isLoading: false });
						}
					} catch (error: any) {
						console.error('Delete goal error:', error);
						set({ error: error.message || 'Failed to delete goal', isLoading: false });
					}
				},

				// Complete goal
				completeGoal: async (goalId, evidence) => {
					set({ isLoading: true, error: null });
					try {
						let formData;
						if (evidence) {
							formData = new FormData();
							formData.append('evidence', evidence);
						}

						const response = await goalApi.completeGoal(goalId, formData);
						if (response.success) {
							set((state) => ({
								goals: state.goals.map(goal =>
									goal.id === goalId 
										? { ...goal, completed: true, completedAt: new Date(), evidence: response.data?.evidence }
										: goal
								),
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to complete goal', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to complete goal', isLoading: false });
					}
				},

				// Update goal progress
				updateGoalProgress: async (goalId, progress) => {
					set({ isLoading: true, error: null });
					try {
						const response = await goalApi.updateGoalProgress(goalId, { current_streak: progress });
						if (response.success) {
							set((state) => ({
								goals: state.goals.map(goal =>
									goal.id === goalId 
										? { 
											...goal, 
											goalDetails: goal.goalDetails 
												? { ...goal.goalDetails, currentCount: progress }
												: undefined
										}
										: goal
								),
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to update goal progress', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to update goal progress', isLoading: false });
					}
				},

				// Local state management
				setTasks: (tasks) => set({ tasks }),
				setGoals: (goals) => set({ goals }),
				addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
				addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
				setLoading: (loading) => set({ isLoading: loading }),
				setError: (error) => set({ error }),
				clearError: () => set({ error: null }),
			}),
			{
				name: 'task-store',
				partialize: (state) => ({
					tasks: state.tasks,
					goals: state.goals,
				}),
			}
		),
		{ name: 'task-store' }
	)
);

// Selectors
export const useTasks = () => useTaskStore((state) => state.tasks);
export const useGoals = () => useTaskStore((state) => state.goals);

// Combined tasks and goals for backward compatibility
export const useAllTasks = () => useTaskStore((state) => [...state.tasks, ...state.goals]);

export const useTaskActions = () =>
	useTaskStore((state) => ({
		fetchTasks: state.fetchTasks,
		createTask: state.createTask,
		updateTask: state.updateTask,
		deleteTask: state.deleteTask,
		completeTask: state.completeTask,
		fetchGoals: state.fetchGoals,
		createGoal: state.createGoal,
		updateGoal: state.updateGoal,
		deleteGoal: state.deleteGoal,
		completeGoal: state.completeGoal,
		updateGoalProgress: state.updateGoalProgress,
		setTasks: state.setTasks,
		setGoals: state.setGoals,
		addTask: state.addTask,
		addGoal: state.addGoal,
		setLoading: state.setLoading,
		setError: state.setError,
		clearError: state.clearError,
	}));

export const useTasksLoading = () => useTaskStore((state) => state.isLoading);
export const useTasksError = () => useTaskStore((state) => state.error);

// Computed selectors
export const useUserTasks = (userId: string) =>
	useTaskStore((state) => [...state.tasks, ...state.goals].filter((task) => task.userId === userId));

export const useCompletedTasks = (userId: string) =>
	useTaskStore((state) =>
		[...state.tasks, ...state.goals].filter((task) => task.userId === userId && task.completed)
	);

export const useTaskStats = (userId: string) =>
	useTaskStore((state) => {
		const allUserTasks = [...state.tasks, ...state.goals].filter((task) => task.userId === userId);
		const completedTasks = allUserTasks.filter((task) => task.completed);
		const goals = state.goals.filter((goal) => goal.userId === userId);
		const completedGoals = goals.filter((goal) => goal.completed);

		return {
			totalTasks: allUserTasks.length,
			completedTasks: completedTasks.length,
			totalGoals: goals.length,
			completedGoals: completedGoals.length,
			completionRate:
				allUserTasks.length > 0
					? (completedTasks.length / allUserTasks.length) * 100
					: 0,
		};
	});