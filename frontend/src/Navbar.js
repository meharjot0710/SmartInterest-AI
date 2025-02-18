import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="text-xl font-bold">SmartInterest AI</div>

      <div className="flex space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/test" className="hover:underline">Take Test</Link>
        <Link to="/predict" className="hover:underline">Predict Interest</Link>
        <Link to="/scores" className="hover:underline">Scores</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
        <Link to="/settings" className="hover:underline">Settings</Link>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
