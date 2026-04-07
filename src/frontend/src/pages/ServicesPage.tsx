import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    emoji: "🛡️",
    title: "Background Verification",
    subtitle: "Know Who You Trust",
    description:
      "Our comprehensive background verification service covers criminal record checks, employment history validation, educational qualification verification, financial background screening, reference checks, and identity authentication. Ideal for employers, landlords, matrimonial alliances, and personal due diligence.",
    features: [
      "Criminal & Court Record Search",
      "Employment History Verification",
      "Education & Certification Checks",
      "Financial & Credit Background",
      "Address & Identity Verification",
      "Social Media & Digital Footprint",
    ],
    turnaround: "3–7 Business Days",
  },
  {
    emoji: "🕵️",
    title: "Personal Investigation",
    subtitle: "Discreet. Precise. Conclusive.",
    description:
      "Whether you suspect infidelity, need matrimonial background checks, require surveillance of a person of interest, or need to trace an individual's whereabouts, our personal investigation unit delivers documented, legally-admissible evidence through lawful means.",
    features: [
      "Matrimonial Investigations",
      "Infidelity & Adultery Cases",
      "Covert Surveillance Operations",
      "Personal Background Screening",
      "Social Media Intelligence (OSINT)",
      "Evidence Documentation & Reporting",
    ],
    turnaround: "5–14 Business Days",
  },
  {
    emoji: "🏢",
    title: "Corporate Investigation",
    subtitle: "Protecting Business Integrity",
    description:
      "Corporate fraud, embezzlement, industrial espionage, employee misconduct, and counterintelligence threats cost businesses billions annually. Our corporate division combines forensic accounting, digital forensics, and field intelligence to protect your organization.",
    features: [
      "Employee Misconduct Investigations",
      "Fraud & Embezzlement Detection",
      "Industrial Espionage Countermeasures",
      "Due Diligence for M&A",
      "Intellectual Property Protection",
      "Whistleblower & Witness Protection",
    ],
    turnaround: "Custom Timeline",
  },
  {
    emoji: "👤",
    title: "Missing Person Tracking",
    subtitle: "Every Person Deserves to be Found",
    description:
      "Our missing persons unit combines traditional field investigation with advanced digital tracking, OSINT analysis, nationwide informant networks, and coordination with law enforcement to maximize the chances of locating missing individuals quickly and safely.",
    features: [
      "Runaway Teens & Adults",
      "Estranged Family Members",
      "Debtor & Absconding Party Tracing",
      "Digital & Social Media Tracking",
      "Cross-State Field Operations",
      "Coordination with Authorities",
    ],
    turnaround: "Immediate Response",
  },
];

export function ServicesPage() {
  return (
    <main className="min-h-screen">
      <section
        className="py-24 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.006 220) 0%, oklch(0.16 0.02 25) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase text-foreground">
            Our Services
          </h1>
          <div className="mt-4 w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-card border border-border rounded-lg p-8"
            >
              <div>
                <div className="text-4xl mb-4">{svc.emoji}</div>
                <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                  {svc.subtitle}
                </p>
                <h2 className="font-display text-2xl font-bold uppercase text-foreground mb-4">
                  {svc.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {svc.description}
                </p>
                <p className="text-xs text-primary font-semibold">
                  ⏱ Typical Turnaround: {svc.turnaround}
                </p>
                <Link to="/contact" className="mt-6 inline-block">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-accent text-xs uppercase tracking-wider font-bold"
                    data-ocid="services.primary_button"
                  >
                    Inquire Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {svc.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
