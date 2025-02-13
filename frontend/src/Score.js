import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scores = location.state?.scores || {};

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">Test Results</h2>
      {Object.keys(scores).length > 0 ? (
        <ul className="mt-4">
          {Object.entries(scores).map(([subject, score]) => (
            <li key={subject} className="p-2">
              {subject}: {score} / 10
            </li>
          ))}
        </ul>
      ) : (
        <p>No scores available.</p>
      )}
      <button onClick={() => navigate("/")} className="mt-4 p-2 bg-blue-500 text-white">Retake Test</button>
    </div>
  );
};

export default ScorePage;
