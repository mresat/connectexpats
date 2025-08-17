// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAk2q-cB4gAhVU1ySJssUb3csKATdqG2oA",
  authDomain: "connectexpats-dcfe3.firebaseapp.com",
  projectId: "connectexpats-dcfe3",
  storageBucket: "connectexpats-dcfe3.appspot.com",
  messagingSenderId: "838001266045",
  appId: "1:838001266045:web:21..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export required services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
