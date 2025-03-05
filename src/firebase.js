// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "car-marketplace-1b5df.firebaseapp.com",
  projectId: "car-marketplace-1b5df",
  storageBucket: "car-marketplace-1b5df.appspot.com",
  messagingSenderId: "405841099162",
  appId: "1:405841099162:web:0a6142e75e91fed8736223",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
