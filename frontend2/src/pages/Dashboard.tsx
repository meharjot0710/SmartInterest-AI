import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, ChartLine } from "lucide-react";
import { Link } from "react-router-dom";

interface UserData {
  scores: {};
  name: string;
  marks: Record<string, number[]>;
  predicted_interest: string;
  roadmap: {
    description: string;
    levels: {
      Beginner: string[];
      Intermediate: string[];
      Advanced: string[];
    };
  };
}
interface DashboardProps {
  user: { uid: string };
}


const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [roadshow,setroadshow]=useState<boolean>(false);

  const containerStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ccc',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
    minWidth: '300px',
    minHeight: '200px',
    borderRadius: '8px',
    overflow: 'auto',
    width: '90%',
    height:'80%'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '20px',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#888',
  };

  useEffect(() => {
    fetch(`http://localhost:5000/get_user_data?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserData(data);
        console.log(userData.scores)
          setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>Error loading data.</p>;
  const show=()=>{
    setroadshow(true);
  }
  const onClose=()=>{
    setroadshow(false);
  }
  return (
    <div className="p-6">
      <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, {userData.name}</h2>
      <Link to="/" className=" top-4 left-4 flex items-center text-primary hover:underline">
        LogOut
      </Link>
      </div>
      {roadshow ?
      <div style={containerStyle}>
      <div style={closeButtonStyle} onClick={onClose} >
        &#x2715;
      </div>
      <div>
        <h1 className="text-black font-mono text-2xl">{userData.predicted_interest[userData.predicted_interest.length-1]}</h1>
      </div>
      <br/>
      <h2 className="text-black font-mono"><strong>Prerequisites:</strong> {userData.roadmap.prerequisites.join(", ")}</h2>
      <br/>
      <div className="text-black font-mono">
        <h2 className="text-xl">Beginner</h2>
        <br/>
        <h2><strong>Topics:</strong> {userData.roadmap.levels.Beginner.topics.join(", ")}</h2>
        <h2><strong>Resouces:</strong> {userData.roadmap.levels.Beginner.resources[0].link}</h2>
        <h2><strong>Projects:</strong> {userData.roadmap.levels.Beginner.projects.join(", ")}</h2>
        <h2><strong>Time Estimate:</strong> {userData.roadmap.levels.Beginner.time_estimate}</h2>
      </div>
      <br/>
      <div className="text-black font-mono">
        <h2 className="text-xl">Intermediate</h2>
        <br/>
        <h2><strong>Topics:</strong> {userData.roadmap.levels.Intermediate.topics.join(", ")}</h2>
        <h2><strong>Resouces:</strong> {userData.roadmap.levels.Intermediate.resources[0].link}</h2>
        <h2><strong>Projects:</strong> {userData.roadmap.levels.Intermediate.projects.join(", ")}</h2>
        <h2><strong>Time Estimate:</strong> {userData.roadmap.levels.Intermediate.time_estimate}</h2>
      </div>
      <br/>
      <div className="text-black font-mono">
        <h2 className="text-xl">Advanced</h2>
        <br/>
        <h2><strong>Topics:</strong> {userData.roadmap.levels.Advanced.topics.join(", ")}</h2>
        <h2><strong>Resouces:</strong> {userData.roadmap.levels.Advanced.resources[0].link}</h2>
        <h2><strong>Projects:</strong> {userData.roadmap.levels.Advanced.projects.join(", ")}</h2>
        <h2><strong>Time Estimate:</strong> {userData.roadmap.levels.Advanced.time_estimate}</h2>
      </div>
    </div>
      :
      ''
      }
      {/* Marks Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Last 3 Marks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { JSON.stringify(userData.scores)==='{}' ?
                <TableRow >
                  <TableCell>No data Available</TableCell>
                  <TableCell></TableCell>
                </TableRow>
            :
          Object.entries(userData.scores || {}).map(([subject, scores]) => (
            <TableRow key={subject}>
              <TableCell>{subject}</TableCell>
              <TableCell>{scores.join(", ")}</TableCell>
            </TableRow>
          ))
          }
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Predicted Interest */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Latest 2 Predicted Interest</CardTitle>
        </CardHeader>
        <CardContent> 
        { userData.predicted_interest ?
          userData.predicted_interest.map((v,e)=>{
            return (
            <p className="text-lg font-semibold" key={e}>{v}</p>
            )
          })
          
          :
          <p>No prediction made</p>
        }
          {/* <p className="text-lg font-semibold">{userData.predicted_interest}</p> */}
        </CardContent>
      </Card>

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          { userData.roadmap ?
          <>
          <ul className="list-disc list-inside">
            <li><strong>Beginner:</strong> {userData.roadmap.levels.Beginner.topics.join(", ")}</li>
            <li><strong>Intermediate:</strong> {userData.roadmap.levels.Intermediate.topics.join(", ")}</li>
            <li><strong>Advanced:</strong> {userData.roadmap.levels.Advanced.topics.join(", ")}</li>
          </ul>
          <br/>
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={show}>
            Show full roadmap
          </Button>
          </>
          :
          <p className="mb-4">No data available</p>
          }
        </CardContent>
      </Card>
      <br/>
      <Link to="/tests"  className="flex justify-center">
      <Button size="lg" className="bg-primary hover:bg-primary/90 place-self-center">
        Start Analysis
      <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
      </Link>
    </div>
  );
};

export default Dashboard;
