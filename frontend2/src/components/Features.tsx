import { BookOpen, Brain, ChartLine, Users } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Driven Insights",
    description: "Advanced machine learning algorithms predict student interests and learning patterns."
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Performance Tracking",
    description: "Comprehensive analysis of academic performance across subjects and assessments."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Project Engagement",
    description: "Monitor student involvement in projects and extracurricular activities."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive insights into student performance and engagement.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-lg hover:translate-y-[-4px] transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;