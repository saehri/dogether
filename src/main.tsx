import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// import { ThemeProvider } from './contexts/ThemeContext.tsx';
import './index.css';
import { SWRConfig } from 'swr';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SWRConfig
			value={{
				refreshInterval: 3000,
				fetcher: (resource, init) =>
					fetch(resource, init).then((res) => res.json()),
			}}
		>
			{/* <ThemeProvider> */}
			<App />
			{/* </ThemeProvider> */}
		</SWRConfig>
	</StrictMode>
);

