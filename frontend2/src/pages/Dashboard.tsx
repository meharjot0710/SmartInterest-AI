import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface UserData {
  scores: Record<string, number[]>;
  name: string;
  predicted_interest: string;
  roadmap: {
    prerequisites: string[];
    levels: {
      Beginner: {
        topics: string[];
        resources: { link: string }[];
        projects: string[];
        time_estimate: string;
      };
      Intermediate: {
        topics: string[];
        resources: { link: string }[];
        projects: string[];
        time_estimate: string;
      };
      Advanced: {
        topics: string[];
        resources: { link: string }[];
        projects: string[];
        time_estimate: string;
      };
    };
  };
}

interface DashboardProps {
  user: { uid: string };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [roadshow, setRoadshow] = useState<boolean>(false);

  useEffect(() => {
    fetch(`http://localhost:5000/get_user_data?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!userData) return <p className="text-white p-6">Error loading data.</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">🎓 SmartInterest AI</h1>
        <div className="flex items-center gap-6">
          <span className="text-gray-300">
            Welcome, <span className="font-semibold text-purple-400">{userData.name}</span>
          </span>
          <Link to="/" className="text-purple-400 hover:underline">LogOut</Link>
        </div>
      </nav>

      <div className="flex-grow p-6 space-y-8">

        {/* Roadmap Modal */}
        {roadshow && (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
    <div className="bg-slate-800 text-black rounded-2xl shadow-2xl w-full max-w-4xl p-6 overflow-auto max-h-[90vh] relative">
      <button
        onClick={() => setRoadshow(false)}
        className="absolute top-4 right-6 text-2xl text-gray-500 hover:text-red-500 transition-colors"
      >
        ×
      </button>

      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-purple-400 mb-2">{userData.predicted_interest}</h2>
        <p className="text-gray-300">
          <strong className="font-semibold text-gray-200">Prerequisites:</strong> {userData.roadmap.prerequisites.join(", ")}
        </p>
      </div>

      {/* Levels */}
      {["Beginner", "Intermediate", "Advanced"].map((level, idx) => {
        const data = userData.roadmap.levels[level as keyof typeof userData.roadmap.levels];
        const bgColors = ["bg-blue-50", "bg-yellow-50", "bg-purple-50"];
        return (
          <div key={level} className={`mb-6 rounded-xl p-5 border-l-4 ${bgColors[idx]} border-indigo-500`}>
            <h3 className="text-2xl font-semibold text-indigo-800 mb-3">{level}</h3>
            <p className="mb-2">
              <strong>Topics:</strong> {data.topics.join(", ")}
            </p>
            <p className="mb-2">
              <strong>Resources:</strong>{" "}
              {data.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.link}
                  className="text-blue-600 underline hover:text-blue-800 mr-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {new URL(r.link).hostname}
                </a>
              ))}
            </p>
            <p className="mb-2">
              <strong>Projects:</strong> {data.projects.join(", ")}
            </p>
            <p>
              <strong>Time Estimate:</strong> {data.time_estimate}
            </p>
          </div>
        );
      })}
    </div>
  </div>
)}


        {/* Recent Marks */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">📊 Recent Marks</h3>
          <table className="w-full text-left">
          {Object.keys(userData.scores).length === 0 ? 
          ""
          :
          <thead>
              <tr className="text-purple-400">
                <th className="pb-2">Subject</th>
                <th className="pb-2">Marks</th>
              </tr>
            </thead>
          }
            <tbody className="text-gray-300">
              {Object.keys(userData.scores).length === 0 ? (
                <tr><td colSpan={2}>No data available</td></tr>
              ) : (
                Object.entries(userData.scores).map(([subject, marks], idx) => (
                  <tr key={idx} className="border-t border-gray-800">
                    <td className="py-2">{subject}</td>
                    <td className="py-2">{marks.join(", ")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Predicted Interest */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">🔮 Predicted Interest</h3>
          <p className="text-lg text-purple-400 font-bold">
            {userData.predicted_interest || "No prediction made"}
          </p>
        </div>

        {/* Personalized Roadmap Summary */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">🗺️ Personalized Roadmap</h3>
          <ul className="list-disc list-inside text-gray-300">
            {
            userData.roadmap==null ?
            ''
            :
            ["Beginner", "Intermediate", "Advanced"].map((level) => (
              <li key={level}>
                <strong>{level}:</strong> {userData.roadmap.levels[level as keyof typeof userData.roadmap.levels].topics.join(", ")}
              </li>
            ))
          }
          </ul>
          { userData.roadmap==null ?
          <p className="text-gray-300">No roadmap available</p>
          
          : 
          <button
            onClick={() => setRoadshow(true)}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
          >
            Show full roadmap
          </button>
          }
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link to="/tests">
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-white flex items-center gap-2">
              Start Analysis <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
