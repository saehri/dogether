import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Task } from '@/types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type TaskStore = TaskState & TaskActions;

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setTasks: (tasks) => set({ tasks }),
        
        addTask: (task) => set((state) => ({
          tasks: [...state.tasks, task],
        })),
        
        updateTask: (taskId, updates) => set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),
        
        deleteTask: (taskId) => set((state) => ({
          tasks: state.tasks.filter(task => task.id !== taskId),
        })),
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (error) => set({ error }),
        
        clearError: () => set({ error: null }),
      }),
      {
        name: 'task-store',
        partialize: (state) => ({
          tasks: state.tasks,
        }),
      }
    ),
    { name: 'task-store' }
  )
);

// Selectors
export const useTasks = () => useTaskStore((state) => state.tasks);

export const useTaskActions = () => useTaskStore((state) => ({
  setTasks: state.setTasks,
  addTask: state.addTask,
  updateTask: state.updateTask,
  deleteTask: state.deleteTask,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
}));

export const useTasksLoading = () => useTaskStore((state) => state.isLoading);

export const useTasksError = () => useTaskStore((state) => state.error);

// Computed selectors
export const useUserTasks = (userId: string) => 
  useTaskStore((state) => state.tasks.filter(task => task.userId === userId));

export const useCompletedTasks = (userId: string) =>
  useTaskStore((state) => state.tasks.filter(task => task.userId === userId && task.completed));

export const useTaskStats = (userId: string) =>
  useTaskStore((state) => {
    const userTasks = state.tasks.filter(task => task.userId === userId);
    const completedTasks = userTasks.filter(task => task.completed);
    const goals = userTasks.filter(task => task.type === 'goal');
    const completedGoals = goals.filter(goal => goal.completed);
    
    return {
      totalTasks: userTasks.length,
      completedTasks: completedTasks.length,
      totalGoals: goals.length,
      completedGoals: completedGoals.length,
      completionRate: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0,
    };
  });