import React, { useState } from "react";
import axios from "axios";

const domainMapping = {
  "AI": 1,
  "Web Development": 2,
  "Machine Learning": 3,
  "Cybersecurity": 4,
  "Data Science": 5,
  "Robotics": 6,
  "Game Development": 7
};

const domainOptions = Object.keys(domainMapping); // Dropdown options

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    "Operating System": 0,
    "DSA": 0,
    "Frontend": 0,
    "Backend": 0,
    "Machine Learning": 0,
    "Data Analytics": 0,
    "Project 1": "Robotics",
    "Project 2": "Web Development",
    "Project 3": "Robotics",
    "Project 4": "Cybersecurity",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert marks to numbers, but store project names as strings
    setFormData({
      ...formData,
      [name]: name.startsWith("Project") ? value : Number(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert project names to numbers before sending the request
    const processedData = {
      ...formData,
      "Project 1": domainMapping[formData["Project 1"]],
      "Project 2": domainMapping[formData["Project 2"]],
      "Project 3": domainMapping[formData["Project 3"]],
      "Project 4": domainMapping[formData["Project 4"]],
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", processedData);
      setPrediction(response.data);
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
            {key.startsWith("Project") ? (
              // Dropdown for project selection
              <select name={key} value={formData[key]} onChange={handleChange} required>
                {domainOptions.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            ) : (
              // Numeric input for marks
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <button type="submit">Predict Interest</button>
      </form>

      {prediction && (
        <div>
          <h3>Predicted Interest: {prediction.predicted_interest}</h3>
          <p>{prediction.roadmap.description}</p>
          <h4>Resources:</h4>
          <ul>
            {prediction.roadmap.resources.map((resource, index) => (
              <li key={index}>
                <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
