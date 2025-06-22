// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0-yOmKcRc8GYnWbV6nSnYsQUUFvt7Zjc",
  authDomain: "tastify-557b3.firebaseapp.com",
  projectId: "tastify-557b3",
  storageBucket: "tastify-557b3.firebasestorage.app",
  messagingSenderId: "186831640038",
  appId: "1:186831640038:web:85ac4e4ca72f1a85fc3227",
  measurementId: "G-ZV2G03YJ5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;
