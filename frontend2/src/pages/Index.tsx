
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Student, Computer Science",
    image: "/placeholder.svg",
    quote:
      "SmartInterest AI helped me identify my strengths in mathematics and guided me towards advanced topics I might have missed otherwise.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "High School Senior",
    image: "/placeholder.svg",
    quote:
      "The predictions were incredibly accurate. It helped me choose my college major with confidence.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Engineering Student",
    image: "/placeholder.svg",
    quote:
      "The personalized roadmap made a huge difference in my academic journey. Highly recommended!",
  },
];

const faqs = [
  {
    question: "How does SmartInterest AI predict student interests?",
    answer:
      "SmartInterest AI uses advanced machine learning algorithms to analyze various factors including academic performance, engagement patterns, and project participation to accurately predict student interests and potential career paths.",
  },
  {
    question: "Can I track my progress over time?",
    answer:
      "Yes! Our platform provides detailed progress tracking with visual analytics, allowing you to monitor your improvement across different subjects and skills over time.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We employ industry-standard encryption and security measures to ensure your academic and personal data remains private and protected.",
  },
  {
    question: "How accurate are the predictions?",
    answer:
      "Our AI model has demonstrated a 95% accuracy rate in predicting student interests and academic strengths, based on comprehensive analysis of historical data and ongoing performance.",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />

      {/* Divider with gradient */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent my-20" />

      {/* Testimonials Section */}
      <section className="py-32 bg-accent/5 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(155,135,245,0.1),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(155,135,245,0.1),transparent_40%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Student Success Stories
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Discover how SmartInterest AI has helped students achieve their
            academic goals and unlock their full potential
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="glass-card p-8 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <QuoteIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(155,135,245,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Get answers to common questions about SmartInterest AI and how it
            can help you succeed
          </p>
          <div className="max-w-3xl mx-auto glass-card p-8 rounded-lg">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-primary/10 last:border-none"
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-colors py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-accent/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(155,135,245,0.1),transparent_40%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of students who have already discovered their
            potential with SmartInterest AI
          </p>
          <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Get Started Today
          </button>
        </div>
      </section>
    </main>
  );
};

export default Index;
