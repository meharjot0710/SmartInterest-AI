import React, { useState } from "react";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const storeUserInDB = async (user) => {
    await fetch("http://localhost:5000/store_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || "Anonymous",
      }),
    });
  };
  
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await storeUserInDB(result.user);
      alert("Login Successful!");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };
  
  const loginWithEmail = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await storeUserInDB(userCredential.user);
      alert("Login Successful!");
    } catch (error) {
      console.error("Email Login Error:", error);
    }
  };
  

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account Created!");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Sign In</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={loginWithEmail}>Login</button>
      <button onClick={register}>Register</button>
      <button onClick={loginWithGoogle}>Login with Google</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Auth;