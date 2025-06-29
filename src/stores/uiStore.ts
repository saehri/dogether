import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isLoading: boolean;
  error: string | null;
  isSidebarOpen: boolean;
  isCreateTaskModalOpen: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface UIActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCreateTaskModalOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  isLoading: false,
  error: null,
  isSidebarOpen: false,
  isCreateTaskModalOpen: false,
  theme: 'light',
};

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      setCreateTaskModalOpen: (open) => set({ isCreateTaskModalOpen: open }),
      
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-store' }
  )
);

// Selectors
export const useUI = () => useUIStore((state) => ({
  isLoading: state.isLoading,
  error: state.error,
  isSidebarOpen: state.isSidebarOpen,
  isCreateTaskModalOpen: state.isCreateTaskModalOpen,
  theme: state.theme,
}));

export const useUIActions = () => useUIStore((state) => ({
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
  setCreateTaskModalOpen: state.setCreateTaskModalOpen,
  setTheme: state.setTheme,
}));