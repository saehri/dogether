import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setUser: (user) => set({ user }),
        
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (error) => set({ error }),
        
        login: (user, token) => {
          localStorage.setItem('authToken', token);
          set({
            user,
            isAuthenticated: true,
            error: null,
          });
        },
        
        logout: () => {
          localStorage.removeItem('authToken');
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        },
        
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);

// Selectors
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  setUser: state.setUser,
  setAuthenticated: state.setAuthenticated,
  setLoading: state.setLoading,
  setError: state.setError,
  login: state.login,
  logout: state.logout,
  clearError: state.clearError,
}));