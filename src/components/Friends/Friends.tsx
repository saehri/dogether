import React, { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';

import { getAuthToken } from '../../utils/api';
import { fetchWithToken } from '../../lib/utils';

import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { Search, UserCheck, UserPlus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

interface FriendsProps {
	onProfileClick?: (userId: string) => void;
}

const Friends: React.FC<FriendsProps> = () => {
	const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<SearchableUser[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [sendingRequestTo, setSendingRequestTo] = useState<string | null>(null);
	const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [requestStatus, setRequestStatus] = useState<{
		[key: string]: 'success' | 'error' | null;
	}>({});

	const authToken = getAuthToken();

	const { data, isLoading, error } = useSWR(
		authToken
			? ['https://dogether.etalasepro.com/api/friends', authToken]
			: null,
		([url, token]) => fetchWithToken(url, token)
	);

	const handleSearch = async (query?: string) => {
		//   const searchTerm = query || searchQuery;
		//   if (!searchTerm.trim() || searchTerm.trim().length < 2) {
		//     setSearchResults([]);
		//     return;
		//   }
		//   setIsSearching(true);
		//   setShowSuggestions(false);
		//   try {
		//     // Simulate API call delay
		//     await new Promise(resolve => setTimeout(resolve, 600));
		//     // Get excluded IDs (current user + existing friends)
		//     const excludeIds = [currentUser.id, ...currentUser.friends];
		//     // Use the enhanced search function
		//     const results = simulateUserSearch(searchTerm, excludeIds);
		//     setSearchResults(results);
		//   } catch (error) {
		//     console.error('Search error:', error);
		//     setSearchResults([]);
		//   } finally {
		//     setIsSearching(false);
		//   }
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
			setShowSuggestions(false);
		} else if (e.key === 'Escape') {
			setShowSuggestions(false);
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		setSearchQuery(suggestion);
		setShowSuggestions(false);
		handleSearch(suggestion);
	};

	const resetSearch = () => {
		setSearchQuery('');
		setSearchResults([]);
		setSearchSuggestions([]);
		setShowSuggestions(false);
		setRequestStatus({});
	};

	const handleInputFocus = () => {
		if (searchSuggestions.length > 0) {
			setShowSuggestions(true);
		}
	};

	const handleInputBlur = () => {
		// Delay hiding suggestions to allow clicking on them
		setTimeout(() => setShowSuggestions(false), 200);
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center"
			>
				<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
					Your Friends
				</h2>
				<p className={cn('text-gray-600 dark:text-gray-200')}>
					Connect and motivate each other
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="grid grid-cols-1 md:grid-cols-3 gap-4"
			>
				{/* {stats.map((stat, index) => {
	        const Icon = stat.icon;
	        return (
	          <Card key={index} className="overflow-hidden relative">
	            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`}></div>

	            <CardContent className="relative z-10 p-6 text-white text-center">
	              <Icon className="w-8 h-8 mx-auto mb-2" />
	              <h3 className="text-2xl font-bold">{stat.value}</h3>
	              <p className="text-white/90">{stat.title}</p>
	            </CardContent>
	          </Card>
	        );
	      })} */}
			</motion.div>

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

			{data?.friends.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="text-center py-16"
				>
					<Card className="max-w-md mx-auto">
						<CardContent className="p-12 text-center justify-center flex flex-col">
							<div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
								<UserCheck className="w-10 h-10 text-purple-600 dark:text-purple-400" />
							</div>

							<h3
								className={cn(
									'text-xl font-semibold mb-3',
									'text-gray-900 dark:text-gray-100'
								)}
							>
								No friends yet
							</h3>
							<p
								className={cn(
									'mb-6 leading-relaxed',
									'text-gray-600 dark:text-gray-300'
								)}
							>
								Start building your network! Add friends to share your goals,
								motivate each other, and celebrate achievements together.
							</p>
							<Button
								variant="gradient"
								className="flex items-center space-x-2"
								onClick={() => setIsAddFriendOpen(true)}
							>
								<UserPlus className="w-4 h-4" />
								<span>Find Friends</span>
							</Button>
						</CardContent>
					</Card>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
				>
					{data?.friends.map((friend, index) => (
						<motion.div
							key={friend.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<Card className="hover:shadow-md transition-all">
								<CardContent className="p-6 text-center">
									<div className="relative inline-block mb-4">
										<Avatar
											className={cn(
												'w-16 h-16 cursor-pointer hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-500 transition-all',
												'border-2 border-purple-200 dark:border-purple-700'
											)}
										>
											<AvatarImage src={friend.avatar} alt={friend.name} />
											<AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
												{friend.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										{friend.isOnline && (
											<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
										)}
									</div>

									<h3
										className={cn(
											'font-semibold mb-1 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors',
											'text-gray-900 dark:text-gray-100'
										)}
									>
										{friend.name}
									</h3>
									<p
										className={cn(
											'text-sm mb-4 cursor-pointer hover:text-purple-500 dark:hover:text-purple-400 transition-colors',
											'text-gray-600 dark:text-gray-200'
										)}
									>
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
			)}

			<Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
				<DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
					<DialogHeader className="flex-shrink-0">
						<DialogTitle className="flex items-center space-x-2">
							<UserPlus className="w-5 h-5 text-purple-600" />
							<span>Add New Friend</span>
						</DialogTitle>
					</DialogHeader>

					<div className="flex-1 space-y-6">
						<div className="space-y-4">
							<div className="relative">
								<div className="flex space-x-2">
									<div className="flex-1 relative">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />

										<Input
											placeholder="Search by name, username, or location..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											onKeyPress={handleKeyPress}
											onFocus={handleInputFocus}
											onBlur={handleInputBlur}
											className="pl-10"
										/>

										{/* Search Suggestions */}
										{showSuggestions && searchSuggestions.length > 0 && (
											<div
												className={cn(
													'absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto'
												)}
											>
												{searchSuggestions.map((suggestion, index) => (
													<button
														key={index}
														className={cn(
															'w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
															'text-gray-900 dark:text-gray-100'
														)}
														onClick={() => handleSuggestionClick(suggestion)}
													>
														{suggestion}
													</button>
												))}
											</div>
										)}
									</div>

									<Button
										onClick={() => handleSearch()}
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
										className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2"
									>
										<X className="w-3 h-3" />
										<span>Clear search</span>
									</Button>
								)}
							</div>
						</div>

						{isSearching && (
							<div className="flex items-center justify-center py-8">
								<div className="flex items-center space-x-3">
									<div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
									<span className={cn('text-gray-600 dark:text-gray-300')}>
										Searching for users...
									</span>
								</div>
							</div>
						)}

						{!isSearching &&
							searchQuery.trim().length >= 2 &&
							searchResults.length === 0 && (
								<div className="text-center py-8">
									<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
										<Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
									</div>
									<h3
										className={cn(
											'text-lg font-semibold mb-2',
											'text-gray-900 dark:text-gray-100'
										)}
									>
										No users found
									</h3>
									<p className={cn('text-gray-600 dark:text-gray-300')}>
										Try searching with a different name, username, or location
									</p>
								</div>
							)}

						{!searchQuery && searchResults.length === 0 && !isSearching && (
							<div className="text-center py-8">
								<div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
									<UserPlus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
								</div>
								<h3
									className={cn(
										'text-lg font-semibold mb-2',
										'text-gray-900 dark:text-gray-100'
									)}
								>
									Find new friends
								</h3>
								<p className={cn('text-gray-600 dark:text-gray-300')}>
									Search for people by their name, username, or location to send
									friend requests
								</p>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);

	// const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
	// const [searchQuery, setSearchQuery] = useState('');
	// const [searchResults, setSearchResults] = useState<SearchableUser[]>([]);
	// const [isSearching, setIsSearching] = useState(false);
	// const [sendingRequestTo, setSendingRequestTo] = useState<string | null>(null);
	// const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
	// const [showSuggestions, setShowSuggestions] = useState(false);
	// const [requestStatus, setRequestStatus] = useState<{ [key: string]: 'success' | 'error' | null }>({});

	// const stats = [
	//   {
	//     title: 'Total Friends',
	//     value: friends.length,
	//     icon: Users,
	//     gradient: 'from-purple-500 via-purple-600 to-blue-600'
	//   },
	//   {
	//     title: 'Online Now',
	//     value: friends.filter(f => f.isOnline).length,
	//     icon: () => (
	//       <div className="relative w-8 h-8 flex items-center justify-center">
	//         <div className="w-4 h-4 bg-white/90 rounded-full animate-pulse"></div>
	//         <div className="absolute inset-0 w-8 h-8 border-2 border-white/60 rounded-full"></div>
	//       </div>
	//     ),
	//     gradient: 'from-green-500 via-green-600 to-emerald-600'
	//   },
	//   {
	//     title: 'Active This Week',
	//     value: Math.floor(friends.length * 0.8),
	//     icon: Zap,
	//     gradient: 'from-blue-500 via-blue-600 to-cyan-600'
	//   }
	// ];

	// // Update search suggestions as user types
	// useEffect(() => {
	//   if (searchQuery.length > 0) {
	//     const suggestions = getSearchSuggestions(searchQuery);
	//     setSearchSuggestions(suggestions);
	//     setShowSuggestions(suggestions.length > 0);
	//   } else {
	//     setSearchSuggestions([]);
	//     setShowSuggestions(false);
	//   }
	// }, [searchQuery]);

	// // Auto-search when user stops typing
	// useEffect(() => {
	//   const timeoutId = setTimeout(() => {
	//     if (searchQuery.trim().length >= 2) {
	//       handleSearch();
	//     } else if (searchQuery.trim().length === 0) {
	//       setSearchResults([]);
	//     }
	//   }, 300);

	//   return () => clearTimeout(timeoutId);
	// }, [searchQuery]);

	// const handleSearch = async (query?: string) => {
	//   const searchTerm = query || searchQuery;
	//   if (!searchTerm.trim() || searchTerm.trim().length < 2) {
	//     setSearchResults([]);
	//     return;
	//   }

	//   setIsSearching(true);
	//   setShowSuggestions(false);

	//   try {
	//     // Simulate API call delay
	//     await new Promise(resolve => setTimeout(resolve, 600));

	//     // Get excluded IDs (current user + existing friends)
	//     const excludeIds = [currentUser.id, ...currentUser.friends];

	//     // Use the enhanced search function
	//     const results = simulateUserSearch(searchTerm, excludeIds);

	//     setSearchResults(results);
	//   } catch (error) {
	//     console.error('Search error:', error);
	//     setSearchResults([]);
	//   } finally {
	//     setIsSearching(false);
	//   }
	// };

	// const handleAddFriend = async (userId: string) => {
	//   setSendingRequestTo(userId);
	//   setRequestStatus(prev => ({ ...prev, [userId]: null }));

	//   try {
	//     const result = await simulateSendFriendRequest(userId);

	//     if (result.success) {
	//       // Remove from search results (simulate friend request sent)
	//       setSearchResults(prev => prev.filter(user => user.id !== userId));
	//       setRequestStatus(prev => ({ ...prev, [userId]: 'success' }));

	//       // Clear success status after 3 seconds
	//       setTimeout(() => {
	//         setRequestStatus(prev => ({ ...prev, [userId]: null }));
	//       }, 3000);
	//     } else {
	//       setRequestStatus(prev => ({ ...prev, [userId]: 'error' }));
	//       console.error('Failed to send friend request:', result.message);

	//       // Clear error status after 5 seconds
	//       setTimeout(() => {
	//         setRequestStatus(prev => ({ ...prev, [userId]: null }));
	//       }, 5000);
	//     }
	//   } catch (error) {
	//     setRequestStatus(prev => ({ ...prev, [userId]: 'error' }));
	//     console.error('Error sending friend request:', error);

	//     setTimeout(() => {
	//       setRequestStatus(prev => ({ ...prev, [userId]: null }));
	//     }, 5000);
	//   } finally {
	//     setSendingRequestTo(null);
	//   }
	// };

	// const handleKeyPress = (e: React.KeyboardEvent) => {
	//   if (e.key === 'Enter') {
	//     handleSearch();
	//     setShowSuggestions(false);
	//   } else if (e.key === 'Escape') {
	//     setShowSuggestions(false);
	//   }
	// };

	// const handleSuggestionClick = (suggestion: string) => {
	//   setSearchQuery(suggestion);
	//   setShowSuggestions(false);
	//   handleSearch(suggestion);
	// };

	// const resetSearch = () => {
	//   setSearchQuery('');
	//   setSearchResults([]);
	//   setSearchSuggestions([]);
	//   setShowSuggestions(false);
	//   setRequestStatus({});
	// };

	// const handleInputFocus = () => {
	//   if (searchSuggestions.length > 0) {
	//     setShowSuggestions(true);
	//   }
	// };

	// const handleInputBlur = () => {
	//   // Delay hiding suggestions to allow clicking on them
	//   setTimeout(() => setShowSuggestions(false), 200);
	// };

	// const handleFriendProfileClick = (friendId: string) => {
	//   if (onProfileClick) {
	//     onProfileClick(friendId);
	//   }
	// };

	// return (
	//   <div className="max-w-4xl mx-auto space-y-6">
	//     <motion.div
	//       initial={{ opacity: 0, y: -20 }}
	//       animate={{ opacity: 1, y: 0 }}
	//       className="text-center"
	//     >
	//       <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
	//         Your Friends
	//       </h2>
	//       <p className={cn(
	//         "text-gray-600 dark:text-gray-200"
	//       )}>
	//         Connect and motivate each other
	//       </p>
	//     </motion.div>

	//     <motion.div
	//       initial={{ opacity: 0, y: 20 }}
	//       animate={{ opacity: 1, y: 0 }}
	//       transition={{ delay: 0.1 }}
	//       className="grid grid-cols-1 md:grid-cols-3 gap-4"
	//     >
	//       {stats.map((stat, index) => {
	//         const Icon = stat.icon;
	//         return (
	//           <Card key={index} className="overflow-hidden relative">
	//             <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`}></div>

	//             <CardContent className="relative z-10 p-6 text-white text-center">
	//               <Icon className="w-8 h-8 mx-auto mb-2" />
	//               <h3 className="text-2xl font-bold">{stat.value}</h3>
	//               <p className="text-white/90">{stat.title}</p>
	//             </CardContent>
	//           </Card>
	//         );
	//       })}
	//     </motion.div>

	//     <motion.div
	//       initial={{ opacity: 0, y: 20 }}
	//       animate={{ opacity: 1, y: 0 }}
	//       transition={{ delay: 0.2 }}
	//       className="flex justify-center"
	//     >
	//       <Button
	//         variant="gradient"
	//         className="flex items-center space-x-2"
	//         onClick={() => setIsAddFriendOpen(true)}
	//       >
	//         <UserPlus className="w-4 h-4" />
	//         <span>Add New Friend</span>
	//       </Button>
	//     </motion.div>

	//     {friends.length === 0 ? (
	//       <motion.div
	//         initial={{ opacity: 0, y: 20 }}
	//         animate={{ opacity: 1, y: 0 }}
	//         transition={{ delay: 0.3 }}
	//         className="text-center py-16"
	//       >
	//         <Card className="max-w-md mx-auto">
	//           <CardContent className="p-12 text-center">
	//             <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
	//               <UserCheck className="w-10 h-10 text-purple-600 dark:text-purple-400" />
	//             </div>
	//             <h3 className={cn(
	//               "text-xl font-semibold mb-3",
	//               "text-gray-900 dark:text-gray-100"
	//             )}>
	//               No friends yet
	//             </h3>
	//             <p className={cn(
	//               "mb-6 leading-relaxed",
	//               "text-gray-600 dark:text-gray-300"
	//             )}>
	//               Start building your network! Add friends to share your goals, motivate each other, and celebrate achievements together.
	//             </p>
	//             <Button
	//               variant="gradient"
	//               className="flex items-center space-x-2"
	//               onClick={() => setIsAddFriendOpen(true)}
	//             >
	//               <UserPlus className="w-4 h-4" />
	//               <span>Find Friends</span>
	//             </Button>
	//           </CardContent>
	//         </Card>
	//       </motion.div>
	//     ) : (
	//       <motion.div
	//         initial={{ opacity: 0, y: 20 }}
	//         animate={{ opacity: 1, y: 0 }}
	//         transition={{ delay: 0.3 }}
	//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
	//       >
	//         {friends.map((friend, index) => (
	//           <motion.div
	//             key={friend.id}
	//             initial={{ opacity: 0, y: 20 }}
	//             animate={{ opacity: 1, y: 0 }}
	//             transition={{ delay: index * 0.1 }}
	//           >
	//             <Card className="hover:shadow-md transition-all">
	//               <CardContent className="p-6 text-center">
	//                 <div className="relative inline-block mb-4">
	//                   <Avatar
	//                     className={cn(
	//                       "w-16 h-16 cursor-pointer hover:ring-2 hover:ring-purple-300 dark:hover:ring-purple-500 transition-all",
	//                       "border-2 border-purple-200 dark:border-purple-700"
	//                     )}
	//                     onClick={() => handleFriendProfileClick(friend.id)}
	//                   >
	//                     <AvatarImage src={friend.avatar} alt={friend.name} />
	//                     <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
	//                       {friend.name.charAt(0)}
	//                     </AvatarFallback>
	//                   </Avatar>
	//                   {friend.isOnline && (
	//                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
	//                   )}
	//                 </div>

	//                 <h3
	//                   className={cn(
	//                     "font-semibold mb-1 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
	//                     "text-gray-900 dark:text-gray-100"
	//                   )}
	//                   onClick={() => handleFriendProfileClick(friend.id)}
	//                 >
	//                   {friend.name}
	//                 </h3>
	//                 <p
	//                   className={cn(
	//                     "text-sm mb-4 cursor-pointer hover:text-purple-500 dark:hover:text-purple-400 transition-colors",
	//                     "text-gray-600 dark:text-gray-200"
	//                   )}
	//                   onClick={() => handleFriendProfileClick(friend.id)}
	//                 >
	//                   @{friend.username}
	//                 </p>

	//                 <div className="flex justify-center">
	//                   <Button
	//                     variant="gradient"
	//                     size="sm"
	//                     className="w-full"
	//                     onClick={() => handleFriendProfileClick(friend.id)}
	//                   >
	//                     View Profile
	//                   </Button>
	//                 </div>
	//               </CardContent>
	//             </Card>
	//           </motion.div>
	//         ))}
	//       </motion.div>
	//     )}

	//     <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
	//       <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
	//         <DialogHeader className="flex-shrink-0">
	//           <DialogTitle className="flex items-center space-x-2">
	//             <UserPlus className="w-5 h-5 text-purple-600" />
	//             <span>Add New Friend</span>
	//           </DialogTitle>
	//         </DialogHeader>

	//         <div className="flex-1 overflow-y-auto space-y-6">
	//           <div className="space-y-4">
	//             <div className="relative">
	//               <div className="flex space-x-2">
	//                 <div className="flex-1 relative">
	//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
	//                   <Input
	//                     placeholder="Search by name, username, or location..."
	//                     value={searchQuery}
	//                     onChange={(e) => setSearchQuery(e.target.value)}
	//                     onKeyPress={handleKeyPress}
	//                     onFocus={handleInputFocus}
	//                     onBlur={handleInputBlur}
	//                     className="pl-10"
	//                   />

	//                   {/* Search Suggestions */}
	//                   {showSuggestions && searchSuggestions.length > 0 && (
	//                     <div className={cn(
	//                       "absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto"
	//                     )}>
	//                       {searchSuggestions.map((suggestion, index) => (
	//                         <button
	//                           key={index}
	//                           className={cn(
	//                             "w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
	//                             "text-gray-900 dark:text-gray-100"
	//                           )}
	//                           onClick={() => handleSuggestionClick(suggestion)}
	//                         >
	//                           {suggestion}
	//                         </button>
	//                       ))}
	//                     </div>
	//                   )}
	//                 </div>
	//                 <Button
	//                   onClick={() => handleSearch()}
	//                   disabled={!searchQuery.trim() || isSearching}
	//                   variant="gradient"
	//                   className="flex items-center space-x-2"
	//                 >
	//                   {isSearching ? (
	//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
	//                   ) : (
	//                     <Search className="w-4 h-4" />
	//                   )}
	//                   <span>Search</span>
	//                 </Button>
	//               </div>

	//               {/* Clear Search */}
	//               {(searchQuery || searchResults.length > 0) && (
	//                 <Button
	//                   variant="ghost"
	//                   size="sm"
	//                   onClick={resetSearch}
	//                   className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2"
	//                 >
	//                   <X className="w-3 h-3" />
	//                   <span>Clear search</span>
	//                 </Button>
	//               )}
	//             </div>
	//           </div>

	//           {isSearching && (
	//             <div className="flex items-center justify-center py-8">
	//               <div className="flex items-center space-x-3">
	//                 <div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
	//                 <span className={cn(
	//                   "text-gray-600 dark:text-gray-300"
	//                 )}>
	//                   Searching for users...
	//                 </span>
	//               </div>
	//             </div>
	//           )}

	//           {!isSearching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
	//             <div className="text-center py-8">
	//               <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
	//                 <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
	//               </div>
	//               <h3 className={cn(
	//                 "text-lg font-semibold mb-2",
	//                 "text-gray-900 dark:text-gray-100"
	//               )}>
	//                 No users found
	//               </h3>
	//               <p className={cn(
	//                 "text-gray-600 dark:text-gray-300"
	//               )}>
	//                 Try searching with a different name, username, or location
	//               </p>
	//             </div>
	//           )}

	//           {!searchQuery && searchResults.length === 0 && !isSearching && (
	//             <div className="text-center py-8">
	//               <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
	//                 <UserPlus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
	//               </div>
	//               <h3 className={cn(
	//                 "text-lg font-semibold mb-2",
	//                 "text-gray-900 dark:text-gray-100"
	//               )}>
	//                 Find new friends
	//               </h3>
	//               <p className={cn(
	//                 "text-gray-600 dark:text-gray-300"
	//               )}>
	//                 Search for people by their name, username, or location to send friend requests
	//               </p>
	//             </div>
	//           )}
	//         </div>
	//       </DialogContent>
	//     </Dialog>
	//   </div>
	// );
};

export default Friends;

