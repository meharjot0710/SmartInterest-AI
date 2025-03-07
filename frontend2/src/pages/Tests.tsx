
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, Clock, FileText, TrendingUp } from "lucide-react";
import { useState } from "react";

const tests = [
  {
    id: 1,
    title: "Mathematics Mid-Term",
    date: "March 15, 2024",
    duration: "2 hours",
    status: "Upcoming"
  },
  {
    id: 2,
    title: "Physics Assessment",
    date: "March 20, 2024",
    duration: "1.5 hours",
    status: "Upcoming"
  },
  {
    id: 3,
    title: "Chemistry Quiz",
    date: "March 10, 2024",
    duration: "45 minutes",
    status: "Completed"
  }
];

const progressData = [
  { subject: "Mathematics", score: 85, improvement: "+5%" },
  { subject: "Physics", score: 78, improvement: "+3%" },
  { subject: "Chemistry", score: 92, improvement: "+7%" }
];

const Tests = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">AI Predictions & Roadmap</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader>
              <CardTitle>Test Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Progress Tracking Section */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressData.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject.subject}</span>
                      <span className="text-sm text-primary">{subject.improvement}</span>
                    </div>
                    <div className="h-2 bg-accent/10 rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${subject.score}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Score: {subject.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-8">Upcoming Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Card key={test.id} className="glass-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {test.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{test.date} • {test.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>{test.status}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tests;
