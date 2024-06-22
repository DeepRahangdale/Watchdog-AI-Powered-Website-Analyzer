// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Ensure you have your Firebase environment variables set up in your project's environment.
// You can do this using a library like 'dotenv' or through your deployment platform.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the authentication and Firestore services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper function to check if a user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser; // Returns true if a user is signed in, otherwise false
};
