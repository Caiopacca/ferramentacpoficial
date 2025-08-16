// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "ferram-oficial-test2",
  "appId": "1:981133857298:web:d58961e12323c2030a7ecb",
  "storageBucket": "ferram-oficial-test2.firebasestorage.app",
  "apiKey": "AIzaSyDf-TrubunHm1DwlPYrVw61eAPXB3F0-SU",
  "authDomain": "ferram-oficial-test2.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "981133857298"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
