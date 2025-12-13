import { auth, googleProvider, db } from "../firebaseConfig";
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  User as FirebaseUser 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User, UserRole, UserStatus } from "../types";

// --- Helper: Get or Create User in Firestore ---
const getOrCreateUserInFirestore = async (firebaseUser: FirebaseUser, additionalData: Partial<User> = {}): Promise<User> => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  } else {
    // Create new user
    const newUser: User = {
      id: firebaseUser.uid,
      name: additionalData.name || firebaseUser.displayName || "User",
      avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
      role: UserRole.AUDIENCE,
      level: 1,
      isMuted: true,
      status: UserStatus.ACTIVE,
      totalSpent: 0,
      walletBalance: 100, // Free 100 coins for new users
      countryCode: 'EG',
      friendsCount: 0,
      fansCount: 0,
      followingCount: 0,
      isVip: false,
      ...additionalData
    };
    
    await setDoc(userRef, newUser);
    return newUser;
  }
};

// --- Google Auth ---
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return await getOrCreateUserInFirestore(result.user);
  } catch (error: any) {
    console.error("Google Login Error:", error);
    if (error.code === 'auth/unauthorized-domain') {
      let currentDomain = window.location.hostname;
      if (!currentDomain) {
         currentDomain = window.location.host;
      }
      
      const msg = currentDomain 
        ? `Domain not authorized (${currentDomain}).\nGo to Firebase Console > Authentication > Settings > Authorized Domains and add '${currentDomain}'.`
        : `Domain not authorized.\nPlease add the domain currently shown in your browser address bar to Firebase Console > Authentication > Settings > Authorized Domains.`;

      throw new Error(msg);
    }
    throw error;
  }
};

// --- Email/Password Register ---
export const registerWithEmail = async (email: string, pass: string, name: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Update Firebase Profile
    await updateProfile(result.user, {
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.uid}`
    });

    return await getOrCreateUserInFirestore(result.user, { name });
  } catch (error: any) {
    console.error("Register Error:", error);
    let msg = error.message;
    if (error.code === 'auth/email-already-in-use') msg = 'Email is already in use.';
    if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
    throw new Error(msg);
  }
};

// --- Email/Password Login ---
export const loginWithEmail = async (email: string, pass: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return await getOrCreateUserInFirestore(result.user);
  } catch (error: any) {
    console.error("Login Error:", error);
    let msg = "Invalid email or password.";
    if (error.code === 'auth/user-not-found') msg = 'User not found.';
    if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
    if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';
    throw new Error(msg);
  }
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};