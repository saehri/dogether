export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  badges: Badge[];
  bio: string;
  friends: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: Date;
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
  avatar: string;
  isOnline: boolean;
}

// Route types
export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  protected?: boolean;
  title?: string;
}