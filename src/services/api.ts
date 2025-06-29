import { apiRequest, setAuthToken, removeAuthToken, getAuthToken, ApiResponse } from '@/utils/api';

// Authentication API endpoints
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<any>> => {
    return apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: { 
    username: string; 
    fullname: string; 
    email: string; 
    password: string; 
    date_of_birth: string; 
  }): Promise<ApiResponse<any>> => {
    return apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  googleAuth: async (token: string): Promise<ApiResponse<any>> => {
    return apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  logout: async (): Promise<ApiResponse<any>> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  refreshToken: async (): Promise<ApiResponse<any>> => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },

  verifyEmail: async (token: string): Promise<ApiResponse<any>> => {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<any>> => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};

// User API endpoints
export const userApi = {
  getProfile: (userId?: string) => {
    const endpoint = userId ? `/users/${userId}` : '/profile';
    return apiRequest(endpoint);
  },

  updateProfile: (userId: string, updates: any) =>
    apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteProfile: (userId: string) =>
    apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiRequest('/users/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  getUserStats: (userId: string) =>
    apiRequest(`/users/${userId}/stats`),
};

// Task API endpoints
export const taskApi = {
  getTasks: (userId?: string, filters?: any) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/tasks${query}`);
  },

  getTask: (taskId: string) =>
    apiRequest(`/tasks/${taskId}`),

  createTask: (task: any) =>
    apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  updateTask: (taskId: string, updates: any) =>
    apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteTask: (taskId: string) =>
    apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  completeTask: (taskId: string, evidence?: FormData) => {
    const config: RequestInit = {
      method: 'POST',
    };

    if (evidence) {
      config.body = evidence;
      config.headers = {}; // Let browser set Content-Type for FormData
    }

    return apiRequest(`/tasks/${taskId}/complete`, config);
  },
};

// Friend API endpoints
export const friendApi = {
  getFriends: (userId?: string) => {
    const endpoint = userId ? `/users/${userId}/friends` : '/friends';
    return apiRequest(endpoint);
  },

  searchUsers: (query: string) =>
    apiRequest(`/users/search?q=${encodeURIComponent(query)}`),

  sendFriendRequest: (userId: string) =>
    apiRequest('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  acceptFriendRequest: (requestId: string) =>
    apiRequest(`/friends/request/${requestId}/accept`, {
      method: 'POST',
    }),

  rejectFriendRequest: (requestId: string) =>
    apiRequest(`/friends/request/${requestId}/reject`, {
      method: 'POST',
    }),

  removeFriend: (friendId: string) =>
    apiRequest(`/friends/${friendId}`, {
      method: 'DELETE',
    }),

  getFriendRequests: () =>
    apiRequest('/friends/requests'),
};

// Re-export auth token utilities
export { setAuthToken, removeAuthToken, getAuthToken };

// Health check
export const healthCheck = () =>
  apiRequest('/health');