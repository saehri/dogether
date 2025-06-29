import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Task, Friend, Badge } from '../types';
import { currentUser as initialUser, tasks as initialTasks, friends as initialFriends, badges as initialBadges } from '../data/mockData';

interface AppState {
  // User state
  currentUser: User;
  users: User[];
  
  // Tasks state
  tasks: Task[];
  
  // Friends state
  friends: Friend[];
  
  // Badges state
  badges: Badge[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  // User actions
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  addBadgeToUser: (userId: string, badgeId: string) => Promise<void>;
  
  // Task actions
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string, evidence?: File) => Promise<void>;
  
  // Friend actions
  addFriend: (friendId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  updateFriendStatus: (friendId: string, isOnline: boolean) => Promise<void>;
  
  // Badge actions
  createBadge: (badge: Omit<Badge, 'id'>) => Promise<Badge>;
  updateBadge: (badgeId: string, updates: Partial<Badge>) => Promise<void>;
  deleteBadge: (badgeId: string) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetStore: () => void;
}

type Store = AppState & AppActions;

// Simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Date reviver function to convert ISO date strings back to Date objects
const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

// Recursively apply date reviver to nested objects
const reviveNestedDates = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(reviveNestedDates);
  }
  
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = reviveNestedDates(dateReviver(key, value));
  }
  return result;
};

const initialState: AppState = {
  currentUser: initialUser,
  users: [initialUser],
  tasks: initialTasks,
  friends: initialFriends,
  badges: initialBadges,
  isLoading: false,
  error: null,
};

export const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User actions
        updateUser: async (userId: string, updates: Partial<User>) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            set((state) => ({
              currentUser: state.currentUser.id === userId 
                ? { ...state.currentUser, ...updates }
                : state.currentUser,
              users: state.users.map(user => 
                user.id === userId ? { ...user, ...updates } : user
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to update user', isLoading: false });
            throw error;
          }
        },

        addBadgeToUser: async (userId: string, badgeId: string) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            const badge = get().badges.find(b => b.id === badgeId);
            if (!badge) throw new Error('Badge not found');

            const badgeWithDate = { ...badge, unlockedAt: new Date() };

            set((state) => ({
              currentUser: state.currentUser.id === userId
                ? { ...state.currentUser, badges: [...state.currentUser.badges, badgeWithDate] }
                : state.currentUser,
              users: state.users.map(user =>
                user.id === userId
                  ? { ...user, badges: [...user.badges, badgeWithDate] }
                  : user
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to add badge to user', isLoading: false });
            throw error;
          }
        },

        // Task actions
        createTask: async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            const newTask: Task = {
              ...taskData,
              id: generateId(),
              createdAt: new Date(),
            };

            set((state) => ({
              tasks: [...state.tasks, newTask],
              isLoading: false,
            }));

            return newTask;
          } catch (error) {
            set({ error: 'Failed to create task', isLoading: false });
            throw error;
          }
        },

        updateTask: async (taskId: string, updates: Partial<Task>) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            set((state) => ({
              tasks: state.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to update task', isLoading: false });
            throw error;
          }
        },

        deleteTask: async (taskId: string) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            set((state) => ({
              tasks: state.tasks.filter(task => task.id !== taskId),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to delete task', isLoading: false });
            throw error;
          }
        },

        completeTask: async (taskId: string, evidence?: File) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            const updates: Partial<Task> = {
              completed: true,
              completedAt: new Date(),
            };

            // Handle evidence upload (simulate)
            if (evidence) {
              const evidenceUrl = URL.createObjectURL(evidence);
              updates.evidence = {
                id: generateId(),
                imageUrl: evidenceUrl,
                caption: `Evidence for task completion`,
                uploadedAt: new Date(),
              };
            }

            // Update goal progress if it's a goal
            const task = get().tasks.find(t => t.id === taskId);
            if (task?.type === 'goal' && task.goalDetails) {
              updates.goalDetails = {
                ...task.goalDetails,
                currentCount: task.goalDetails.currentCount + 1,
              };
              
              // Check if goal is completed
              if (updates.goalDetails.currentCount >= task.goalDetails.targetCount) {
                updates.completed = true;
                updates.completedAt = new Date();
              } else {
                updates.completed = false;
                delete updates.completedAt;
              }
            }

            set((state) => ({
              tasks: state.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to complete task', isLoading: false });
            throw error;
          }
        },

        // Friend actions
        addFriend: async (friendId: string) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            const friend = get().friends.find(f => f.id === friendId);
            if (!friend) throw new Error('Friend not found');

            set((state) => ({
              currentUser: {
                ...state.currentUser,
                friends: [...state.currentUser.friends, friendId],
              },
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to add friend', isLoading: false });
            throw error;
          }
        },

        removeFriend: async (friendId: string) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            set((state) => ({
              currentUser: {
                ...state.currentUser,
                friends: state.currentUser.friends.filter(id => id !== friendId),
              },
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to remove friend', isLoading: false });
            throw error;
          }
        },

        updateFriendStatus: async (friendId: string, isOnline: boolean) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            set((state) => ({
              friends: state.friends.map(friend =>
                friend.id === friendId ? { ...friend, isOnline } : friend
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to update friend status', isLoading: false });
            throw error;
          }
        },

        // Badge actions
        createBadge: async (badgeData: Omit<Badge, 'id'>) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            const newBadge: Badge = {
              ...badgeData,
              id: generateId(),
            };

            set((state) => ({
              badges: [...state.badges, newBadge],
              isLoading: false,
            }));

            return newBadge;
          } catch (error) {
            set({ error: 'Failed to create badge', isLoading: false });
            throw error;
          }
        },

        updateBadge: async (badgeId: string, updates: Partial<Badge>) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            set((state) => ({
              badges: state.badges.map(badge =>
                badge.id === badgeId ? { ...badge, ...updates } : badge
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to update badge', isLoading: false });
            throw error;
          }
        },

        deleteBadge: async (badgeId: string) => {
          set({ isLoading: true, error: null });
          try {
            await simulateApiDelay();
            
            set((state) => ({
              badges: state.badges.filter(badge => badge.id !== badgeId),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: 'Failed to delete badge', isLoading: false });
            throw error;
          }
        },

        // Utility actions
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        setError: (error: string | null) => set({ error }),
        resetStore: () => set(initialState),
      }),
      {
        name: 'dogether-store',
        partialize: (state) => ({
          currentUser: state.currentUser,
          tasks: state.tasks,
          friends: state.friends,
          badges: state.badges,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Apply date revival to the rehydrated state
            const revivedState = reviveNestedDates(state);
            Object.assign(state, revivedState);
          }
        },
      }
    ),
    { name: 'dogether-store' }
  )
);

// Selectors for better performance
export const useCurrentUser = () => useStore((state) => state.currentUser);
export const useTasks = () => useStore((state) => state.tasks);
export const useFriends = () => useStore((state) => state.friends);
export const useBadges = () => useStore((state) => state.badges);
export const useLoading = () => useStore((state) => state.isLoading);
export const useError = () => useStore((state) => state.error);

// Computed selectors
export const useUserTasks = (userId: string) => 
  useStore((state) => state.tasks.filter(task => task.userId === userId));

export const useCompletedTasks = (userId: string) =>
  useStore((state) => state.tasks.filter(task => task.userId === userId && task.completed));

export const useUserStats = (userId: string) =>
  useStore((state) => {
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