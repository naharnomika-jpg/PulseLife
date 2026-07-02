// Firebase Initialization, Analytics, Firestore & Auth Setup for PulseLife
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMGNsKYG-ath-i-cwheWXDnSLET47IpZA",
  authDomain: "pulse-life-752a6.firebaseapp.com",
  projectId: "pulse-life-752a6",
  storageBucket: "pulse-life-752a6.firebasestorage.app",
  messagingSenderId: "60546859911",
  appId: "1:60546859911:web:1056fd861a6786cbce0922",
  measurementId: "G-GWFL2J59KT"
};

// Initialize Firebase SDK instances
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("PulseLife: Firebase, Analytics, Firestore, and Auth Database initialized successfully.");
