// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7r_2fchWFHOQzjX4Fok6dARUp4Q_V9cs",
  authDomain: "unisocial-b6e02.firebaseapp.com",
  projectId: "unisocial-b6e02",
  storageBucket: "unisocial-b6e02.firebasestorage.app",
  messagingSenderId: "697610607716",
  appId: "1:697610607716:web:3990ceb1e7692d01129371",
  measurementId: "G-0D5P7K5JMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
