import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDJDZP8LjX1uL04i9r-_dHTNvePvcNTMI",
  authDomain: "startup-simulator-4fa20.firebaseapp.com",
  projectId: "startup-simulator-4fa20",
  storageBucket: "startup-simulator-4fa20.firebasestorage.app",
  messagingSenderId: "922788282060",
  appId: "1:922788282060:web:a334b716b55d511c0b8c69",
  measurementId: "G-05PRQJPN41"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);