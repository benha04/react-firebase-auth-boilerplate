// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAUfOl1MI4kRURaOwockBotaHfYgg7mayE",
  authDomain: "productivity-870a6.firebaseapp.com",
  projectId: "productivity-870a6",
  storageBucket: "productivity-870a6.appspot.com",
  messagingSenderId: "1082026072652",
  appId: "1:1082026072652:web:5ce10797e21c215d2832e9",
  measurementId: "G-B2260RN4P7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); // Initialize Firestore

export { app, auth, firestore };
