import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '../types';
import { userApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  changePassword: (passwordData: any) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Helper function to transform API user data to our User type
const transformApiUserToUser = (apiUser: any): User => {
  return {
    id: String(apiUser.id),
    name: apiUser.fullname || apiUser.name || '',
    username: apiUser.username || '',
    email: apiUser.email || '',
    avatar: apiUser.profile_picture || apiUser.avatar || '',
    bio: apiUser.bio || '',
    badges: [], // Will be populated from badges API
    friends: [], // Will be populated from friends API
    createdAt: apiUser.created_at ? new Date(apiUser.created_at) : new Date(),
    settings: {
      theme: 'light',
      notifications: true,
      privacy: 'public'
    }
  };
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),

        login: (user, token) => {
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          });
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        },

        clearError: () => set({ error: null }),

        // Fetch current user profile from API
        fetchProfile: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await userApi.getProfile();
            console.log('Fetch profile response:', response);
            
            if (response.success && response.data) {
              const userData = response.data.user || response.data.data || response.data;
              const user = transformApiUserToUser(userData);
              console.log('Transformed user:', user);
              
              set({ 
                user, 
                isLoading: false,
                isAuthenticated: true 
              });
            } else {
              console.warn('No user data in profile response:', response);
              set({ 
                error: response.message || 'Failed to fetch profile',
                isLoading: false 
              });
            }
          } catch (error: any) {
            console.error('Fetch profile error:', error);
            set({ 
              error: error.message || 'Failed to fetch profile', 
              isLoading: false 
            });
          }
        },

        // Update user profile
        updateProfile: async (updates) => {
          set({ isLoading: true, error: null });
          try {
            console.log('Updating profile with data:', updates);
            const response = await userApi.updateProfile(updates);
            console.log('Update profile response:', response);
            
            if (response.success && response.data) {
              const userData = response.data.user || response.data.data || response.data;
              const updatedUser = transformApiUserToUser(userData);
              console.log('Updated user:', updatedUser);
              
              set({ 
                user: updatedUser, 
                isLoading: false 
              });
            } else {
              console.error('Update profile failed:', response);
              set({ 
                error: response.message || 'Failed to update profile', 
                isLoading: false 
              });
            }
          } catch (error: any) {
            console.error('Update profile error:', error);
            set({ 
              error: error.message || 'Failed to update profile', 
              isLoading: false 
            });
          }
        },

        // Change password
        changePassword: async (passwordData) => {
          set({ isLoading: true, error: null });
          try {
            console.log('Changing password...');
            const response = await userApi.changePassword(passwordData);
            console.log('Change password response:', response);
            
            if (response.success) {
              set({ isLoading: false });
              // Password changed successfully, no need to update user data
            } else {
              console.error('Change password failed:', response);
              set({ 
                error: response.message || 'Failed to change password', 
                isLoading: false 
              });
            }
          } catch (error: any) {
            console.error('Change password error:', error);
            set({ 
              error: error.message || 'Failed to change password', 
              isLoading: false 
            });
          }
        },

        // Upload profile picture
        uploadProfilePicture: async (file) => {
          set({ isLoading: true, error: null });
          try {
            console.log('Uploading profile picture...');
            const response = await userApi.uploadProfilePicture(file);
            console.log('Upload profile picture response:', response);
            
            if (response.success && response.data) {
              const userData = response.data.user || response.data.data || response.data;
              const updatedUser = transformApiUserToUser(userData);
              console.log('Updated user with new picture:', updatedUser);
              
              set({ 
                user: updatedUser, 
                isLoading: false 
              });
            } else {
              console.error('Upload profile picture failed:', response);
              set({ 
                error: response.message || 'Failed to upload profile picture', 
                isLoading: false 
              });
            }
          } catch (error: any) {
            console.error('Upload profile picture error:', error);
            set({ 
              error: error.message || 'Failed to upload profile picture', 
              isLoading: false 
            });
          }
        },

        // Delete account
        deleteAccount: async () => {
          set({ isLoading: true, error: null });
          try {
            console.log('Deleting account...');
            const response = await userApi.deleteAccount();
            console.log('Delete account response:', response);
            
            if (response.success) {
              // Account deleted successfully, logout user
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            } else {
              console.error('Delete account failed:', response);
              set({ 
                error: response.message || 'Failed to delete account', 
                isLoading: false 
              });
            }
          } catch (error: any) {
            console.error('Delete account error:', error);
            set({ 
              error: error.message || 'Failed to delete account', 
              isLoading: false 
            });
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);

// State selector
export const useAuth = (): AuthState =>
  useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));

// Actions selector
export const useAuthActions = (): AuthActions =>
  useAuthStore((state) => ({
    setUser: state.setUser,
    setToken: state.setToken,
    setAuthenticated: state.setAuthenticated,
    setLoading: state.setLoading,
    setError: state.setError,
    login: state.login,
    logout: state.logout,
    clearError: state.clearError,
    fetchProfile: state.fetchProfile,
    updateProfile: state.updateProfile,
    changePassword: state.changePassword,
    uploadProfilePicture: state.uploadProfilePicture,
    deleteAccount: state.deleteAccount,
  }));