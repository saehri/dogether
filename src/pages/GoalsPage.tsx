import React from 'react';
import { motion } from 'framer-motion';

import Goals from '../components/Goals/Goals';

const GoalsPage: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.3 }}
		>
			<Goals />
		</motion.div>
	);
};

export default GoalsPage;
