import { User, Task, Friend, Badge } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  username: 'alexj',
  email: 'alex.johnson@example.com',
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
  },
  {
    id: '6',
    name: 'Fitness Fanatic',
    description: 'Complete 100 workout sessions',
    icon: '💪',
    color: 'from-red-500 to-orange-600'
  },
  {
    id: '7',
    name: 'Study Master',
    description: 'Complete 50 learning goals',
    icon: '📚',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: '8',
    name: 'Healthy Habits',
    description: 'Maintain healthy routines for 60 days',
    icon: '🥗',
    color: 'from-green-500 to-teal-600'
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

export const searchableUsers: SearchableUser[] = [
  {
    id: '5',
    name: 'John Smith',
    username: 'johnsmith',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 3,
    isOnline: true,
    bio: 'Fitness enthusiast and goal achiever. Love morning workouts and healthy living!',
    location: 'New York, NY',
    joinedDate: new Date('2024-01-15'),
    badges: [badges[0], badges[2], badges[5]]
  },
  {
    id: '6',
    name: 'Lisa Johnson',
    username: 'lisaj',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 1,
    isOnline: false,
    bio: 'Book lover and productivity enthusiast. Always reading something new!',
    location: 'San Francisco, CA',
    joinedDate: new Date('2024-02-20'),
    badges: [badges[1], badges[6]]
  },
  {
    id: '7',
    name: 'David Wilson',
    username: 'davidw',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 0,
    isOnline: true,
    bio: 'Marathon runner and health coach. Running towards better health every day!',
    location: 'Austin, TX',
    joinedDate: new Date('2024-03-10'),
    badges: [badges[0], badges[3], badges[5]]
  },
  {
    id: '8',
    name: 'Maria Garcia',
    username: 'mariag',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 2,
    isOnline: true,
    bio: 'Yoga instructor and mindfulness advocate. Finding peace through movement.',
    location: 'Los Angeles, CA',
    joinedDate: new Date('2024-01-05'),
    badges: [badges[0], badges[1], badges[4], badges[7]]
  },
  {
    id: '9',
    name: 'James Brown',
    username: 'jamesbrown',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 1,
    isOnline: false,
    bio: 'Software developer and tech enthusiast. Coding my way to better habits!',
    location: 'Seattle, WA',
    joinedDate: new Date('2024-02-14'),
    badges: [badges[2], badges[3], badges[6]]
  },
  {
    id: '10',
    name: 'Anna Taylor',
    username: 'annataylor',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 4,
    isOnline: true,
    bio: 'Artist and creative goal setter. Painting my dreams into reality!',
    location: 'Portland, OR',
    joinedDate: new Date('2023-12-20'),
    badges: [badges[1], badges[3], badges[4]]
  },
  {
    id: '11',
    name: 'Robert Lee',
    username: 'robertlee',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 0,
    isOnline: false,
    bio: 'Chef and culinary explorer. Cooking up healthy and delicious goals!',
    location: 'Chicago, IL',
    joinedDate: new Date('2024-03-25'),
    badges: [badges[0], badges[7]]
  },
  {
    id: '12',
    name: 'Sophie Martin',
    username: 'sophiem',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 2,
    isOnline: true,
    bio: 'Travel blogger and adventure seeker. Exploring the world one goal at a time!',
    location: 'Denver, CO',
    joinedDate: new Date('2024-01-30'),
    badges: [badges[2], badges[4]]
  },
  {
    id: '13',
    name: 'Kevin Zhang',
    username: 'kevinz',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 1,
    isOnline: true,
    bio: 'Data scientist and analytics expert. Analyzing my way to success!',
    location: 'Boston, MA',
    joinedDate: new Date('2024-02-08'),
    badges: [badges[1], badges[2], badges[6]]
  },
  {
    id: '14',
    name: 'Rachel Green',
    username: 'rachelg',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 3,
    isOnline: false,
    bio: 'Personal trainer and wellness coach. Helping others achieve their fitness goals!',
    location: 'Miami, FL',
    joinedDate: new Date('2024-01-12'),
    badges: [badges[0], badges[3], badges[4], badges[5]]
  },
  {
    id: '15',
    name: 'Tom Anderson',
    username: 'tomanderson',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 0,
    isOnline: true,
    bio: 'Musician and creative artist. Making music and achieving goals in harmony!',
    location: 'Nashville, TN',
    joinedDate: new Date('2024-03-05'),
    badges: [badges[1]]
  },
  {
    id: '16',
    name: 'Jessica Wang',
    username: 'jessicaw',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 2,
    isOnline: true,
    bio: 'Marketing professional and goal achiever. Strategizing success every day!',
    location: 'San Diego, CA',
    joinedDate: new Date('2024-02-18'),
    badges: [badges[2], badges[4]]
  },
  {
    id: '17',
    name: 'Michael Chen',
    username: 'michaelc',
    avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 1,
    isOnline: false,
    bio: 'Entrepreneur and startup founder. Building businesses and breaking barriers!',
    location: 'Silicon Valley, CA',
    joinedDate: new Date('2024-01-08'),
    badges: [badges[1], badges[2], badges[6]]
  },
  {
    id: '18',
    name: 'Amanda Foster',
    username: 'amandaf',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 2,
    isOnline: true,
    bio: 'Nutritionist and wellness expert. Nourishing bodies and minds for better health!',
    location: 'Phoenix, AZ',
    joinedDate: new Date('2024-02-25'),
    badges: [badges[0], badges[7]]
  },
  {
    id: '19',
    name: 'Daniel Kim',
    username: 'danielk',
    avatar: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 0,
    isOnline: true,
    bio: 'Photographer and visual storyteller. Capturing moments and chasing dreams!',
    location: 'Portland, ME',
    joinedDate: new Date('2024-03-15'),
    badges: [badges[3], badges[4]]
  },
  {
    id: '20',
    name: 'Olivia Thompson',
    username: 'oliviat',
    avatar: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    mutualFriends: 3,
    isOnline: false,
    bio: 'Teacher and lifelong learner. Educating minds and inspiring growth!',
    location: 'Minneapolis, MN',
    joinedDate: new Date('2024-01-22'),
    badges: [badges[1], badges[6], badges[7]]
  }
];

// Mock friend requests data
export interface FriendRequest {
  id: string;
  fromUser: SearchableUser;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  message?: string;
}

export const friendRequests: FriendRequest[] = [
  {
    id: 'req1',
    fromUser: searchableUsers[0], // John Smith
    toUserId: '1',
    status: 'pending',
    createdAt: new Date('2024-01-20'),
    message: 'Hey! I saw your fitness goals and would love to connect!'
  },
  {
    id: 'req2',
    fromUser: searchableUsers[3], // Maria Garcia
    toUserId: '1',
    status: 'pending',
    createdAt: new Date('2024-01-18'),
    message: 'Love your mindfulness approach to goal setting!'
  }
];

// Enhanced search function with better matching and ranking
export const simulateUserSearch = (query: string, excludeIds: string[] = []): SearchableUser[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery || normalizedQuery.length < 2) return [];
  
  const results = searchableUsers
    .filter(user => !excludeIds.includes(user.id))
    .map(user => {
      let score = 0;
      const searchFields = [
        { field: user.name.toLowerCase(), weight: 10 },
        { field: user.username.toLowerCase(), weight: 8 },
        { field: user.bio?.toLowerCase() || '', weight: 3 },
        { field: user.location?.toLowerCase() || '', weight: 2 }
      ];

      // Calculate relevance score
      searchFields.forEach(({ field, weight }) => {
        if (field.includes(normalizedQuery)) {
          // Exact match gets higher score
          if (field === normalizedQuery) {
            score += weight * 3;
          }
          // Starts with query gets medium score
          else if (field.startsWith(normalizedQuery)) {
            score += weight * 2;
          }
          // Contains query gets base score
          else {
            score += weight;
          }
        }
      });

      // Boost score for mutual friends and online status
      score += user.mutualFriends * 2;
      if (user.isOnline) score += 1;

      return { user, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      // Sort by score first, then by mutual friends, then by name
      if (a.score !== b.score) return b.score - a.score;
      if (a.user.mutualFriends !== b.user.mutualFriends) {
        return b.user.mutualFriends - a.user.mutualFriends;
      }
      return a.user.name.localeCompare(b.user.name);
    })
    .slice(0, 15) // Limit to 15 results
    .map(({ user }) => user);

  return results;
};

// Function to get mutual friends
export const getMutualFriends = (userId: string, currentUserFriends: string[]): string[] => {
  const user = searchableUsers.find(u => u.id === userId);
  if (!user) return [];
  
  // This would normally come from the backend
  // For now, we'll simulate it based on the mutualFriends count
  const allFriendIds = friends.map(f => f.id);
  return allFriendIds.slice(0, user.mutualFriends);
};

// Function to simulate sending friend request with more realistic behavior
export const simulateSendFriendRequest = (toUserId: string, message?: string): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate different scenarios
      const random = Math.random();
      
      if (random > 0.95) {
        // 5% chance of user not found
        resolve({ success: false, message: 'User not found' });
      } else if (random > 0.9) {
        // 5% chance of already sent request
        resolve({ success: false, message: 'Friend request already sent' });
      } else if (random > 0.85) {
        // 5% chance of network error
        resolve({ success: false, message: 'Network error. Please try again.' });
      } else {
        // 85% success rate
        resolve({ success: true, message: 'Friend request sent successfully!' });
      }
    }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
  });
};

// Function to get search suggestions
export const getSearchSuggestions = (query: string): string[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery || normalizedQuery.length < 1) return [];
  
  const suggestions = new Set<string>();
  
  searchableUsers.forEach(user => {
    // Add name suggestions
    if (user.name.toLowerCase().startsWith(normalizedQuery)) {
      suggestions.add(user.name);
    }
    
    // Add username suggestions
    if (user.username.toLowerCase().startsWith(normalizedQuery)) {
      suggestions.add(user.username);
    }
    
    // Add location suggestions
    if (user.location?.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(user.location);
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
};

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