import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './Header';
import Sidebar from './Sidebar';
import CreateTask from '../CreateTask/CreateTask';
import { useTaskStore } from '../../stores/taskStore';

const Layout: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
	const location = useLocation();

	const { addTask } = useTaskStore();

	const handleCreateTask = async (taskData: any) => {
		try {
			await addTask(taskData);
			setIsCreateTaskOpen(false);
		} catch (error) {
			console.error('Failed to create task:', error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
			{/* Header */}
			<Header
				onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
				onCreateTask={() => setIsCreateTaskOpen(true)}
			/>

			<div className="flex">
				{/* Sidebar - Always Fixed */}
				<Sidebar
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				/>

				{/* Main Content - Adjusted for fixed sidebar */}
				<main className="flex-1 lg:ml-64 p-6">
					<AnimatePresence mode="wait">
						<Outlet key={location.pathname} />
					</AnimatePresence>
				</main>
			</div>

			{/* Create Task Modal */}
			<AnimatePresence>
				{isCreateTaskOpen && (
					<CreateTask
						isOpen={isCreateTaskOpen}
						onClose={() => setIsCreateTaskOpen(false)}
						onCreateTask={handleCreateTask}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Layout;

