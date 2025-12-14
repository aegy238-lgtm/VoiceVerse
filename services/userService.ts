
import { User } from "../types";
import { MOCK_USER, MOCK_ALL_USERS } from "../constants";

// --- Mock User Service (No Server) ---

// Simulating a database in memory for the session
let localUser: User = { ...MOCK_USER };

export const initializeUserInDB = async (userId: string): Promise<User> => {
  return localUser;
};

export const subscribeToUser = (userId: string, callback: (data: any) => void) => {
  // Call immediately with current local data
  callback(localUser);
  
  // Return dummy unsubscribe
  return () => {};
};

export const subscribeToLeaderboard = (callback: (users: User[]) => void) => {
  // Return the mock list from constants
  callback(MOCK_ALL_USERS);
  return () => {};
};

export const updateUserProfileDB = async (userId: string, name: string, avatar: string) => {
  localUser = { ...localUser, name, avatar };
  // In a real mock, we might want to trigger the listener, 
  // but for simplicity we rely on local state updates in UI or refreshes
};

export const addCoinsDB = async (userId: string, amount: number) => {
  const current = localUser.walletBalance || 0;
  localUser = { ...localUser, walletBalance: current + amount };
};

export const deductCoinsDB = async (userId: string, amount: number) => {
  const current = localUser.walletBalance || 0;
  if (current >= amount) {
    localUser = { 
        ...localUser, 
        walletBalance: current - amount,
        totalSpent: (localUser.totalSpent || 0) + amount 
    };
  }
};
