import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, ChartLine } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(155,135,245,0.1),rgba(155,135,245,0)_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="glass-card inline-flex items-center px-4 py-2 mb-8 rounded-full">
            <Brain className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm">AI-Powered Student Analytics</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Unlock Student Potential with AI Insights
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Predict student interests and create personalized improvement roadmaps using advanced AI analysis of attendance, marks, and project engagement.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Analysis
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="secondary">
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-16 glass-card p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary mb-2">96%</h3>
              <p className="text-muted-foreground">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary mb-2">100+</h3>
              <p className="text-muted-foreground">Students Analyzed</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-primary mb-2">90%</h3>
              <p className="text-muted-foreground">Improvement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;