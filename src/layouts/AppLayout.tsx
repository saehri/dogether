import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useUI, useUIActions } from '../stores/uiStore';

import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import CreateTaskModal from '../components/CreateTask/CreateTaskModal';

const AppLayout = () => {
	const { isSidebarOpen, isCreateTaskModalOpen } = useUI();
	const { toggleSidebar, setSidebarOpen, setCreateTaskModalOpen } =
		useUIActions();

	return (
		<>
			<Header
				onMenuToggle={toggleSidebar}
				onCreateTask={() => setCreateTaskModalOpen(true)}
			/>

			<div className="flex">
				<Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

				<main className="flex-1 lg:ml-64 p-6">
					<AnimatePresence mode="wait">
						<Outlet />
					</AnimatePresence>
				</main>
			</div>

			<CreateTaskModal
				isOpen={isCreateTaskModalOpen}
				onClose={() => setCreateTaskModalOpen(false)}
			/>
		</>
	);
};

export default AppLayout;

// import React from 'react';
// import { AnimatePresence } from 'framer-motion';
// import { Outlet, useLocation } from 'react-router-dom';

// import { usePageTitle } from '@/hooks/usePageTitle';
// import { useUI, useUIActions } from '@/stores/uiStore';

// import Header from '@/components/Layout/Header';
// import Sidebar from '@/components/Layout/Sidebar';
// import CreateTaskModal from '@/components/CreateTask/CreateTaskModal';

// const AppLayout: React.FC = () => {
// 	const location = useLocation();
// 	const { isSidebarOpen, isCreateTaskModalOpen } = useUI();
// 	const { toggleSidebar, setSidebarOpen, setCreateTaskModalOpen } =
// 		useUIActions();

// 	usePageTitle();

// 	return (
// 		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
// 			{/* Header */}
// 			<Header
// 				onMenuToggle={toggleSidebar}
// 				onCreateTask={() => setCreateTaskModalOpen(true)}
// 			/>

// 			<div className="flex">
// 				{/* Sidebar */}
// 				<Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

// 				{/* Main Content */}
// 				<main className="flex-1 lg:ml-64 p-6">
// 					<AnimatePresence mode="wait">
// 						<Outlet key={location.pathname} />
// 					</AnimatePresence>
// 				</main>
// 			</div>

// 			{/* Create Task Modal */}
// 			<CreateTaskModal
// 				isOpen={isCreateTaskModalOpen}
// 				onClose={() => setCreateTaskModalOpen(false)}
// 			/>
// 		</div>
// 	);
// };

// export default AppLayout;

