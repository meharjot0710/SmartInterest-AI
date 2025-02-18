import React, { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const response = await fetch(`http://localhost:5000/get_user_data?uid=${uid}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Track authentication state
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
    });
  }, []);

  return (
    <div className="p-4">
      {user ? (
        <>
          <h2>Welcome, {user.displayName || user.email}!</h2>
          {userData ? (
            <div>
              <h3>Your Scores</h3>
              <pre>{JSON.stringify(userData.scores, null, 2)}</pre>
              <h3>Your Projects</h3>
              <pre>{JSON.stringify(userData.projects, null, 2)}</pre>
            </div>
          ) : (
            <p>Loading your data...</p>
          )}
        </>
      ) : (
        <p>Please log in to see your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
