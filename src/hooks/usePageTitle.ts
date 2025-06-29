import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';

const pageTitles: Record<string, string> = {
	'/': `Feed - ${APP_NAME}`,
	'/goals': `My Goals - ${APP_NAME}`,
	'/friends': `Friends - ${APP_NAME}`,
	'/badges': `Badges - ${APP_NAME}`,
	'/profile': `Profile - ${APP_NAME}`,
	'/settings': `Settings - ${APP_NAME}`,
	'/login': `Sign In - ${APP_NAME}`,
	'/auth/register': `Create Account - ${APP_NAME}`,
};

export const usePageTitle = () => {
	const location = useLocation();

	useEffect(() => {
		const path = location.pathname;
		let title = pageTitles[path];

		if (!title) {
			if (path.startsWith('/profile/')) {
				title = `Friend Profile - ${APP_NAME}`;
			} else {
				title = `${APP_NAME} - Social Goals & Tasks`;
			}
		}

		document.title = title;
	}, [location.pathname]);
};

