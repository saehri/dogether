import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from './constants';

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

interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

const withTimeout = (promise: Promise<Response>, timeoutMs: number): Promise<Response> => {
  return Promise.race([
    promise,
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = API_TIMEOUT
  } = config;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const finalHeaders = { ...defaultHeaders, ...headers };

  const requestOptions: RequestInit = {
    method,
    headers: finalHeaders,
  };

  if (body && method !== 'GET') {
    if (body instanceof FormData) {
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

      if (response.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }

      throw apiError;
    }

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

    const apiError = new ApiError({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'NETWORK_ERROR',
    });

    throw apiError;
  }
}

export const setAuthToken = (token: string) => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};