import axios, { AxiosResponse } from 'axios';

// API service layer for external API integration
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export class ApiError extends Error {
  public code?: string;
  public status?: number;

  constructor({ message, code, status }: { message: string; code?: string; status?: number }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// Base API configuration - Updated to use the correct backend URL
const API_BASE_URL = 'https://dogether.etalasepro.com/api';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const apiError = new ApiError({
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: error.response?.data?.code || error.code,
      status: error.response?.status,
    });

    // Handle common errors
    switch (error.response?.status) {
      case 401:
        // Handle unauthorized - redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        break;
      case 403:
        console.error('Access forbidden');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Server error');
        break;
      default:
        console.error('API error:', apiError.message);
    }

    return Promise.reject(apiError);
  }
);

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: any = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request({
      url: endpoint,
      ...options,
    });

    return {
      data: response.data,
      success: true,
      message: response.data?.message,
    };
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/login', {
      method: 'POST',
      data: credentials,
    }),

  register: (userData: { 
    username: string; 
    fullname: string; 
    email: string; 
    password: string; 
    date_of_birth: string; 
  }) =>
    apiRequest('/register', {
      method: 'POST',
      data: userData,
    }),

  googleAuth: (token: string) =>
    apiRequest('/google', {
      method: 'POST',
      data: { token },
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  refreshToken: () =>
    apiRequest('/auth/refresh', {
      method: 'POST',
    }),
};

// User API endpoints
export const userApi = {
  getProfile: (userId?: string) => {
    // Use the profile endpoint for current user, or specific user endpoint if userId provided
    const endpoint = userId ? `/users/${userId}` : '/profile';
    return apiRequest(endpoint);
  },

  updateProfile: (userId: string, updates: any) =>
    apiRequest(`/users/${userId}`, {
      method: 'PUT',
      data: updates,
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
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  addBadge: (userId: string, badgeId: string) =>
    apiRequest(`/users/${userId}/badges`, {
      method: 'POST',
      data: { badgeId },
    }),

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
      data: task,
    }),

  updateTask: (taskId: string, updates: any) =>
    apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      data: updates,
    }),

  deleteTask: (taskId: string) =>
    apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  completeTask: (taskId: string, evidence?: FormData) => {
    const config: any = {
      method: 'POST',
    };

    if (evidence) {
      config.data = evidence;
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }

    return apiRequest(`/tasks/${taskId}/complete`, config);
  },

  addProgress: (taskId: string, progressData: any) =>
    apiRequest(`/tasks/${taskId}/progress`, {
      method: 'POST',
      data: progressData,
    }),
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
      data: { userId },
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

  updateStatus: (isOnline: boolean) =>
    apiRequest('/users/status', {
      method: 'PUT',
      data: { isOnline },
    }),
};

// Badge API endpoints
export const badgeApi = {
  getBadges: () =>
    apiRequest('/badges'),

  getUserBadges: (userId?: string) => {
    const endpoint = userId ? `/users/${userId}/badges` : '/users/me/badges';
    return apiRequest(endpoint);
  },

  createBadge: (badge: any) =>
    apiRequest('/badges', {
      method: 'POST',
      data: badge,
    }),

  updateBadge: (badgeId: string, updates: any) =>
    apiRequest(`/badges/${badgeId}`, {
      method: 'PUT',
      data: updates,
    }),

  deleteBadge: (badgeId: string) =>
    apiRequest(`/badges/${badgeId}`, {
      method: 'DELETE',
    }),

  checkBadgeEligibility: (userId: string) =>
    apiRequest(`/users/${userId}/badges/check`),
};

// Feed API endpoints
export const feedApi = {
  getFeed: (page = 1, limit = 20) =>
    apiRequest(`/feed?page=${page}&limit=${limit}`),

  getFriendsFeed: (page = 1, limit = 20) =>
    apiRequest(`/feed/friends?page=${page}&limit=${limit}`),

  likePost: (postId: string) =>
    apiRequest(`/feed/${postId}/like`, {
      method: 'POST',
    }),

  unlikePost: (postId: string) =>
    apiRequest(`/feed/${postId}/like`, {
      method: 'DELETE',
    }),

  sharePost: (postId: string) =>
    apiRequest(`/feed/${postId}/share`, {
      method: 'POST',
    }),
};

// Upload API endpoints
export const uploadApi = {
  uploadImage: (file: File, type: 'avatar' | 'evidence' | 'general' = 'general') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    return apiRequest('/upload/image', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadEvidence: (taskId: string, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('evidence', file);
    if (caption) formData.append('caption', caption);

    return apiRequest(`/tasks/${taskId}/evidence`, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteImage: (imageId: string) =>
    apiRequest(`/upload/image/${imageId}`, {
      method: 'DELETE',
    }),
};

// Notification API endpoints
export const notificationApi = {
  getNotifications: (page = 1, limit = 20) =>
    apiRequest(`/notifications?page=${page}&limit=${limit}`),

  markAsRead: (notificationId: string) =>
    apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),

  markAllAsRead: () =>
    apiRequest('/notifications/read-all', {
      method: 'PUT',
    }),

  deleteNotification: (notificationId: string) =>
    apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    }),

  getUnreadCount: () =>
    apiRequest('/notifications/unread-count'),
};

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Health check
export const healthCheck = () =>
  apiRequest('/health');

// Export the configured axios instance for custom requests
export { apiClient };