import React, { useState, useEffect } from "react";
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

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    "Operating System": 0,
    "DSA": 0,
    "Frontend": 0,
    "Backend": 0,
    "Machine Learning": 0,
    "Data Analytics": 0,
    "Project 1": "",
    "Project 2": "",
    "Project 3": "",
    "Project 4": "",
  });

  const [prediction, setPrediction] = useState(null);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    axios.get("https://smartinterest-ai.onrender.com/roadmaps")
      .then((response) => {
        setDomains(Object.keys(response.data));
      })
      .catch((error) => console.error("Error fetching roadmaps:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedData = {
      ...formData,
      "Project 1": domainMapping[formData["Project 1"]] || 0,
      "Project 2": domainMapping[formData["Project 2"]] || 0,
      "Project 3": domainMapping[formData["Project 3"]] || 0,
      "Project 4": domainMapping[formData["Project 4"]] || 0,
    };

    try {
      const response = await axios.post("https://smartinterest-ai.onrender.com/predict", transformedData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Enter Marks & Projects</h2>
      <form onSubmit={handleSubmit}>
        {["Operating System", "DSA", "Frontend", "Backend", "Machine Learning", "Data Analytics"].map((subject) => (
          <div key={subject}>
            <label>{subject}:</label>
            <input type="number" name={subject} value={formData[subject]} onChange={handleChange} required />
          </div>
        ))}

        {["Project 1", "Project 2", "Project 3", "Project 4"].map((project, index) => (
          <div key={index}>
            <label>{project}:</label>
            <select name={project} value={formData[project]} onChange={handleChange} required>
              <option value="">Select Domain</option>
              {domains.map((domain, idx) => (
                <option key={idx} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        ))}

        <button type="submit">Predict Interest</button>
      </form>

      {prediction && (
        <div>
          <h3>Predicted Interest: {prediction.predicted_interest}</h3>
          <p>{prediction.roadmap.description}</p>

          {/* Displaying All Roadmap Levels */}
          {prediction.roadmap.levels && Object.entries(prediction.roadmap.levels).map(([level, details]) => (
            <div key={level}>
              <h4>{level}</h4>
              <p><strong>Topics:</strong> {details.topics.join(", ")}</p>
              <p><strong>Projects:</strong> {details.projects.join(", ")}</p>

              <h5>Resources:</h5>
              <ul>
                {details.resources.map((resource, index) => (
                  <li key={index}>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p><strong>Time Estimate:</strong> {details.time_estimate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
