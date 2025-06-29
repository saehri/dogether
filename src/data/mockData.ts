import { User, Task, Friend, Badge } from '../types';

// Empty initial data - app should handle when no data exists
export const currentUser: User = {
  id: '1',
  name: '',
  username: '',
  email: '',
  avatar: '',
  badges: [],
  friends: []
};

export const badges: Badge[] = [];

export const friends: Friend[] = [];

export const tasks: Task[] = [];

// Extended mock data for friend search functionality
export interface SearchableUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  mutualFriends: number;
  isOnline?: boolean;
  bio?: string;
  location?: string;
  joinedDate?: Date;
  badges?: Badge[];
}

export const searchableUsers: SearchableUser[] = [];

// Mock friend requests data
export interface FriendRequest {
  id: string;
  fromUser: SearchableUser;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  message?: string;
}

export const friendRequests: FriendRequest[] = [];

// Enhanced search function with better matching and ranking
export const simulateUserSearch = (query: string, excludeIds: string[] = []): SearchableUser[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery || normalizedQuery.length < 2) return [];
  
  // Return empty results since we have no mock data
  return [];
};

// Function to get mutual friends
export const getMutualFriends = (userId: string, currentUserFriends: string[]): string[] => {
  return [];
};

// Function to simulate sending friend request with more realistic behavior
export const simulateSendFriendRequest = (toUserId: string, message?: string): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: false, message: 'No users available to add as friends' });
    }, 500);
  });
};

// Function to get search suggestions
export const getSearchSuggestions = (query: string): string[] => {
  return [];
};