import { create } from 'zustand';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface UserState {
  users: User[];
  activeUsers: User[];
  addUser: (user: User) => void;
  updateUserLocation: (userId: string, latitude: number, longitude: number) => void;
  updateUserRating: (userId: string, rating: number) => void;
  addActiveUser: (user: User) => void;
  removeActiveUser: (userId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: mockUsers,
  activeUsers: [],
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
      activeUsers: [...state.activeUsers, user],
    })),
  updateUserLocation: (userId, latitude, longitude) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, location: { latitude, longitude } } : user
      ),
      activeUsers: state.activeUsers.map((user) =>
        user.id === userId ? { ...user, location: { latitude, longitude } } : user
      ),
    })),
  updateUserRating: (userId, rating) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? {
              ...user,
              rating: user.rating ? (user.rating + rating) / 2 : rating,
            }
          : user
      ),
      activeUsers: state.activeUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              rating: user.rating ? (user.rating + rating) / 2 : rating,
            }
          : user
      ),
    })),
  addActiveUser: (user) =>
    set((state) => ({
      activeUsers: [...state.activeUsers, user],
    })),
  removeActiveUser: (userId) =>
    set((state) => ({
      activeUsers: state.activeUsers.filter((user) => user.id !== userId),
    })),
}));