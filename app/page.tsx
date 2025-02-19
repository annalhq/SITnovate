"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Shield,
  Mail,
  Zap,
  Lock,
  CheckCircle2,
  Star,
  ArrowRight,
  Menu,
} from "lucide-react";
import { useState } from "react";

const stats = [
  { value: "99.9%", label: "Detection Accuracy" },
  { value: "24/7", label: "Monitoring" },
  { value: "1M+", label: "Emails Protected" },
];

const features = [
  {
    icon: Shield,
    title: "Real-Time Detection",
    description: "Identify threats as they emerge with our AI-powered detection system.",
  },
  {
    icon: Mail,
    title: "Email Filtering",
    description: "Automatically filter out phishing emails and other malicious content.",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Receive instant notifications when a threat is detected.",
  },
  {
    icon: Lock,
    title: "Secure Encryption",
    description: "Ensure your emails are encrypted and secure from unauthorized access.",
  },
  {
    icon: CheckCircle2,
    title: "Verified Senders",
    description: "Verify the identity of email senders to prevent spoofing.",
  },
  {
    icon: Star,
    title: "Priority Support",
    description: "Get priority support from our dedicated team of security experts.",
  },
];

const pricingPlans = [
  {
    name: "Basic",
    price: "9.99",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    recommended: false,
  },
  {
    name: "Pro",
    price: "19.99",
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "29.99",
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    recommended: false,
  },
];

const faqs = [
  {
    question: "What is TruthSeek?",
    answer: "TruthSeek is an AI-powered email security solution that detects and blocks phishing attacks in real-time.",
  },
  {
    question: "How does the AI detection work?",
    answer: "Our AI models analyze email content and metadata to identify potential threats and block them before they reach your inbox.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use advanced encryption and security protocols to ensure your data is protected at all times.",
  },
];

const footerLinks = [

  {
    title: "About Us",
    links: ["Team", "Members"],
  },
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Responsive Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">TruthSeek</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
            >
              Sign In
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Sign Up
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-4 py-2 bg-background border-t border-border/50">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Sign In
              </Button>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Improved Mobile Layout */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/30 via-purple-500/30 to-background"></div>
        {/* Animated shapes - Adjusted for mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 top-1/4 w-48 md:w-72 h-48 md:h-72 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute -right-4 top-1/4 w-48 md:w-72 h-48 md:h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48 md:w-72 h-48 md:h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              className="mb-4 px-3 py-1 md:px-4 md:py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-500/20 transition-colors duration-200"
              variant="secondary"
            >
              AI-Powered Security
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 leading-tight">
              Protect Your Inbox with Advanced AI Detection
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed px-4">
              Stop phishing attacks before they reach your inbox. Our AI-powered
              solution detects and blocks sophisticated email threats in
              real-time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg group w-full sm:w-auto"
              >
                Start Scanning Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            {/* Trust badges - Mobile Responsive */}
            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/50 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4">
              <div className="text-muted-foreground/60 text-sm md:text-base">
                Powered by advanced models
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                {["DeepSeek R1", "RoBERTa", "Qwen 2.5 Max"].map((company) => (
                  <div
                    key={company}
                    className="text-muted-foreground/80 font-semibold text-sm md:text-base"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Responsive */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">
              Advanced Protection Features
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Comprehensive security for your email communications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-4 md:p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-indigo-600 mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Responsive */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Responsive */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Find answers to common questions about our service
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm md:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="bg-muted/50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
              <span className="font-bold text-lg md:text-xl">TruthSeek</span>
            </div>
            <p className="text-muted-foreground text-sm md:text-base text-center">
              Protecting your inbox with advanced AI technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}