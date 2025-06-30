import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Friend } from '../types';

interface FriendState {
	friends: Friend[];
	isLoading: boolean;
	error: string | null;
}

interface FriendActions {
	setFriends: (friends: Friend[]) => void;
	addFriend: (friend: Friend) => void;
	removeFriend: (friendId: string) => void;
	updateFriendStatus: (friendId: string, isOnline: boolean) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearError: () => void;
}

type FriendStore = FriendState & FriendActions;

const initialState: FriendState = {
	friends: [],
	isLoading: false,
	error: null,
};

export const useFriendStore = create<FriendStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				setFriends: (friends) => set({ friends }),

				addFriend: (friend) =>
					set((state) => ({
						friends: [...state.friends, friend],
					})),

				removeFriend: (friendId) =>
					set((state) => ({
						friends: state.friends.filter((friend) => friend.id !== friendId),
					})),

				updateFriendStatus: (friendId, isOnline) =>
					set((state) => ({
						friends: state.friends.map((friend) =>
							friend.id === friendId ? { ...friend, isOnline } : friend
						),
					})),

				setLoading: (loading) => set({ isLoading: loading }),

				setError: (error) => set({ error }),

				clearError: () => set({ error: null }),
			}),
			{
				name: 'friend-store',
				partialize: (state) => ({
					friends: state.friends,
				}),
			}
		),
		{ name: 'friend-store' }
	)
);

// Selectors
export const useFriends = () => useFriendStore((state) => state.friends);

export const useFriendActions = () =>
	useFriendStore((state) => ({
		setFriends: state.setFriends,
		addFriend: state.addFriend,
		removeFriend: state.removeFriend,
		updateFriendStatus: state.updateFriendStatus,
		setLoading: state.setLoading,
		setError: state.setError,
		clearError: state.clearError,
	}));

export const useFriendsLoading = () =>
	useFriendStore((state) => state.isLoading);

export const useFriendsError = () => useFriendStore((state) => state.error);

// Computed selectors
export const useOnlineFriends = () =>
	useFriendStore((state) => state.friends.filter((friend) => friend.isOnline));

export const useFriendById = (friendId: string) =>
	useFriendStore((state) =>
		state.friends.find((friend) => friend.id === friendId)
	);

