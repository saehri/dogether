import {
	apiRequest,
	setAuthToken,
	removeAuthToken,
	getAuthToken,
	ApiResponse,
} from '../utils/api';

// Authentication API endpoints
export const authApi = {
	login: async (credentials: {
		login: string;
		password: string;
	}): Promise<ApiResponse<any>> => {
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

	resetPassword: async (
		token: string,
		password: string
	): Promise<ApiResponse<any>> => {
		return apiRequest('/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify({ token, password }),
		});
	},
};

// Task API endpoints (menggunakan endpoint /todos)
export const taskApi = {
	// Get all tasks/todos - menggunakan query parameters untuk filter
	getTasks: (filters?: any) => {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.append(key, String(value));
				}
			});
		}
		const query = params.toString() ? `?${params.toString()}` : '';
		console.log('Fetching tasks from:', `/todos${query}`);
		return apiRequest(`/todos${query}`);
	},

	// Get single task
	getTask: (taskId: string) => apiRequest(`/todos/${taskId}`),

	// Create new task
	createTask: (task: any) => {
		console.log('Creating task with data:', task);
		// Convert to form data for API compatibility
		const formData = new FormData();
		formData.append('title', task.title);
		formData.append('description', task.description);

		console.log('FormData contents:');
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}

		return apiRequest('/todos', {
			method: 'POST',
			body: formData,
			headers: {}, // Let browser set Content-Type for FormData
		});
	},

	// Update task
	updateTask: (taskId: string, updates: any) => {
		const formData = new FormData();
		Object.entries(updates).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, String(value));
			}
		});

		return apiRequest(`/todos/${taskId}`, {
			method: 'PUT',
			body: formData,
			headers: {},
		});
	},

	// Delete task
	deleteTask: (taskId: string) =>
		apiRequest(`/todos/${taskId}`, {
			method: 'DELETE',
		}),

	// Complete task
	completeTask: (taskId: string, evidence?: FormData) => {
		const config: RequestInit = {
			method: 'POST',
		};

		if (evidence) {
			config.body = evidence;
			config.headers = {}; // Let browser set Content-Type for FormData
		}

		return apiRequest(`/todos/${taskId}/complete`, config);
	},
};

// Goal API endpoints (menggunakan endpoint /goals)
export const goalApi = {
	// Get all goals - FIXED: Menggunakan query parameters instead of body
	getGoals: (filters?: any) => {
		const params = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.append(key, String(value));
				}
			});
		}
		const query = params.toString() ? `?${params.toString()}` : '';

		console.log('Fetching goals from:', `/goals${query}`);
		// GET request tanpa body, menggunakan query parameters
		return apiRequest(`/goals${query}`, {
			method: 'GET',
		});
	},

	// Get single goal
	getGoal: (goalId: string) => apiRequest(`/goals/${goalId}`),

	// Create new goal
	createGoal: (goal: any) => {
		console.log('Creating goal with data:', goal);
		// Convert to form data for API compatibility
		const formData = new FormData();
		formData.append('title', goal.title);
		formData.append('description', goal.description);

		// Add goal-specific fields if they exist
		if (goal.start_date) formData.append('start_date', goal.start_date);
		if (goal.end_date) formData.append('end_date', goal.end_date);
		if (goal.current_streak !== undefined)
			formData.append('current_streak', String(goal.current_streak));
		if (goal.is_active !== undefined)
			formData.append('is_active', String(goal.is_active));

		console.log('FormData contents:');
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}

		return apiRequest('/goals', {
			method: 'POST',
			body: formData,
			headers: {}, // Let browser set Content-Type for FormData
		});
	},

	// Update goal
	updateGoal: (goalId: string, updates: any) => {
		const formData = new FormData();
		Object.entries(updates).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, String(value));
			}
		});

		return apiRequest(`/goals/${goalId}`, {
			method: 'PUT',
			body: formData,
			headers: {},
		});
	},

	// Delete goal - FIXED: Menggunakan query parameters untuk required fields
	deleteGoal: (
		goalId: string,
		goalData?: { title?: string; description?: string }
	) => {
		// Jika API memerlukan title dan description untuk DELETE, gunakan query parameters
		const params = new URLSearchParams();
		if (goalData?.title) params.append('title', goalData.title);
		if (goalData?.description)
			params.append('description', goalData.description);
		const query = params.toString() ? `?${params.toString()}` : '';

		return apiRequest(`/goals/${goalId}${query}`, {
			method: 'DELETE',
		});
	},

	// Update goal progress
	updateGoalProgress: (goalId: string, progress: any) => {
		const formData = new FormData();
		formData.append(
			'current_streak',
			String(progress.current_streak || progress)
		);

		return apiRequest(`/goals/${goalId}/progress`, {
			method: 'POST',
			body: formData,
			headers: {},
		});
	},

	// Complete goal
	completeGoal: (goalId: string, evidence?: FormData) => {
		const config: RequestInit = {
			method: 'POST',
		};

		if (evidence) {
			config.body = evidence;
			config.headers = {}; // Let browser set Content-Type for FormData
		}

		return apiRequest(`/goals/${goalId}/complete`, config);
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

	getUserStats: (userId: string) => apiRequest(`/users/${userId}/stats`),
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

	getFriendRequests: () => apiRequest('/friends/requests'),
};

// Re-export auth token utilities
export { setAuthToken, removeAuthToken, getAuthToken };

// Health check
export const healthCheck = () => apiRequest('/health');

