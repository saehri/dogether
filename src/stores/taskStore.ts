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
						if (response.success) {
							set({ tasks: response.data || [], isLoading: false });
						} else {
							set({ error: response.message || 'Failed to fetch tasks', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to fetch tasks', isLoading: false });
					}
				},

				// Create new task
				createTask: async (taskData) => {
					set({ isLoading: true, error: null });
					try {
						const response = await taskApi.createTask(taskData);
						if (response.success) {
							const newTask = response.data;
							set((state) => ({
								tasks: [...state.tasks, newTask],
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to create task', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to create task', isLoading: false });
					}
				},

				// Update task
				updateTask: async (taskId, updates) => {
					set({ isLoading: true, error: null });
					try {
						const response = await taskApi.updateTask(taskId, updates);
						if (response.success) {
							set((state) => ({
								tasks: state.tasks.map(task =>
									task.id === taskId ? { ...task, ...response.data } : task
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
						if (response.success) {
							set({ goals: response.data || [], isLoading: false });
						} else {
							set({ error: response.message || 'Failed to fetch goals', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to fetch goals', isLoading: false });
					}
				},

				// Create new goal
				createGoal: async (goalData) => {
					set({ isLoading: true, error: null });
					try {
						const response = await goalApi.createGoal(goalData);
						if (response.success) {
							const newGoal = response.data;
							set((state) => ({
								goals: [...state.goals, newGoal],
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to create goal', isLoading: false });
						}
					} catch (error: any) {
						set({ error: error.message || 'Failed to create goal', isLoading: false });
					}
				},

				// Update goal
				updateGoal: async (goalId, updates) => {
					set({ isLoading: true, error: null });
					try {
						const response = await goalApi.updateGoal(goalId, updates);
						if (response.success) {
							set((state) => ({
								goals: state.goals.map(goal =>
									goal.id === goalId ? { ...goal, ...response.data } : goal
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
						const response = await goalApi.deleteGoal(goalId);
						if (response.success) {
							set((state) => ({
								goals: state.goals.filter(goal => goal.id !== goalId),
								isLoading: false
							}));
						} else {
							set({ error: response.message || 'Failed to delete goal', isLoading: false });
						}
					} catch (error: any) {
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
						const response = await goalApi.updateGoalProgress(goalId, { progress });
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