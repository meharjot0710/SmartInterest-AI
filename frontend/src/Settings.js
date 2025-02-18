import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { updateProfile, updatePassword } from "firebase/auth";

const Settings = ({ user }) => {
  const [name, setName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password changed successfully!");
    } catch (error) {
      alert("Error changing password: " + error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Profile Update */}
      <div className="mt-4">
        <label className="block">Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="border p-2 w-full"
        />
        <button onClick={handleUpdateProfile} className="bg-blue-500 text-white px-4 py-2 mt-2">
          Update Profile
        </button>
      </div>

      {/* Password Change */}
      <div className="mt-4">
        <label className="block">New Password</label>
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          className="border p-2 w-full"
        />
        <button onClick={handleChangePassword} className="bg-red-500 text-white px-4 py-2 mt-2">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
