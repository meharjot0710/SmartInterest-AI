import React, { useState } from "react";
import axios from "axios";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    "Operating System": 0,
    "DSA": 0,
    "Frontend": 0,
    "Backend": 0,
    "Machine Learning": 0,
    "Data Analytics": 0,
    "Project 1": 6,
    "Project 2": 1,
    "Project 3": 6,
    "Project 4": 4,
  });

  const [prediction, setPrediction] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(response.data.predicted_interest);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Enter Marks & Projects</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key}:</label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Predict Interest</button>
      </form>
      {prediction && <h3>Predicted Interest: {prediction}</h3>}
    </div>
  );
};

export default PredictionForm;
