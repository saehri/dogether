import { User, Task, Friend, Badge } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  username: 'alexj',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  badges: [
    {
      id: '1',
      name: 'Early Bird',
      description: 'Complete 5 morning tasks',
      icon: '🌅',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: '2',
      name: 'Goal Crusher',
      description: 'Complete 10 goals',
      icon: '🎯',
      color: 'from-purple-500 to-pink-500'
    }
  ],
  friends: ['2', '3', '4']
};

export const badges: Badge[] = [
  {
    id: '1',
    name: 'Early Bird',
    description: 'Complete 5 morning tasks',
    icon: '🌅',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: '2',
    name: 'Goal Crusher',
    description: 'Complete 10 goals',
    icon: '🎯',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '3',
    name: 'Consistency King',
    description: 'Complete a 30-day goal',
    icon: '👑',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: '4',
    name: 'Photo Master',
    description: 'Upload 50 evidence photos',
    icon: '📸',
    color: 'from-green-400 to-blue-500'
  },
  {
    id: '5',
    name: 'Social Butterfly',
    description: 'Add 20 friends',
    icon: '🦋',
    color: 'from-pink-400 to-purple-500'
  }
];

export const friends: Friend[] = [
  {
    id: '2',
    name: 'Sarah Chen',
    username: 'sarahc',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    username: 'mikerod',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false
  },
  {
    id: '4',
    name: 'Emma Wilson',
    username: 'emmaw',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true
  }
];

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Morning Workout',
    description: 'Complete a 30-minute morning workout routine',
    type: 'goal',
    userId: '1',
    completed: false,
    createdAt: new Date('2024-01-15'),
    goalDetails: {
      targetCount: 21,
      currentCount: 5,
      frequency: 'daily',
      duration: 21
    }
  },
  {
    id: '2',
    title: 'Read "Atomic Habits"',
    description: 'Finish reading the complete book',
    type: 'task',
    userId: '1',
    completed: true,
    evidence: {
      id: '1',
      imageUrl: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      caption: 'Finished the last chapter!',
      uploadedAt: new Date('2024-01-14')
    },
    createdAt: new Date('2024-01-01'),
    completedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Drink 8 glasses of water daily',
    description: 'Stay hydrated throughout the day',
    type: 'goal',
    userId: '2',
    completed: false,
    createdAt: new Date('2024-01-10'),
    goalDetails: {
      targetCount: 14,
      currentCount: 3,
      frequency: 'daily',
      duration: 14
    }
  },
  {
    id: '4',
    title: 'Learn Spanish basics',
    description: 'Complete beginner Spanish course',
    type: 'task',
    userId: '3',
    completed: true,
    evidence: {
      id: '2',
      imageUrl: 'https://images.pexels.com/photos/159751/book-read-literature-pages-159751.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      caption: 'Certificate of completion!',
      uploadedAt: new Date('2024-01-13')
    },
    createdAt: new Date('2023-12-15'),
    completedAt: new Date('2024-01-13')
  }
];