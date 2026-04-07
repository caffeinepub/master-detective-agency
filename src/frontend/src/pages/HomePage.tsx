import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Search,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateInquiry } from "../hooks/useQueries";

const services = [
  {
    icon: UserCheck,
    title: "Background Verification",
    desc: "Comprehensive pre-employment and personal background checks with criminal, financial, and identity verification.",
    emoji: "🛡️",
  },
  {
    icon: Search,
    title: "Personal Investigation",
    desc: "Discreet personal investigations covering matrimonial, infidelity, surveillance, and asset tracing.",
    emoji: "🕵️",
  },
  {
    icon: Building2,
    title: "Corporate Investigation",
    desc: "Protecting your business from fraud, espionage, misconduct, and competitive intelligence threats.",
    emoji: "🏢",
  },
  {
    icon: Users,
    title: "Missing Person Tracking",
    desc: "Professional missing persons investigations leveraging nationwide networks and advanced tracking methods.",
    emoji: "👤",
  },
];

const caseStudies = [
  {
    img: "/assets/generated/case-study-1.dim_600x400.jpg",
    title: "Operation Shadow Ledger",
    excerpt:
      "Uncovered a ₹4.2 Cr internal embezzlement scheme within a mid-size FMCG company through forensic accounting and covert surveillance.",
    tag: "Corporate Fraud",
  },
  {
    img: "/assets/generated/case-study-2.dim_600x400.jpg",
    title: "The Phantom Executive",
    excerpt:
      "Traced a serial con artist operating under 7 different identities across 3 states before corporate clients could suffer losses.",
    tag: "Identity Fraud",
  },
  {
    img: "/assets/generated/case-study-3.dim_600x400.jpg",
    title: "Operation Lost Light",
    excerpt:
      "Successfully located a missing teenager within 72 hours using digital footprint analysis and field intelligence networks.",
    tag: "Missing Person",
  },
];

export function HomePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    serviceType: "general",
  });
  const createInquiry = useCreateInquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInquiry.mutateAsync(form);
      toast.success(
        "Inquiry submitted! Our team will contact you within 24 hours.",
      );
      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
        serviceType: "general",
      });
    } catch {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(11,13,16,0.97) 55%, rgba(11,13,16,0.7) 100%), url('/assets/generated/hero-detective-noir.dim_1920x900.jpg') center/cover no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">
              🕵️ Professional Detective Services
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight uppercase mb-2">
              Unveiling Truth.
            </h1>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight uppercase text-primary mb-6">
              Securing Clarity.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              India's premier detective agency delivering discreet,
              legally-compliant investigative services. Every case handled with
              precision, confidentiality, and professional integrity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-accent font-bold px-7 py-3 uppercase tracking-wider text-sm"
                  data-ocid="home.primary_button"
                >
                  Explore Services
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-7 py-3 uppercase tracking-wider text-sm"
                  data-ocid="home.secondary_button"
                >
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { value: "500+", label: "Cases Solved" },
                { value: "15+", label: "Years Experience" },
                { value: "98%", label: "Success Rate" },
                { value: "24/7", label: "Available" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-primary font-display">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
              What We Do
            </p>
            <h2 className="section-title text-3xl">
              Our Investigative Services
            </h2>
            <div className="mt-3 w-16 h-0.5 bg-primary mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="detective-card text-center hover:border-primary/40 hover:shadow-glow transition-all duration-300 group h-full">
                  <CardContent className="pt-8 pb-6 px-5 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                      <span className="text-2xl">{svc.emoji}</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2 uppercase tracking-wide">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {svc.desc}
                    </p>
                    <Link
                      to="/services"
                      className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
              Track Record
            </p>
            <h2 className="section-title text-3xl">Case Studies</h2>
            <div className="mt-3 w-16 h-0.5 bg-primary mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={cs.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="detective-card overflow-hidden group hover:border-primary/40 hover:shadow-glow transition-all duration-300">
                  <div className="h-44 overflow-hidden">
                    <img
                      src={cs.img}
                      alt={cs.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {cs.tag}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold text-foreground">
                      {cs.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {cs.excerpt}
                    </p>
                    <Link
                      to="/contact"
                      className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
                    >
                      View Case <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-20 bg-background" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                Get In Touch
              </p>
              <h2 className="section-title text-3xl mb-2">
                Request a Consultation
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                All inquiries are handled with strict confidentiality. Our team
                will respond within 24 hours.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="home.panel"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Full Name
                    </p>
                    <Input
                      className="input-detective"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                      data-ocid="home.input"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Phone Number
                    </p>
                    <Input
                      className="input-detective"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                      data-ocid="home.input"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Email Address
                  </p>
                  <Input
                    className="input-detective"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    data-ocid="home.input"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Service Type
                  </p>
                  <Select
                    value={form.serviceType}
                    onValueChange={(v) => setForm({ ...form, serviceType: v })}
                  >
                    <SelectTrigger
                      className="input-detective"
                      data-ocid="home.select"
                    >
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="background">
                        Background Verification
                      </SelectItem>
                      <SelectItem value="personal">
                        Personal Investigation
                      </SelectItem>
                      <SelectItem value="corporate">
                        Corporate Investigation
                      </SelectItem>
                      <SelectItem value="missing">Missing Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Message
                  </p>
                  <Textarea
                    className="input-detective resize-none"
                    placeholder="Briefly describe your situation (kept strictly confidential)"
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                    data-ocid="home.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createInquiry.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-accent font-bold uppercase tracking-wider"
                  data-ocid="home.submit_button"
                >
                  {createInquiry.isPending ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg overflow-hidden border border-border min-h-[400px] bg-card flex flex-col"
            >
              <div className="flex-1">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.672!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjAiTiA3N8KwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin"
                  className="w-full h-full min-h-[350px] border-0 grayscale opacity-70"
                  loading="lazy"
                />
              </div>
              <div className="bg-card p-4 border-t border-border">
                <p className="text-sm font-bold text-foreground">
                  Master Detective Agency
                </p>
                <p className="text-xs text-muted-foreground">
                  221B Baker Street, New Delhi — 110001
                </p>
                <p className="text-xs text-primary font-semibold mt-1">
                  Open Mon–Sat: 9AM – 7PM
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
