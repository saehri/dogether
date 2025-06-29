// API service layer for future external API integration
// Currently uses local storage via Zustand, but can be easily switched to real API calls

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 seconds

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    timeout: API_TIMEOUT,
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new ApiError({
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      });
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// User API endpoints
export const userApi = {
  getProfile: (userId: string) => 
    apiRequest(`/users/${userId}`),
  
  updateProfile: (userId: string, updates: any) =>
    apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  addBadge: (userId: string, badgeId: string) =>
    apiRequest(`/users/${userId}/badges`, {
      method: 'POST',
      body: JSON.stringify({ badgeId }),
    }),
};

// Task API endpoints
export const taskApi = {
  getTasks: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiRequest(`/tasks${query}`);
  },
  
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
  
  completeTask: (taskId: string, evidence?: FormData) =>
    apiRequest(`/tasks/${taskId}/complete`, {
      method: 'POST',
      body: evidence,
      headers: evidence ? {} : { 'Content-Type': 'application/json' },
    }),
};

// Friend API endpoints
export const friendApi = {
  getFriends: (userId: string) =>
    apiRequest(`/users/${userId}/friends`),
  
  addFriend: (userId: string, friendId: string) =>
    apiRequest(`/users/${userId}/friends`, {
      method: 'POST',
      body: JSON.stringify({ friendId }),
    }),
  
  removeFriend: (userId: string, friendId: string) =>
    apiRequest(`/users/${userId}/friends/${friendId}`, {
      method: 'DELETE',
    }),
  
  updateStatus: (userId: string, isOnline: boolean) =>
    apiRequest(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isOnline }),
    }),
};

// Badge API endpoints
export const badgeApi = {
  getBadges: () =>
    apiRequest('/badges'),
  
  createBadge: (badge: any) =>
    apiRequest('/badges', {
      method: 'POST',
      body: JSON.stringify(badge),
    }),
  
  updateBadge: (badgeId: string, updates: any) =>
    apiRequest(`/badges/${badgeId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  deleteBadge: (badgeId: string) =>
    apiRequest(`/badges/${badgeId}`, {
      method: 'DELETE',
    }),
};

// Upload API endpoints
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiRequest('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
  
  uploadEvidence: (taskId: string, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('evidence', file);
    if (caption) formData.append('caption', caption);
    
    return apiRequest(`/tasks/${taskId}/evidence`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// Error handling utility
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

// Request interceptor for adding auth tokens (when implemented)
export const setAuthToken = (token: string) => {
  // This would be used to set authorization headers for all requests
  // Implementation depends on your auth strategy
};

// Response interceptor for handling common errors
export const handleApiError = (error: ApiError) => {
  switch (error.status) {
    case 401:
      // Handle unauthorized - redirect to login
      console.error('Unauthorized access');
      break;
    case 403:
      // Handle forbidden
      console.error('Access forbidden');
      break;
    case 404:
      // Handle not found
      console.error('Resource not found');
      break;
    case 500:
      // Handle server error
      console.error('Server error');
      break;
    default:
      console.error('API error:', error.message);
  }
};