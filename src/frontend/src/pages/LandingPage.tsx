import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  CheckCircle,
  FileText,
  PawPrint,
  Share2,
  Shield,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: FileText,
    title: "Digital Health Records",
    description:
      "Store and organize all vet visits, vaccinations, medications, and medical history in one secure place.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Brain,
    title: "AI Symptom Analyzer",
    description:
      "Describe symptoms or upload a photo and get instant AI-powered health assessments.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Bell,
    title: "Care Reminders",
    description:
      "Never miss a booster shot, deworming, or flea treatment with smart automated reminders.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Share2,
    title: "Sitter Share",
    description:
      "Generate a secure, time-limited link or printable PDF for your pet sitter or kennel.",
    color: "bg-purple-50 text-purple-600",
  },
];

const whyChoose = [
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your pet's data is stored on the blockchain — decentralized, encrypted, and always yours.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description:
      "Access your pet's health passport from any device, anywhere in the world.",
  },
  {
    icon: Activity,
    title: "AI-Powered Insights",
    description:
      "Get intelligent health assessments and proactive care recommendations.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Profile",
    desc: "Sign in with Internet Identity and add your pets.",
  },
  {
    num: "02",
    title: "Add Health Records",
    desc: "Log vaccinations, vet visits, medications, and more.",
  },
  {
    num: "03",
    title: "Get AI Insights",
    desc: "Analyze symptoms and receive smart care reminders.",
  },
  {
    num: "04",
    title: "Share Securely",
    desc: "Generate a sitter share link in one click.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-warm-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </div>
            <span className="text-navy font-bold text-xl tracking-tight">
              Pawsport
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-muted-foreground hover:text-navy text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#why"
              className="text-muted-foreground hover:text-navy text-sm font-medium transition-colors"
            >
              Why Pawsport
            </a>
            <a
              href="#how"
              className="text-muted-foreground hover:text-navy text-sm font-medium transition-colors"
            >
              How it Works
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/app">
              <Button
                variant="ghost"
                size="sm"
                className="text-navy font-medium"
                data-ocid="landing.link"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/app">
              <Button
                size="sm"
                className="bg-orange text-white hover:bg-orange/90 rounded-pill font-semibold px-5"
                data-ocid="landing.primary_button"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-semibold mb-4">
              <PawPrint className="w-3 h-3" /> AI-Powered Pet Health
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-5">
              Your Pet’s Health,{" "}
              <span className="text-orange">All in One Place</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              The digital health passport for your pets. Store records, analyze
              symptoms with AI, set care reminders, and share with sitters — all
              in one secure app.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-orange text-white hover:bg-orange/90 rounded-pill font-semibold px-8"
                  data-ocid="hero.primary_button"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/app">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-pill font-semibold px-8 border-warm-border text-navy hover:bg-pale-blue/50"
                  data-ocid="hero.secondary_button"
                >
                  See Demo
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4">
              {["No passwords", "Free to start", "Blockchain secured"].map(
                (text) => (
                  <div
                    key={text}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-health-green" />
                    {text}
                  </div>
                ),
              )}
            </div>
          </motion.div>

          {/* Right — hero image with pale blue bg */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="bg-pale-blue rounded-3xl p-4 overflow-hidden shadow-card-hover">
              <img
                src="/assets/generated/hero-pets-together.dim_600x500.jpg"
                alt="Happy pets"
                className="w-full rounded-2xl object-cover"
              />
              {/* Floating card */}
              <div className="absolute bottom-10 left-2 bg-card-bg rounded-2xl shadow-card p-3 border border-warm-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-health-green/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-health-green" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-navy">
                      Buddy is healthy!
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Next vet: Apr 15
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-pale-blue/30 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-navy mb-3">
              Everything Your Pet Needs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From digital records to AI-powered health analysis, Pawsport
              covers every aspect of your pet’s wellness journey.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card-bg rounded-2xl p-6 border border-warm-border shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section id="why" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-navy mb-3">
              Why Choose Pawsport?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for modern pet parents who care deeply about their animals’
              wellbeing.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChoose.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-8 bg-card-bg rounded-2xl border border-warm-border shadow-card"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-orange" />
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-navy py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Get your pet’s health passport set up in minutes.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative"
              >
                <div className="text-4xl font-bold text-white/10 mb-3">
                  {step.num}
                </div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/app">
              <Button
                size="lg"
                className="bg-orange text-white hover:bg-orange/90 rounded-pill font-semibold px-10"
                data-ocid="cta.primary_button"
              >
                Start Your Pet’s Pawsport
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cream border-t border-warm-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange flex items-center justify-center">
              <PawPrint className="w-3 h-3 text-white" />
            </div>
            <span className="text-navy font-bold text-sm">Pawsport</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-navy transition-colors">
              Features
            </a>
            <a href="#why" className="hover:text-navy transition-colors">
              About
            </a>
            <Link to="/app" className="hover:text-navy transition-colors">
              Dashboard
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}. Built with ❤ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:text-navy transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
