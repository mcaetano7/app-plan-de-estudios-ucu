// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAxT3ScePUGEjK0f2jmBUh685YrJRVi6hE",
  authDomain: "plan-de-estudios-ucu.firebaseapp.com",
  projectId: "plan-de-estudios-ucu",
  storageBucket: "plan-de-estudios-ucu.firebasestorage.app",
  messagingSenderId: "162058954817",
  appId: "1:162058954817:web:85663c5fb81fd23299bec0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// 👉 Añadí estas líneas que faltaban:
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
