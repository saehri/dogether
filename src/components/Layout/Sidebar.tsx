import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Target, Users, Trophy, Settings, User, X } from 'lucide-react';

import { cn } from '../../lib/utils';

import { APP_NAME, ROUTES } from '../../utils/constants';

import { Button } from '../../components/ui/button';

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
	const location = useLocation();

	const menuItems = [
		{ id: 'feed', label: 'Feed', icon: Home, path: ROUTES.FEED },
		{ id: 'goals', label: 'My Goals', icon: Target, path: ROUTES.GOALS },
		{ id: 'friends', label: 'Friends', icon: Users, path: ROUTES.FRIENDS },
		{ id: 'badges', label: 'Badges', icon: Trophy, path: ROUTES.BADGES },
		{ id: 'profile', label: 'Profile', icon: User, path: ROUTES.PROFILE },
		{
			id: 'settings',
			label: 'Settings',
			icon: Settings,
			path: ROUTES.SETTINGS,
		},
	];

	const HEADER_HEIGHT = 64;

	const isActiveRoute = (path: string) => {
		if (path === ROUTES.FEED) {
			return location.pathname === ROUTES.HOME || location.pathname === ROUTES.FEED;
		}
		return location.pathname.startsWith(path);
	};

	return (
		<>
			{/* Mobile Overlay */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
						onClick={onClose}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<motion.aside
				initial={{ x: -300 }}
				animate={{
					x: isOpen || window.innerWidth >= 1024 ? 0 : -300,
				}}
				transition={{ type: 'spring', damping: 25, stiffness: 200 }}
				className="fixed left-0 z-50 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col lg:translate-x-0"
				style={{
					top: `${HEADER_HEIGHT}px`,
					height: `calc(100vh - ${HEADER_HEIGHT}px)`,
				}}
			>
				{/* Mobile Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 lg:hidden">
					<Link to={ROUTES.HOME} className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">D</span>
						</div>
						<h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
							{APP_NAME}
						</h1>
					</Link>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="w-5 h-5" />
					</Button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
					{menuItems.map((item) => {
						const Icon = item.icon;
						const isActive = isActiveRoute(item.path);

						return (
							<Button
								key={item.id}
								variant={isActive ? 'default' : 'ghost'}
								className={cn(
									'w-full justify-start space-x-3 h-12',
									isActive &&
										'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
								)}
								asChild
							>
								<Link
									to={item.path}
									onClick={() => {
										if (window.innerWidth < 1024) {
											onClose();
										}
									}}
								>
									<Icon className="w-5 h-5" />
									<span className="font-medium">{item.label}</span>
								</Link>
							</Button>
						);
					})}
				</nav>

				{/* User Info */}
				<div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
					<div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-3">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-800 dark:text-gray-200">
								Keep it up!
							</p>
							<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
								Start creating goals to track progress
							</p>
						</div>
					</div>
				</div>
			</motion.aside>
		</>
	);
};

export default Sidebar;