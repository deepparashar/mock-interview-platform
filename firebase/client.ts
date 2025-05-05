// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCdNyuiWV-oYUxPQKxdY1Zuy4e3L98iZmU",
  authDomain: "preptify-1cab4.firebaseapp.com",
  projectId: "preptify-1cab4",
  storageBucket: "preptify-1cab4.firebasestorage.app",
  messagingSenderId: "349780966272",
  appId: "1:349780966272:web:c2794525843749a6995f65",
  measurementId: "G-TVZ05NQM3P"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);