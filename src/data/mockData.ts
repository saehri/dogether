import { User, Task, Friend, Badge } from '../types';

// Mock current user
export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  username: 'alexj',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  badges: [],
  friends: ['friend-1', 'friend-2'],
  createdAt: new Date('2024-01-01'),
  settings: {
    theme: 'light',
    notifications: true,
    privacy: 'public'
  }
};

// Mock tasks
export const tasks: Task[] = [
  {
    id: 'task-1',
    userId: 'user-1',
    title: 'Complete morning workout',
    description: 'Do 30 minutes of cardio and strength training',
    type: 'task',
    priority: 'high',
    dueDate: new Date('2024-12-31'),
    completed: true,
    completedAt: new Date('2024-12-28'),
    createdAt: new Date('2024-12-20'),
    tags: ['fitness', 'health']
  },
  {
    id: 'task-2',
    userId: 'user-1',
    title: 'Read 50 books this year',
    description: 'Challenge myself to read more books',
    type: 'goal',
    priority: 'medium',
    dueDate: new Date('2024-12-31'),
    completed: false,
    createdAt: new Date('2024-01-01'),
    tags: ['reading', 'education'],
    goalDetails: {
      targetCount: 50,
      currentCount: 23,
      unit: 'books'
    }
  },
  {
    id: 'task-3',
    userId: 'user-1',
    title: 'Learn Spanish',
    description: 'Practice Spanish for 30 minutes daily',
    type: 'goal',
    priority: 'medium',
    dueDate: new Date('2024-12-31'),
    completed: false,
    createdAt: new Date('2024-06-01'),
    tags: ['language', 'education'],
    goalDetails: {
      targetCount: 365,
      currentCount: 120,
      unit: 'days'
    }
  }
];

// Mock friends
export const friends: Friend[] = [
  {
    id: 'friend-1',
    name: 'Sarah Wilson',
    username: 'sarahw',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
    lastSeen: new Date(),
    mutualFriends: 5
  },
  {
    id: 'friend-2',
    name: 'Mike Chen',
    username: 'mikec',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: false,
    lastSeen: new Date('2024-12-27'),
    mutualFriends: 3
  },
  {
    id: 'friend-3',
    name: 'Emma Davis',
    username: 'emmad',
    email: 'emma@example.com',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
    lastSeen: new Date(),
    mutualFriends: 8
  }
];

// Mock badges
export const badges: Badge[] = [
  {
    id: 'badge-1',
    name: 'First Steps',
    description: 'Complete your first task',
    icon: '🎯',
    color: 'from-blue-500 to-purple-600',
    criteria: 'Complete 1 task',
    rarity: 'common'
  },
  {
    id: 'badge-2',
    name: 'Goal Getter',
    description: 'Create your first goal',
    icon: '🏆',
    color: 'from-yellow-500 to-orange-600',
    criteria: 'Create 1 goal',
    rarity: 'common'
  },
  {
    id: 'badge-3',
    name: 'Streak Master',
    description: 'Complete tasks for 7 days in a row',
    icon: '🔥',
    color: 'from-red-500 to-pink-600',
    criteria: 'Complete tasks for 7 consecutive days',
    rarity: 'rare'
  },
  {
    id: 'badge-4',
    name: 'Social Butterfly',
    description: 'Add 5 friends',
    icon: '🦋',
    color: 'from-purple-500 to-blue-600',
    criteria: 'Add 5 friends',
    rarity: 'uncommon'
  },
  {
    id: 'badge-5',
    name: 'Overachiever',
    description: 'Complete 100 tasks',
    icon: '⭐',
    color: 'from-green-500 to-emerald-600',
    criteria: 'Complete 100 tasks',
    rarity: 'epic'
  }
];

// Searchable user interface for friend search
export interface SearchableUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location?: string;
  mutualFriends?: number;
  isVerified?: boolean;
}

// Mock searchable users (excluding current user and existing friends)
const searchableUsers: SearchableUser[] = [
  {
    id: 'search-1',
    name: 'John Smith',
    username: 'johnsmith',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'New York, NY',
    mutualFriends: 2,
    isVerified: false
  },
  {
    id: 'search-2',
    name: 'Lisa Rodriguez',
    username: 'lisar',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Los Angeles, CA',
    mutualFriends: 1,
    isVerified: true
  },
  {
    id: 'search-3',
    name: 'David Kim',
    username: 'davidk',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Seattle, WA',
    mutualFriends: 0,
    isVerified: false
  },
  {
    id: 'search-4',
    name: 'Maria Garcia',
    username: 'mariag',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Miami, FL',
    mutualFriends: 3,
    isVerified: true
  },
  {
    id: 'search-5',
    name: 'James Wilson',
    username: 'jamesw',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Chicago, IL',
    mutualFriends: 1,
    isVerified: false
  }
];

// Simulate user search function
export const simulateUserSearch = (query: string, excludeIds: string[] = []): SearchableUser[] => {
  const searchTerm = query.toLowerCase().trim();
  
  if (searchTerm.length < 2) {
    return [];
  }
  
  return searchableUsers
    .filter(user => !excludeIds.includes(user.id))
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm) ||
      (user.location && user.location.toLowerCase().includes(searchTerm))
    )
    .slice(0, 10); // Limit results
};

// Simulate sending friend request
export const simulateSendFriendRequest = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate random success/failure for demo purposes
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    return { success: true };
  } else {
    return { 
      success: false, 
      message: 'Failed to send friend request. Please try again.' 
    };
  }
};

// Get search suggestions based on input
export const getSearchSuggestions = (query: string): string[] => {
  const searchTerm = query.toLowerCase().trim();
  
  if (searchTerm.length === 0) {
    return [];
  }
  
  const suggestions = new Set<string>();
  
  // Add name suggestions
  searchableUsers.forEach(user => {
    if (user.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(user.name);
    }
    if (user.username.toLowerCase().includes(searchTerm)) {
      suggestions.add(user.username);
    }
    if (user.location && user.location.toLowerCase().includes(searchTerm)) {
      suggestions.add(user.location);
    }
  });
  
  // Convert to array and limit results
  return Array.from(suggestions).slice(0, 5);
};