// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLsigR3ZMGkSSvA_Iz_m3IWmM4-KVObTE",
  authDomain: "studio-7548597316-8274e.firebaseapp.com",
  projectId: "studio-7548597316-8274e",
  storageBucket: "studio-7548597316-8274e.firebasestorage.app",
  messagingSenderId: "1003219845791",
  appId: "1:1003219845791:web:9d0ead2b327b97522d58aa"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

export const firebaseApp = app;
