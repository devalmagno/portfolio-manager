// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "portfolio-56174.firebaseapp.com",
  projectId: "portfolio-56174",
  storageBucket: "portfolio-56174.appspot.com",
  messagingSenderId: "553336322417",
  appId: "1:553336322417:web:e296c1e752da4e0dec1ed0",
  measurementId: "G-4GKV2LQVRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
    db,
    auth,
    storage,
}