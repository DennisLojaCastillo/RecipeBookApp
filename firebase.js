// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOQYmOBQDfd4EHRGFUzO27GvJeruibaRE",
  authDomain: "recipebook-6fbab.firebaseapp.com",
  projectId: "recipebook-6fbab",
  storageBucket: "recipebook-6fbab.firebasestorage.app",
  messagingSenderId: "652087964851",
  appId: "1:652087964851:web:44b961137731e6cf932cc6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
