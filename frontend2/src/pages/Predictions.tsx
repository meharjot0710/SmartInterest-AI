import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import {  Link } from "react-router-dom";

const domainMapping = {
  "AI": 1,
  "Web Development": 2,
  "Machine Learning": 3,
  "Cybersecurity": 4,
  "Data Science": 5,
  "Robotics": 6,
  "Game Development": 7
};
const levelOrder = ["Beginner", "Intermediate", "Advanced"];


interface PredictionProp {
  user: { uid: string };
}

const PredictionForm: React.FC<PredictionProp> = ({ user })=> {
  const location = useLocation();
  const navigate = useNavigate();
  const scores = location.state?.scores || {};

  const [formData, setFormData] = useState({
    "Operating System": scores["Operating System"]*10,
    "DSA": scores["DSA"]*10,
    "Frontend": scores["Frontend"]*10,
    "Backend": scores["Backend"]*10,
    "Machine Learning": scores["Machine Learning"]*10,
    "Data Analytics": scores["Data Analytics"]*10,
    "Project 1": "",
    "Project 2": "",
    "Project 3": "",
    "Project 4": "",
  });

  const [prediction, setPrediction] = useState(null);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    console.log(scores)
    axios.get("http://127.0.0.1:5000/roadmaps")
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
  const levelOrder = ["Beginner", "Intermediate", "Advanced"];
  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedData = {
      user_id: location.state?.uid,
      ...formData,
      "Project 1": domainMapping[formData["Project 1"]] || 0,
      "Project 2": domainMapping[formData["Project 2"]] || 0,
      "Project 3": domainMapping[formData["Project 3"]] || 0,
      "Project 4": domainMapping[formData["Project 4"]] || 0, 
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", transformedData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    try {
      const storeUserInDB = async (user) => {
        await fetch("http://localhost:5000/update_user_data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            scores:scores,
            predicted_interest:prediction,
            formdata:formData
          }),
        });
      };
      
      await storeUserInDB(user);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Link
        to="/dashboard"
        className=" top-4 left-4 flex items-center text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>
      <h2>Score</h2>
      <form onSubmit={handleSubmit}>
        {["Operating System", "DSA", "Frontend", "Backend", "Machine Learning", "Data Analytics"].map((subject) => (
          <div key={subject}>
            <label>{subject}:</label>
            <div>{formData[subject]}</div>
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
        <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
          Start Analysis
        </Button>
      </form>

      {prediction && (
        <div>
          <h3>Predicted Interest: {prediction.predicted_interest}</h3>
          <p>{prediction.roadmap.prerequisites}</p>

          {/* Displaying All Roadmap Levels */}
          {prediction.roadmap.levels &&
  levelOrder.map((level) => {
    const details = prediction.roadmap.levels[level];
    return details ? (
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
    ) : null;
  })
}
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
