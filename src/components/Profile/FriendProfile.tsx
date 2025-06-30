import React from 'react';
// import { motion } from 'framer-motion';
// import {
// 	ArrowLeft,
// 	Trophy,
// 	Target,
// 	CheckCircle2,
// 	Calendar,
// 	Users,
// 	UserMinus,
// 	UserX,
// } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { friends, tasks, badges } from '@/data/mockData';
// import { cn } from '@/lib/utils';

interface FriendProfileProps {
	friendId: string;
	onBack: () => void;
}

const FriendProfile: React.FC<FriendProfileProps> = () => {
	// const friend = friends.find(f => f.id === friendId);

	return (
		<div>
			<h1>Hello from friend profile</h1>
		</div>
	);

	// if (!friend) {
	//   return (
	//     <div className="max-w-4xl mx-auto text-center py-16">
	//       <Card className="max-w-md mx-auto">
	//         <CardContent className="p-12 text-center">
	//           <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
	//             <UserX className="w-8 h-8 text-gray-400 dark:text-gray-500" />
	//           </div>
	//           <h2 className={cn(
	//             "text-xl font-bold mb-3",
	//             "text-gray-900 dark:text-gray-100"
	//           )}>
	//             Friend not found
	//           </h2>
	//           <p className={cn(
	//             "mb-6",
	//             "text-gray-600 dark:text-gray-300"
	//           )}>
	//             This friend may no longer be available or the profile doesn't exist.
	//           </p>
	//           <Button onClick={onBack} variant="gradient">
	//             Go Back
	//           </Button>
	//         </CardContent>
	//       </Card>
	//     </div>
	//   );
	// }

	// Mock data for friend (in a real app, this would come from API)
	// const friendTasks = tasks.filter(task => task.userId === friendId);
	// const completedTasks = friendTasks.filter(task => task.completed);
	// const goals = friendTasks.filter(task => task.type === 'goal');
	// const completedGoals = goals.filter(goal => goal.completed);

	// Mock badges for friend
	// const friendBadges = badges.slice(0, Math.min(3, badges.length)); // Show first 3 badges as earned

	// const stats = [
	//   {
	//     label: 'Tasks Completed',
	//     value: completedTasks.length,
	//     total: Math.max(friendTasks.length, 1),
	//     color: 'from-green-500 to-emerald-600',
	//     icon: CheckCircle2
	//   },
	//   {
	//     label: 'Goals Achieved',
	//     value: completedGoals.length,
	//     total: Math.max(goals.length, 1),
	//     color: 'from-blue-500 to-purple-600',
	//     icon: Target
	//   },
	//   {
	//     label: 'Badges Earned',
	//     value: friendBadges.length,
	//     total: Math.max(badges.length, 1),
	//     color: 'from-yellow-500 to-orange-600',
	//     icon: Trophy
	//   },
	//   {
	//     label: 'Friends',
	//     value: Math.floor(Math.random() * 20) + 10, // Random number for demo
	//     total: 50,
	//     color: 'from-purple-500 to-pink-600',
	//     icon: Users
	//   }
	// ];

	// const friendBio = friend.name
	//   ? `Hey there! I'm ${friend.name} and I love setting goals and achieving them. Always looking for motivation and new challenges. Let's support each other on our journey to success!`
	//   : "This user hasn't added a bio yet.";

	// const handleUnfriend = () => {
	//   // This would normally make an API call to unfriend the user
	//   console.log(`Unfriending ${friend.name}`);
	//   // You could show a confirmation dialog here
	// };

	// return (
	//   <div className="max-w-4xl mx-auto space-y-8">
	//     <motion.div
	//       initial={{ opacity: 0, x: -20 }}
	//       animate={{ opacity: 1, x: 0 }}
	//     >
	//       <Button
	//         variant="ghost"
	//         onClick={onBack}
	//         className={cn(
	//           "flex items-center space-x-2 mb-4",
	//           "text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
	//         )}
	//       >
	//         <ArrowLeft className="w-4 h-4" />
	//         <span>Back to Feed</span>
	//       </Button>
	//     </motion.div>

	//     <motion.div
	//       initial={{ opacity: 0, y: -20 }}
	//       animate={{ opacity: 1, y: 0 }}
	//       className="text-center"
	//     >
	//       <div className="relative inline-block mb-6">
	//         <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
	//           <AvatarImage src={friend.avatar} alt={friend.name} />
	//           <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
	//             {friend.name.charAt(0)}
	//           </AvatarFallback>
	//         </Avatar>
	//         {friend.isOnline && (
	//           <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
	//         )}
	//       </div>

	//       <h1 className={cn(
	//         "text-3xl font-bold mb-2",
	//         "text-gray-900 dark:text-gray-100"
	//       )}>
	//         {friend.name}
	//       </h1>
	//       <p className={cn(
	//         "text-xl mb-4",
	//         "text-gray-700 dark:text-gray-200"
	//       )}>
	//         @{friend.username}
	//       </p>

	//       <div className="flex justify-center space-x-4 mb-6">
	//         <Button
	//           variant="outline"
	//           className={cn(
	//             "flex items-center space-x-2",
	//             "text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300",
	//             "dark:text-red-400 dark:border-red-800/30 dark:hover:bg-red-900/20 dark:hover:border-red-700/50"
	//           )}
	//           onClick={handleUnfriend}
	//         >
	//           <UserMinus className="w-4 h-4" />
	//           <span>Unfriend</span>
	//         </Button>
	//         <Button variant="gradient">
	//           Message
	//         </Button>
	//       </div>

	//       <Card className="max-w-2xl mx-auto">
	//         <CardContent className="p-6">
	//           <h2 className={cn(
	//             "text-lg font-semibold mb-3",
	//             "text-gray-900 dark:text-gray-100"
	//           )}>
	//             About {friend.name}
	//           </h2>
	//           <p className={cn(
	//             "leading-relaxed",
	//             "text-gray-800 dark:text-gray-200"
	//           )}>
	//             {friendBio}
	//           </p>
	//         </CardContent>
	//       </Card>
	//     </motion.div>

	//     {(friendTasks.length > 0 || friendBadges.length > 0) && (
	//       <motion.div
	//         initial={{ opacity: 0, y: 20 }}
	//         animate={{ opacity: 1, y: 0 }}
	//         transition={{ delay: 0.1 }}
	//       >
	//         <h2 className={cn(
	//           "text-2xl font-bold mb-6 text-center",
	//           "text-gray-900 dark:text-gray-100"
	//         )}>
	//           {friend.name}'s Statistics
	//         </h2>
	//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
	//           {stats.map((stat, index) => {
	//             const percentage = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;
	//             const Icon = stat.icon;

	//             return (
	//               <motion.div
	//                 key={index}
	//                 initial={{ opacity: 0, x: -20 }}
	//                 animate={{ opacity: 1, x: 0 }}
	//                 transition={{ delay: index * 0.1 }}
	//               >
	//                 <Card className="overflow-hidden">
	//                   <CardContent className="p-6">
	//                     <div className="flex items-center justify-between mb-4">
	//                       <div className="flex items-center space-x-3">
	//                         <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
	//                           <Icon className="w-5 h-5 text-white" />
	//                         </div>
	//                         <div>
	//                           <h3 className={cn(
	//                             "font-semibold",
	//                             "text-gray-900 dark:text-gray-100"
	//                           )}>
	//                             {stat.label}
	//                           </h3>
	//                           <p className={cn(
	//                             "text-sm",
	//                             "text-gray-700 dark:text-gray-200"
	//                           )}>
	//                             {stat.value} of {stat.total}
	//                           </p>
	//                         </div>
	//                       </div>
	//                       <div className="text-right">
	//                         <div className={cn(
	//                           "text-2xl font-bold",
	//                           "text-gray-900 dark:text-gray-100"
	//                         )}>
	//                           {stat.value}
	//                         </div>
	//                         <div className={cn(
	//                           "text-sm",
	//                           "text-gray-600 dark:text-gray-300"
	//                         )}>
	//                           {Math.round(percentage)}%
	//                         </div>
	//                       </div>
	//                     </div>

	//                     <div className="relative">
	//                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
	//                         <motion.div
	//                           className={`h-3 bg-gradient-to-r ${stat.color} rounded-full`}
	//                           initial={{ width: 0 }}
	//                           animate={{ width: `${percentage}%` }}
	//                           transition={{ duration: 1, delay: index * 0.2 }}
	//                         />
	//                       </div>
	//                     </div>
	//                   </CardContent>
	//                 </Card>
	//               </motion.div>
	//             );
	//           })}
	//         </div>
	//       </motion.div>
	//     )}

	//     <motion.div
	//       initial={{ opacity: 0, y: 20 }}
	//       animate={{ opacity: 1, y: 0 }}
	//       transition={{ delay: 0.2 }}
	//     >
	//       <div className="flex items-center justify-between mb-6">
	//         <h2 className={cn(
	//           "text-2xl font-bold flex items-center space-x-2",
	//           "text-gray-900 dark:text-gray-100"
	//         )}>
	//           <Trophy className="w-7 h-7 text-yellow-500" />
	//           <span>{friend.name}'s Badges</span>
	//         </h2>
	//         {friendBadges.length > 0 && (
	//           <Badge variant="info" className="text-sm">
	//             {friendBadges.length} earned
	//           </Badge>
	//         )}
	//       </div>

	//       {friendBadges.length > 0 ? (
	//         <Card>
	//           <CardContent className="p-6">
	//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
	//               {friendBadges.map((badge, index) => (
	//                 <motion.div
	//                   key={badge.id}
	//                   initial={{ opacity: 0, scale: 0.8 }}
	//                   animate={{ opacity: 1, scale: 1 }}
	//                   transition={{ delay: index * 0.1 }}
	//                   className="text-center"
	//                 >
	//                   <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg`}>
	//                     {badge.icon}
	//                   </div>
	//                   <h4 className={cn(
	//                     "font-semibold text-sm mb-1",
	//                     "text-gray-900 dark:text-gray-100"
	//                   )}>
	//                     {badge.name}
	//                   </h4>
	//                   <p className={cn(
	//                     "text-xs line-clamp-2",
	//                     "text-gray-700 dark:text-gray-200"
	//                   )}>
	//                     {badge.description}
	//                   </p>
	//                 </motion.div>
	//               ))}
	//             </div>
	//           </CardContent>
	//         </Card>
	//       ) : (
	//         <Card>
	//           <CardContent className="p-12 text-center">
	//             <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
	//             <h3 className={cn(
	//               "text-xl font-semibold mb-2",
	//               "text-gray-700 dark:text-gray-200"
	//             )}>
	//               No badges yet
	//             </h3>
	//             <p className={cn(
	//               "text-gray-600 dark:text-gray-300"
	//             )}>
	//               {friend.name} hasn't earned any badges yet.
	//             </p>
	//           </CardContent>
	//         </Card>
	//       )}
	//     </motion.div>

	//     <motion.div
	//       initial={{ opacity: 0, y: 20 }}
	//       animate={{ opacity: 1, y: 0 }}
	//       transition={{ delay: 0.3 }}
	//     >
	//       <h2 className={cn(
	//         "text-2xl font-bold mb-6 flex items-center space-x-2",
	//         "text-gray-900 dark:text-gray-100"
	//       )}>
	//         <Calendar className="w-7 h-7 text-blue-500" />
	//         <span>Recent Activity</span>
	//       </h2>

	//       <Card>
	//         <CardContent className="p-6">
	//           {completedTasks.length > 0 ? (
	//             <div className="space-y-4">
	//               {completedTasks.slice(0, 3).map((task, index) => (
	//                 <div key={task.id} className={cn(
	//                   "flex items-center space-x-4 p-4 rounded-lg",
	//                   "bg-gray-50 dark:bg-gray-800/50"
	//                 )}>
	//                   <div className={`w-10 h-10 bg-gradient-to-br ${task.type === 'goal' ? 'from-blue-500 to-purple-600' : 'from-orange-500 to-red-500'} rounded-lg flex items-center justify-center`}>
	//                     {task.type === 'goal' ? (
	//                       <Target className="w-5 h-5 text-white" />
	//                     ) : (
	//                       <CheckCircle2 className="w-5 h-5 text-white" />
	//                     )}
	//                   </div>
	//                   <div className="flex-1">
	//                     <h4 className={cn(
	//                       "font-semibold",
	//                       "text-gray-900 dark:text-gray-100"
	//                     )}>
	//                       {task.title}
	//                     </h4>
	//                     <p className={cn(
	//                       "text-sm",
	//                       "text-gray-700 dark:text-gray-200"
	//                     )}>
	//                       Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ''}
	//                     </p>
	//                   </div>
	//                   <Badge variant="success">
	//                     <CheckCircle2 className="w-3 h-3 mr-1" />
	//                     Done
	//                   </Badge>
	//                 </div>
	//               ))}
	//             </div>
	//           ) : (
	//             <div className="text-center py-8">
	//               <CheckCircle2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
	//               <h3 className={cn(
	//                 "text-lg font-semibold mb-2",
	//                 "text-gray-600 dark:text-gray-200"
	//               )}>
	//                 No completed activities yet
	//               </h3>
	//               <p className={cn(
	//                 "text-gray-500 dark:text-gray-300"
	//               )}>
	//                 {friend.name} hasn't completed any activities yet.
	//               </p>
	//             </div>
	//           )}
	//         </CardContent>
	//       </Card>
	//     </motion.div>
	//   </div>
	// );
};

export default FriendProfile;

