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

// Base API configuration
const API_BASE_URL = 'https://dogether.etalasepro.com/api';
const API_TIMEOUT = 10000; // 10 seconds

// Request configuration interface
interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// Timeout helper function
const withTimeout = (promise: Promise<Response>, timeoutMs: number): Promise<Response> => {
  return Promise.race([
    promise,
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

// Generic API request function using fetch
async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = API_TIMEOUT
  } = config;

  // Prepare headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const finalHeaders = { ...defaultHeaders, ...headers };

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers: finalHeaders,
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    if (body instanceof FormData) {
      // Remove Content-Type for FormData (browser will set it with boundary)
      delete finalHeaders['Content-Type'];
      requestOptions.body = body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  try {
    const response = await withTimeout(
      fetch(`${API_BASE_URL}${endpoint}`, requestOptions),
      timeout
    );

    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData: any = null;

      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
      }

      const apiError = new ApiError({
        message: errorMessage,
        code: errorData?.code,
        status: response.status,
      });

      // Handle common errors
      switch (response.status) {
        case 401:
          // Handle unauthorized - redirect to login
          localStorage.removeItem('authToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
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

      throw apiError;
    }

    // Parse response
    let responseData: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return {
      data: responseData,
      success: true,
      message: responseData?.message,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors, timeouts, etc.
    const apiError = new ApiError({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'NETWORK_ERROR',
    });

    console.error('API request failed:', apiError);
    throw apiError;
  }
}

// Authentication API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/login', {
      method: 'POST',
      body: credentials,
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
      body: userData,
    }),

  googleAuth: (token: string) =>
    apiRequest('/google', {
      method: 'POST',
      body: { token },
    }),

  logout: () =>
    apiRequest('/logout', {
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
      body: updates,
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
    });
  },

  addBadge: (userId: string, badgeId: string) =>
    apiRequest(`/users/${userId}/badges`, {
      method: 'POST',
      body: { badgeId },
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
      body: task,
    }),

  updateTask: (taskId: string, updates: any) =>
    apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: updates,
    }),

  deleteTask: (taskId: string) =>
    apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  completeTask: (taskId: string, evidence?: FormData) => {
    const config: RequestConfig = {
      method: 'POST',
    };

    if (evidence) {
      config.body = evidence;
    }

    return apiRequest(`/tasks/${taskId}/complete`, config);
  },

  addProgress: (taskId: string, progressData: any) =>
    apiRequest(`/tasks/${taskId}/progress`, {
      method: 'POST',
      body: progressData,
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
      body: { userId },
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
      body: { isOnline },
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
      body: badge,
    }),

  updateBadge: (badgeId: string, updates: any) =>
    apiRequest(`/badges/${badgeId}`, {
      method: 'PUT',
      body: updates,
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
      body: formData,
    });
  },

  uploadEvidence: (taskId: string, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('evidence', file);
    if (caption) formData.append('caption', caption);

    return apiRequest(`/tasks/${taskId}/evidence`, {
      method: 'POST',
      body: formData,
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