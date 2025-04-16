// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBU7LSdXhbd_sIMvgjdYBBCC1U-Jj-Ttd0",
  authDomain: "fantasai-writers.firebaseapp.com",
  projectId: "fantasai-writers",
  storageBucket: "fantasai-writers.appspot.com", // fixed!
  messagingSenderId: "370772356262",
  appId: "1:370772356262:web:8ab729b89f90a2f64b5867",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
