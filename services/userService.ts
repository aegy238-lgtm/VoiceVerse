import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, onSnapshot, increment } from "firebase/firestore";
import { User, UserRole, UserStatus } from "../types";
import { MOCK_USER } from "../constants";

const COLLECTION_NAME = "users";

// Initialize a user in Firestore if they don't exist
export const initializeUserInDB = async (userId: string): Promise<User> => {
  const userRef = doc(db, COLLECTION_NAME, userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  } else {
    // Create new user based on MOCK_USER but with the specific ID
    const newUser: User = {
      ...MOCK_USER,
      id: userId,
      // Ensure numeric values are initialized
      totalSpent: 0,
      friendsCount: 0,
      fansCount: 0,
      followingCount: 0,
      countryCode: 'EG', // Default
    };
    
    // We add a separate field for 'walletBalance' in DB to manage coins easily, 
    // although in the UI we pass it separately sometimes.
    await setDoc(userRef, {
        ...newUser,
        walletBalance: 2500 // Starting balance
    });
    
    return newUser;
  }
};

// Listen to user updates (Real-time wallet and profile changes)
export const subscribeToUser = (userId: string, callback: (data: any) => void) => {
    return onSnapshot(doc(db, COLLECTION_NAME, userId), (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        }
    });
};

// Update Profile Info
export const updateUserProfileDB = async (userId: string, name: string, avatar: string) => {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, {
        name,
        avatar
    });
};

// Add Coins (Recharge)
export const addCoinsDB = async (userId: string, amount: number) => {
    const userRef = doc(db, COLLECTION_NAME, userId);
    await updateDoc(userRef, {
        walletBalance: increment(amount)
    });
};

// Deduct Coins (Purchase/Gift)
export const deductCoinsDB = async (userId: string, amount: number) => {
    const userRef = doc(db, COLLECTION_NAME, userId);
    // In a real app, you'd use a transaction to ensure balance >= amount
    await updateDoc(userRef, {
        walletBalance: increment(-amount),
        totalSpent: increment(amount) // Increase wealth level progress
    });
};
