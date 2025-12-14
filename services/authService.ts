
import { User, UserRole, UserStatus } from "../types";
import { MOCK_USER } from "../constants";

// --- Mock Auth Service (No Server) ---

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const signInWithGoogle = async (): Promise<User> => {
  await delay(800); // Fake loading
  return { ...MOCK_USER, name: "Google User", id: "google-uid-" + Date.now() };
};

export const registerWithEmail = async (email: string, pass: string, name: string): Promise<User> => {
  await delay(800);
  return {
    ...MOCK_USER,
    id: "email-uid-" + Date.now(),
    name: name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
  };
};

export const loginWithEmail = async (email: string, pass: string): Promise<User> => {
  await delay(800);
  // Return a mock user based on email
  return {
    ...MOCK_USER,
    id: "login-uid-" + Date.now(),
    name: email.split('@')[0],
  };
};

export const signOut = async () => {
  await delay(200);
  // Just resolve
};
