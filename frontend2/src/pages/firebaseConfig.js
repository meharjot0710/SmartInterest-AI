import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyCvHPU69NvquKlB_8mCp2P59vDbBAdvqvw",
    authDomain: "smartinterest-ai.firebaseapp.com",
    projectId: "smartinterest-ai",
    storageBucket: "smartinterest-ai.firebasestorage.app",
    messagingSenderId: "442074685588",
    appId: "1:442074685588:web:86450691643c90365a1481"
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
