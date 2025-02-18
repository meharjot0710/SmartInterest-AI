import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import TestInterface from "./TestInterface";
import PredictionForm from "./PredictionForm";
import ScorePage from "./Score";
import Navbar from "./Navbar";
import Settings from "./Settings";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return (
    <Router>
      <div className="App">
        {user && <Navbar />}

        <Routes>
          {/* Public Route (Login) */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/test" element={user ? <TestInterface /> : <Navigate to="/login" />} />
          <Route path="/predict" element={user ? <PredictionForm /> : <Navigate to="/login" />} />
          <Route path="/scores" element={user ? <ScorePage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={<Settings user={user} />} />
          {/* Default Route */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
