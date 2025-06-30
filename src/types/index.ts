export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  bio: string;
  badges: Badge[];
  friends: string[];
  createdAt: Date;
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    privacy: 'public' | 'private';
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: Date;
  criteria?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'goal';
  userId: string;
  completed: boolean;
  evidence?: Evidence;
  createdAt: Date;
  completedAt?: Date;
  goalDetails?: {
    targetCount: number;
    currentCount: number;
    frequency: 'daily' | 'weekly';
    duration: number; // in days
  };
}

export interface Evidence {
  id: string;
  imageUrl: string;
  caption?: string;
  uploadedAt: Date;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  mutualFriends?: number;
}

// Route types
export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  protected?: boolean;
  title?: string;
}

// API Response types
export interface ApiUser {
  id: number;
  username: string;
  fullname: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}