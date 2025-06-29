// API utility functions and configuration
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

// Generic API request function using fetch
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token from localStorage
  const token = getAuthToken();
  
  // Default headers
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add auth header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Parse response
    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Handle HTTP errors
    if (!response.ok) {
      throw new ApiError({
        message: data?.message || `HTTP ${response.status}: ${response.statusText}`,
        code: data?.code || response.status.toString(),
        status: response.status,
      });
    }
    
    return {
      data,
      success: true,
      message: data?.message,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError({
          message: 'Request timeout',
          code: 'TIMEOUT',
        });
      }
      
      throw new ApiError({
        message: error.message || 'Network error occurred',
        code: 'NETWORK_ERROR',
      });
    }
    
    throw new ApiError({
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    });
  }
}

// Auth token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Handle common API errors
export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Handle unauthorized - redirect to login
        removeAuthToken();
        window.location.href = '/auth/login';
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
        console.error('API error:', error.message);
    }
  } else {
    console.error('Unexpected error:', error);
  }
};