import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Badge } from '../types';

interface BadgeState {
	badges: Badge[];
	isLoading: boolean;
	error: string | null;
}

interface BadgeActions {
	setBadges: (badges: Badge[]) => void;
	addBadge: (badge: Badge) => void;
	updateBadge: (badgeId: string, updates: Partial<Badge>) => void;
	deleteBadge: (badgeId: string) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearError: () => void;
}

type BadgeStore = BadgeState & BadgeActions;

const initialState: BadgeState = {
	badges: [],
	isLoading: false,
	error: null,
};

export const useBadgeStore = create<BadgeStore>()(
	devtools(
		persist(
			(set, _) => ({
				...initialState,

				setBadges: (badges) => set({ badges }),

				addBadge: (badge) =>
					set((state) => ({
						badges: [...state.badges, badge],
					})),

				updateBadge: (badgeId, updates) =>
					set((state) => ({
						badges: state.badges.map((badge) =>
							badge.id === badgeId ? { ...badge, ...updates } : badge
						),
					})),

				deleteBadge: (badgeId) =>
					set((state) => ({
						badges: state.badges.filter((badge) => badge.id !== badgeId),
					})),

				setLoading: (loading) => set({ isLoading: loading }),

				setError: (error) => set({ error }),

				clearError: () => set({ error: null }),
			}),
			{
				name: 'badge-store',
				partialize: (state) => ({
					badges: state.badges,
				}),
			}
		),
		{ name: 'badge-store' }
	)
);

// Selectors
export const useBadges = () => useBadgeStore((state) => state.badges);

export const useBadgeActions = () =>
	useBadgeStore((state) => ({
		setBadges: state.setBadges,
		addBadge: state.addBadge,
		updateBadge: state.updateBadge,
		deleteBadge: state.deleteBadge,
		setLoading: state.setLoading,
		setError: state.setError,
		clearError: state.clearError,
	}));

export const useBadgesLoading = () => useBadgeStore((state) => state.isLoading);

export const useBadgesError = () => useBadgeStore((state) => state.error);

// Computed selectors
export const useBadgeById = (badgeId: string) =>
	useBadgeStore((state) => state.badges.find((badge) => badge.id === badgeId));

