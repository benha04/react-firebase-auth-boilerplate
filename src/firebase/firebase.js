import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app)
export { app, auth };
