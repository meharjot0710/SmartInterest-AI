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
  const storeUserInDB = async (user) => {
    await fetch("http://localhost:5000/update_user_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        scores:scores,
        predicted_interest:prediction,
        formdata:formData,
        roadmap:prediction.roadmap
      }),
    });
  };
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
      fetch("http://localhost:5000/update_user_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          scores: scores,
          predicted_interest: response.data, // Use response.data directly
          formdata: formData,
          roadmap: response.data.roadmap, // Use response.data directly
        }),
      });
    
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <br/>
      <Link
        to="/dashboard"
        className=" top-4 left-4 flex items-center text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>
      <h1 className="flex justify-center text-2xl">Score</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-evenly flex-wrap">
        {["Operating System", "DSA", "Frontend", "Backend", "Machine Learning", "Data Analytics"].map((subject) => (
          <div key={subject} className="rounded border-2 w-36 border-white text-sm h-12">
            <label className="flex justify-center">{subject}</label>
            <div className="flex justify-center">{formData[subject]}</div>
          </div>
        ))}
        </div>
        <br/>
        <h1 className="flex justify-center text-2xl">Projects</h1>
        <div className="flex justify-evenly flex-wrap">
        {["Project 1", "Project 2", "Project 3", "Project 4"].map((project, index) => (
          <div key={index} className="rounded border-2 w-36 border-white text-sm h-12">
            <label className="flex justify-center">{project}</label>
            <select name={project} value={formData[project]} onChange={handleChange} className="bg-transparent flex justify-center" required>
              <option value="" className="bg-black">Select Domain</option>
              {domains.map((domain, idx) => (
                <option key={idx} value={domain} className="bg-black">{domain}</option>
              ))}
            </select>
          </div>
        ))}
        </div>
        <br/>
        <div className="flex justify-center">
        <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
          Start Analysis
        </Button>
        </div>
      </form>
        <br/>
      {prediction && (
        <div>
          <div>
        <h1 className="font-mono text-2xl flex justify-center">Predicted Interest: {prediction.predicted_interest}</h1>
      </div>
      <br/>
      <h2 className="text-white font-mono"><strong>Prerequisites:</strong> {prediction.roadmap.prerequisites.join(", ")}</h2>
      <br/>
      <div className="text-white font-mono">
        <h2 className="text-xl">Beginner</h2>
        <br/>
        <h2><strong>Topics:</strong> {prediction.roadmap.levels.Beginner.topics.join(", ")}</h2>
        <h2><strong>Resouce:</strong> {prediction.roadmap.levels.Beginner.resources[0].link}</h2>
        <h2><strong>Projects:</strong> {prediction.roadmap.levels.Beginner.projects.join(", ")}</h2>
        <h2><strong>Time Estimate:</strong> {prediction.roadmap.levels.Beginner.time_estimate}</h2>
      </div>
      <br/>
      <div className="text-white font-mono">
        <h2 className="text-xl">Intermediate</h2>
        <br/>
        <h2><strong>Topics:</strong> {prediction.roadmap.levels.Intermediate.topics.join(", ")}</h2>
        <h2><strong>Resouce:</strong> {prediction.roadmap.levels.Intermediate.resources[0].link}</h2>
        <h2><strong>Projects:</strong> {prediction.roadmap.levels.Intermediate.projects.join(", ")}</h2>
        <h2><strong>Time Estimate:</strong> {prediction.roadmap.levels.Intermediate.time_estimate}</h2>
      </div>
      <br/>
      <div className="text-white font-mono">
        <h2 className="text-xl">Advanced</h2>
        <br/>
        <h2><strong>Topics:</strong> {prediction.roadmap.levels.Advanced.topics.join(", ")}</h2>
        <h2><strong>Resouce:</strong> {prediction.roadmap.levels.Advanced.resources[0].link}</h2>
        <h2><strong>Projects:</strong> {prediction.roadmap.levels.Advanced.projects.join(", ")}</h2>
        <h2><strong>Time Estimate:</strong> {prediction.roadmap.levels.Advanced.time_estimate}</h2>
      </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
