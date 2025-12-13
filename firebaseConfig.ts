import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCuki8aRD0geznbOO8FBjwkGYLnqIdvyHg",
    authDomain: "chat-vega-b4e42.firebaseapp.com",
    projectId: "chat-vega-b4e42",
    storageBucket: "chat-vega-b4e42.firebasestorage.app",
    messagingSenderId: "975704162886",
    appId: "1:975704162886:web:678641ecb68c5b06474047"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();