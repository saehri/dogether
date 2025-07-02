import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Menu } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from '../../components/ui/avatar';
import { useAuth } from '../../stores/authStore';
import { APP_NAME, ROUTES } from '../../utils/constants';

interface HeaderProps {
	onMenuToggle: () => void;
	onCreateTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onCreateTask }) => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleProfileClick = () => {
		navigate(ROUTES.PROFILE);
	};

	return (
		<motion.header
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Left side */}
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={onMenuToggle}
							className="lg:hidden"
						>
							<Menu className="w-5 h-5" />
						</Button>

						<Link
							to={ROUTES.HOME}
							className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
						>
							<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">D</span>
							</div>
							<h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
								{APP_NAME}
							</h1>
						</Link>
					</div>

					{/* Right side */}
					<div className="flex items-center space-x-3">
						<Button
							variant="gradient"
							onClick={onCreateTask}
							className="flex items-center space-x-2"
							data-create-task
						>
							<Plus className="w-4 h-4" />
							<span className="hidden sm:inline">Create</span>
						</Button>

						<Avatar
							className="w-8 h-8 border-2 border-purple-200 dark:border-purple-700 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
							onClick={handleProfileClick}
						>
							<AvatarImage src={user?.profile_picture} alt={user?.name || 'User'} />
							<AvatarFallback>
								{user?.name ? user.name.charAt(0) : 'U'}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</div>
		</motion.header>
	);
};

export default Header;