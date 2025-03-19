import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, ChartLine } from "lucide-react";
import { Link } from "react-router-dom";

interface UserData {
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

  useEffect(() => {
    fetch(`http://localhost:5000/get_user_data?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
          setUserData(data);
          setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>Error loading data.</p>;

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">Welcome, {userData.name}</h2>

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
              {Object.entries(userData.scores || {}).map(([subject, scores]) => (
                <TableRow key={subject}>
                  <TableCell>{subject}</TableCell>
                  <TableCell>{scores.join(", ")}</TableCell>
                </TableRow>
              ))}
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
          <p className="text-lg font-semibold">{userData.predicted_interest}</p>
        </CardContent>
      </Card>

      {/* Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{userData.roadmap.description}</p>
          <ul className="list-disc list-inside">
            <li><strong>Beginner:</strong> {userData.roadmap.levels.Beginner.join(", ")}</li>
            <li><strong>Intermediate:</strong> {userData.roadmap.levels.Intermediate.join(", ")}</li>
            <li><strong>Advanced:</strong> {userData.roadmap.levels.Advanced.join(", ")}</li>
          </ul>
        </CardContent>
      </Card>
      <Link to="/tests">
      <Button size="lg" className="bg-primary hover:bg-primary/90">
        Start Analysis
      <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
      </Link>
    </div>
  );
};

export default Dashboard;
