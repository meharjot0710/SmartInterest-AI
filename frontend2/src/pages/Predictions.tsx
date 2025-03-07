
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ChartLine, Lightbulb, Target } from "lucide-react";

const Predictions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">AI Predictions & Roadmap</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Interest Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Top Subject Interests</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <ChartLine className="h-4 w-4 text-primary" />
                    <span>Mathematics - 92% match</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChartLine className="h-4 w-4 text-primary" />
                    <span>Computer Science - 88% match</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChartLine className="h-4 w-4 text-primary" />
                    <span>Physics - 85% match</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Improvement Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Recommended Actions</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span>Focus on Advanced Mathematics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span>Join Programming Club</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span>Participate in Science Olympiad</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
