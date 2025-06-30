import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { removeAuthToken } from '../../services/api';

import {
	ChevronDown,
	ChevronUp,
	Trophy,
	Calendar,
	LogOut,
	User as UserIcon,
	Edit3,
	Save,
	X,
	Camera,
	Check,
	AlertCircle,
} from 'lucide-react';

import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '../../components/ui/dialog';
import { useAuthActions, useAuth } from '../../stores/authStore';
import { useBadgeStore } from '../../stores/badgeStore';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
	const [showAllBadges, setShowAllBadges] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	// Form states
	const [formData, setFormData] = useState({
		fullname: '',
		username: '',
		email: '',
		bio: '',
		date_of_birth: '',
	});

	const { user, isLoading, error } = useAuth();
	const { 
		logout, 
		setAuthenticated, 
		fetchProfile, 
		updateProfile, 
		uploadProfilePicture,
		clearError 
	} = useAuthActions();
	const { badges } = useBadgeStore();

	// Load user data into form when user changes
	useEffect(() => {
		if (user) {
			setFormData({
				fullname: user.name || '',
				username: user.username || '',
				email: user.email || '',
				bio: user.bio || '',
				date_of_birth: '', // Will need to be added to User type if available
			});
		}
	}, [user]);

	// Fetch profile on component mount
	useEffect(() => {
		if (!user) {
			fetchProfile();
		}
	}, [user, fetchProfile]);

	// Clear success message after 3 seconds
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => setSuccessMessage(null), 3000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	const visibleBadges = showAllBadges ? badges : badges.slice(0, 5);
	const shouldShowToggle = badges.length > 5;

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const handleSaveProfile = async () => {
		try {
			// Upload profile picture if selected
			if (selectedFile) {
				await uploadProfilePicture(selectedFile);
				setSelectedFile(null);
				setPreviewUrl(null);
			}

			// Update profile data
			const updates: any = {};
			if (formData.fullname !== user?.name) updates.fullname = formData.fullname;
			if (formData.username !== user?.username) updates.username = formData.username;
			if (formData.email !== user?.email) updates.email = formData.email;
			if (formData.bio !== user?.bio) updates.bio = formData.bio;
			if (formData.date_of_birth) updates.date_of_birth = formData.date_of_birth;

			if (Object.keys(updates).length > 0) {
				await updateProfile(updates);
			}

			setIsEditMode(false);
			setSuccessMessage('Profile updated successfully!');
		} catch (error) {
			console.error('Failed to save profile:', error);
		}
	};

	const handleCancelEdit = () => {
		// Reset form data to original user data
		if (user) {
			setFormData({
				fullname: user.name || '',
				username: user.username || '',
				email: user.email || '',
				bio: user.bio || '',
				date_of_birth: '',
			});
		}
		setSelectedFile(null);
		setPreviewUrl(null);
		setIsEditMode(false);
		clearError();
	};

	const handleLogout = () => {
		setIsLogoutModalOpen(false);
		logout();
		removeAuthToken();
		setAuthenticated(false);
	};

	if (isLoading && !user) {
		return (
			<div className="max-w-4xl mx-auto space-y-8">
				<div className="flex items-center justify-center py-16">
					<div className="flex items-center space-x-3">
						<div className="w-6 h-6 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
						<span className={cn('text-gray-600 dark:text-gray-300')}>
							Loading profile...
						</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Success Message */}
			{successMessage && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className={cn(
						"border rounded-lg p-4 flex items-center space-x-2",
						"bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30"
					)}
				>
					<Check className="w-5 h-5 text-green-600 dark:text-green-400" />
					<span className="text-green-800 dark:text-green-200">{successMessage}</span>
				</motion.div>
			)}

			{/* Error Message */}
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className={cn(
						"border rounded-lg p-4 flex items-center justify-between",
						"bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30"
					)}
				>
					<div className="flex items-center space-x-2">
						<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
						<span className="text-red-800 dark:text-red-200">{error}</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={clearError}
						className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
					>
						<X className="w-4 h-4" />
					</Button>
				</motion.div>
			)}

			{/* Profile Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center"
			>
				<div className="relative inline-block mb-6">
					<Avatar className="w-32 h-32 border-4 border-white shadow-xl">
						{previewUrl ? (
							<AvatarImage src={previewUrl} alt="Preview" />
						) : user?.avatar ? (
							<AvatarImage src={user.avatar} alt={user.name || 'User'} />
						) : null}
						<AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
							{user?.name ? (
								user.name.charAt(0)
							) : (
								<UserIcon className="w-16 h-16" />
							)}
						</AvatarFallback>
					</Avatar>
					
					{isEditMode && (
						<>
							<Label
								htmlFor="avatar-upload"
								className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg"
							>
								<Camera className="w-5 h-5 text-white" />
							</Label>
							<Input
								id="avatar-upload"
								type="file"
								accept="image/*"
								onChange={handleFileSelect}
								className="hidden"
							/>
						</>
					)}
					
					<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
				</div>

				{isEditMode ? (
					<div className="space-y-4 max-w-md mx-auto">
						<div>
							<Label htmlFor="fullname" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
								Full Name
							</Label>
							<Input
								id="fullname"
								value={formData.fullname}
								onChange={(e) => handleInputChange('fullname', e.target.value)}
								placeholder="Enter your full name"
								disabled={isLoading}
							/>
						</div>
						<div>
							<Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
								Username
							</Label>
							<Input
								id="username"
								value={formData.username}
								onChange={(e) => handleInputChange('username', e.target.value)}
								placeholder="Enter your username"
								disabled={isLoading}
							/>
						</div>
						<div>
							<Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => handleInputChange('email', e.target.value)}
								placeholder="Enter your email"
								disabled={isLoading}
							/>
						</div>
					</div>
				) : (
					<>
						<h1
							className={cn(
								'text-3xl font-bold mb-2',
								'text-gray-900 dark:text-gray-100'
							)}
						>
							{user?.name || 'Welcome to Dogether!'}
						</h1>
						<p className={cn('text-xl mb-4', 'text-gray-600 dark:text-gray-200')}>
							{user?.username
								? `@${user.username}`
								: 'Complete your profile to get started'}
						</p>
					</>
				)}

				{/* Action Buttons */}
				<div className="flex justify-center space-x-4 mb-6">
					{isEditMode ? (
						<>
							<Button
								variant="outline"
								onClick={handleCancelEdit}
								disabled={isLoading}
								className="flex items-center space-x-2"
							>
								<X className="w-4 h-4" />
								<span>Cancel</span>
							</Button>
							<Button
								variant="gradient"
								onClick={handleSaveProfile}
								disabled={isLoading}
								className="flex items-center space-x-2"
							>
								{isLoading ? (
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								) : (
									<Save className="w-4 h-4" />
								)}
								<span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
							</Button>
						</>
					) : (
						<>
							<Button
								variant="outline"
								onClick={() => setIsEditMode(true)}
								className="flex items-center space-x-2"
							>
								<Edit3 className="w-4 h-4" />
								<span>Edit Profile</span>
							</Button>
							<Button
								variant="outline"
								onClick={() => setIsLogoutModalOpen(true)}
								className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800/30 dark:hover:bg-red-900/20"
							>
								<LogOut className="w-4 h-4" />
								<span>Sign Out</span>
							</Button>
						</>
					)}
				</div>

				{/* Bio */}
				<Card className="max-w-2xl mx-auto">
					<CardContent className="p-6">
						<h2
							className={cn(
								'text-lg font-semibold mb-3',
								'text-gray-900 dark:text-gray-100'
							)}
						>
							About Me
						</h2>
						{isEditMode ? (
							<Textarea
								value={formData.bio}
								onChange={(e) => handleInputChange('bio', e.target.value)}
								placeholder="Tell us about yourself..."
								rows={4}
								disabled={isLoading}
							/>
						) : (
							<p
								className={cn(
									'leading-relaxed',
									'text-gray-700 dark:text-gray-200'
								)}
							>
								{user?.bio || 'No bio added yet. Click "Edit Profile" to add one!'}
							</p>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* Badges Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className="flex items-center justify-between mb-6">
					<h2
						className={cn(
							'text-2xl font-bold flex items-center space-x-2',
							'text-gray-900 dark:text-gray-100'
						)}
					>
						<Trophy className="w-7 h-7 text-yellow-500" />
						<span>My Badges</span>
					</h2>
					{badges.length > 0 && (
						<Badge variant="info" className="text-sm">
							{badges.length} earned
						</Badge>
					)}
				</div>

				{badges.length > 0 ? (
					<Card>
						<CardContent className="p-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
								{visibleBadges.map((badge, index) => (
									<motion.div
										key={badge.id}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: index * 0.1 }}
										className="text-center"
									>
										<div
											className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg`}
										>
											{badge.icon}
										</div>
										<h4
											className={cn(
												'font-semibold text-sm mb-1',
												'text-gray-900 dark:text-gray-100'
											)}
										>
											{badge.name}
										</h4>
										<p
											className={cn(
												'text-xs line-clamp-2',
												'text-gray-600 dark:text-gray-200'
											)}
										>
											{badge.description}
										</p>
									</motion.div>
								))}
							</div>

							{shouldShowToggle && (
								<div className="text-center mt-6">
									<Button
										variant="ghost"
										onClick={() => setShowAllBadges(!showAllBadges)}
										className="flex items-center space-x-2 mx-auto"
									>
										{showAllBadges ? (
											<>
												<ChevronUp className="w-4 h-4" />
												<span>Show Less</span>
											</>
										) : (
											<>
												<ChevronDown className="w-4 h-4" />
												<span>Show All ({badges.length - 5} more)</span>
											</>
										)}
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="p-12 text-center">
							<Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
							<h3
								className={cn(
									'text-xl font-semibold mb-2',
									'text-gray-600 dark:text-gray-200'
								)}
							>
								No badges yet
							</h3>
							<p className={cn('text-gray-500 dark:text-gray-300')}>
								Complete goals and tasks to earn your first badge!
							</p>
						</CardContent>
					</Card>
				)}
			</motion.div>

			{/* Recent Activity */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<h2
					className={cn(
						'text-2xl font-bold mb-6 flex items-center space-x-2',
						'text-gray-900 dark:text-gray-100'
					)}
				>
					<Calendar className="w-7 h-7 text-blue-500" />
					<span>Recent Activity</span>
				</h2>

				<Card>
					<CardContent className="p-12 text-center">
						<Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
						<h3
							className={cn(
								'text-xl font-semibold mb-2',
								'text-gray-600 dark:text-gray-200'
							)}
						>
							No recent activity
						</h3>
						<p className={cn('text-gray-500 dark:text-gray-300')}>
							Start creating and completing goals to see your activity here!
						</p>
					</CardContent>
				</Card>
			</motion.div>

			{/* Logout Confirmation Modal */}
			<Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center space-x-2">
							<LogOut className="w-5 h-5 text-red-500" />
							<span>Sign Out</span>
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to sign out? You'll need to log in again to
							access your account.
						</DialogDescription>
					</DialogHeader>

					<div className="flex space-x-3 mt-6">
						<Button
							variant="outline"
							className="flex-1"
							onClick={() => setIsLogoutModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							className="flex-1 flex items-center space-x-2"
							onClick={handleLogout}
						>
							<LogOut className="w-4 h-4" />
							<span>Sign Out</span>
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Profile;