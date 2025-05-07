import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const domainMapping = {
  AI: 1,
  "Web Development": 2,
  "Machine Learning": 3,
  Cybersecurity: 4,
  "Data Science": 5,
  Robotics: 6,
  "Game Development": 7,
};
const levelOrder = ["Beginner", "Intermediate", "Advanced"];

interface PredictionProp {
  user: { uid: string };
}

const PredictionForm: React.FC<PredictionProp> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const scores = location.state?.scores || {};

  const [formData, setFormData] = useState({
    "Operating System": scores["Operating System"] * 10,
    DSA: scores["DSA"] * 10,
    Frontend: scores["Frontend"] * 10,
    Backend: scores["Backend"] * 10,
    "Machine Learning": scores["Machine Learning"] * 10,
    "Data Analytics": scores["Data Analytics"] * 10,
    "Project 1": "",
    "Project 2": "",
    "Project 3": "",
    "Project 4": "",
  });

  const [prediction, setPrediction] = useState(null);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    console.log(scores);
    axios
      .get("http://127.0.0.1:5000/roadmaps")
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
        scores: scores,
        predicted_interest: prediction,
        formdata: formData,
        roadmap: prediction.roadmap,
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
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        transformedData
      );
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
  };
  const scrollRef = useRef(null);
  const scrollDown = (e) => {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })};
  return (
    <div>
      <br />
      <Link
        to="/dashboard"
        className=" top-4 left-4 flex items-center text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4  ml-10" />
        Back to Dashboard
      </Link>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-8 rounded-lg shadow-md"
        style={{ backgroundColor: "#272935", color: "white" }}
      >
        {/* Subjects Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Subject Scores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Operating System",
              "DSA",
              "Frontend",
              "Backend",
              "Machine Learning",
              "Data Analytics",
            ].map((subject) => (
              <div
                key={subject}
                className="bg-transparent border border-white/30 rounded-md p-4 text-center hover:border-white/50 transition"
              >
                <label className="block mb-2 font-medium">{subject}</label>
                <div className="text-lg">{formData[subject]}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Select Project Domains
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Project 1", "Project 2", "Project 3", "Project 4"].map(
              (project, index) => (
                <div
                  key={index}
                  className="bg-transparent border border-white/30 rounded-md p-4 text-center hover:border-white/50 transition"
                >
                  <label className="block mb-2 font-medium">{project}</label>
                  <select
                    name={project}
                    value={formData[project]}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#272935] text-white border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">Select Domain</option>
                    {domains.map((domain, idx) => (
                      <option key={idx} value={domain} className="bg-[#272935]">
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            onClick={scrollDown}
            className="bg-white text-[#272935] font-semibold px-6 py-2 rounded-md hover:bg-white/90 transition"
          >
            Start Analysis
          </Button>
        </div>
      </form>

      <br />
      {prediction && (
        <div ref={scrollRef} className="bg-[#272935] m-20 text-white p-8 rounded-xl shadow-lg animate-fade-in space-y-8">
          <div className="flex justify-center">
            <h1 className="font-mono text-3xl text-center border-b border-gray-600 pb-2 animate-pulse">
              Predicted Interest: <strong className="text-4xl ">{prediction.predicted_interest}</strong>
            </h1>
          </div>

          <div className="text-lg font-mono drop-shadow-sm p-5 rounded-xl bg-black/10 animate-slide-in">
            <h2>
              <strong>Prerequisites:</strong>{" "}
              {prediction.roadmap.prerequisites.join(", ")}
            </h2>
          </div>

          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <div
              key={level}
              className="p-6 border border-gray-700 rounded-lg transition-transform hover:scale-[1.005] bg-[#2f323c]"
            >
              <h2 className="text-2xl font-bold mb-3 animate-fade-up">
                {level}
              </h2>
              <div className="space-y-2 font-mono">
                <h2>
                  <strong>Topics:</strong>{" "}
                  {prediction.roadmap.levels[level].topics.join(", ")}
                </h2>
                <h2>
                  <strong>Resource:</strong>{" "}
                  <a
                    className="text-blue-400 underline"
                    href={prediction.roadmap.levels[level].resources[0].link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </a>
                </h2>
                <h2>
                  <strong>Projects:</strong>{" "}
                  {prediction.roadmap.levels[level].projects.join(", ")}
                </h2>
                <h2>
                  <strong>Time Estimate:</strong>{" "}
                  {prediction.roadmap.levels[level].time_estimate}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
