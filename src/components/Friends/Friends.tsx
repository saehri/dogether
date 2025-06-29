import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Zap, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { friends } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Friends: React.FC = () => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search results - in a real app, this would come from your API
  const mockSearchResults = [
    {
      id: '5',
      name: 'John Smith',
      username: 'johnsmith',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualFriends: 3
    },
    {
      id: '6',
      name: 'Lisa Johnson',
      username: 'lisaj',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualFriends: 1
    },
    {
      id: '7',
      name: 'David Wilson',
      username: 'davidw',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mutualFriends: 0
    }
  ];

  const stats = [
    {
      title: 'Total Friends',
      value: friends.length,
      icon: Users,
      gradient: 'from-purple-500 via-purple-600 to-blue-600'
    },
    {
      title: 'Online Now',
      value: friends.filter(f => f.isOnline).length,
      icon: () => (
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="w-4 h-4 bg-white/90 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-white/60 rounded-full"></div>
        </div>
      ),
      gradient: 'from-green-500 via-green-600 to-emerald-600'
    },
    {
      title: 'Active This Week',
      value: Math.floor(friends.length * 0.8),
      icon: Zap,
      gradient: 'from-blue-500 via-blue-600 to-cyan-600'
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter mock results based on search query
    const filteredResults = mockSearchResults.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filteredResults);
    setIsSearching(false);
  };

  const handleAddFriend = (userId: string) => {
    // In a real app, this would make an API call to send a friend request
    console.log('Adding friend:', userId);
    
    // Remove from search results (simulate friend request sent)
    setSearchResults(prev => prev.filter(user => user.id !== userId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Your Friends
        </h2>
        <p className={cn(
          "text-gray-600 dark:text-gray-200"
        )}>
          Connect and motivate each other
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden relative">
              {/* Gradient Background with Full Coverage */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`}></div>
              
              {/* Content Layer */}
              <CardContent className="relative z-10 p-6 text-white text-center">
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-white/90">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Add Friend Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <Button 
          variant="gradient" 
          className="flex items-center space-x-2"
          onClick={() => setIsAddFriendOpen(true)}
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Friend</span>
        </Button>
      </motion.div>

      {/* Friends List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {friend.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <h3 className={cn(
                  "font-semibold mb-1",
                  "text-gray-900 dark:text-gray-100"
                )}>
                  {friend.name}
                </h3>
                <p className={cn(
                  "text-sm mb-4",
                  "text-gray-600 dark:text-gray-200"
                )}>
                  @{friend.username}
                </p>
                
                <div className="flex justify-center">
                  <Button variant="gradient" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Friend Dialog */}
      <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-purple-600" />
              <span>Add New Friend</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Search Input */}
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search by name or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  variant="gradient"
                  className="flex items-center space-x-2"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Search</span>
                </Button>
              </div>

              {/* Clear Search */}
              {(searchQuery || searchResults.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSearch}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                  <span>Clear search</span>
                </Button>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className={cn(
                  "text-sm font-medium",
                  "text-gray-700 dark:text-gray-200"
                )}>
                  Search Results ({searchResults.length})
                </h3>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                        "bg-gray-50 border-gray-200 hover:bg-gray-100",
                        "dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                      )}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-sm">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-medium truncate",
                          "text-gray-900 dark:text-gray-100"
                        )}>
                          {user.name}
                        </h4>
                        <p className={cn(
                          "text-sm truncate",
                          "text-gray-600 dark:text-gray-300"
                        )}>
                          @{user.username}
                        </p>
                        {user.mutualFriends > 0 && (
                          <p className={cn(
                            "text-xs",
                            "text-purple-600 dark:text-purple-400"
                          )}>
                            {user.mutualFriends} mutual friend{user.mutualFriends !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleAddFriend(user.id)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20"
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className={cn(
                  "text-lg font-semibold mb-2",
                  "text-gray-900 dark:text-gray-100"
                )}>
                  No users found
                </h3>
                <p className={cn(
                  "text-gray-600 dark:text-gray-300"
                )}>
                  Try searching with a different name or username
                </p>
              </div>
            )}

            {/* Search Prompt */}
            {!searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className={cn(
                  "text-lg font-semibold mb-2",
                  "text-gray-900 dark:text-gray-100"
                )}>
                  Find new friends
                </h3>
                <p className={cn(
                  "text-gray-600 dark:text-gray-300"
                )}>
                  Search for people by their name or username to send friend requests
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Friends;