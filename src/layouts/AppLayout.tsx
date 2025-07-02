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

				<footer className="fixed bottom-2 z-50 right-4 bg-yellow-500 dark:bg-purple-950 p-2 px-4 rounded-full">
					<h6>
						Built with{' '}
						<a href="bolt.new" target="_blank">
							Bolt.new
						</a>
					</h6>
				</footer>
			</div>

			<CreateTaskModal
				isOpen={isCreateTaskModalOpen}
				onClose={() => setCreateTaskModalOpen(false)}
			/>
		</>
	);
};

export default AppLayout;

