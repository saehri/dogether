import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function fetchWithToken(
	url: string,
	token: string,
	options: RequestInit = {}
) {
	const response = await fetch(url, {
		...options,
		headers: {
			...(options.headers || {}),
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Fetch error: ${response.status} ${response.statusText} - ${errorText}`
		);
	}

	return response.json();
}
