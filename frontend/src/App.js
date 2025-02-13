import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScorePage from "./Score";
import PredictionForm from "./PredictionForm";
import TestInterface from "./TestInterface";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<TestInterface/>} />
      <Route path="/predict" element={<PredictionForm/>} />
        <Route path="/scores" element={<ScorePage/>} />
      </Routes>
    </Router>
  );
};

export default App;

