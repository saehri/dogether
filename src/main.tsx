import { SWRConfig } from 'swr';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from './contexts/ThemeContext.tsx';
import './index.css';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<SWRConfig
				value={{
					refreshInterval: 3000,
					fetcher: (resource, init) =>
						fetch(resource, init).then((res) => res.json()),
				}}
			>
				<App />
			</SWRConfig>
		</ThemeProvider>
	</StrictMode>
);

