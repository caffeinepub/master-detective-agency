import { Award, Eye, Lock, Shield } from "lucide-react";
import { motion } from "motion/react";

const teamStats = [
  { value: "15+", label: "Years Experience" },
  { value: "500+", label: "Cases Resolved" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "50+", label: "Certified Agents" },
];

const values = [
  {
    icon: Shield,
    title: "Integrity",
    desc: "Every investigation is conducted with strict adherence to legal and ethical standards.",
  },
  {
    icon: Eye,
    title: "Precision",
    desc: "Meticulous attention to detail ensures no evidence is overlooked or misinterpreted.",
  },
  {
    icon: Lock,
    title: "Confidentiality",
    desc: "All client information and case details are protected with the highest security protocols.",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "We deliver results that stand up to legal scrutiny and exceed client expectations.",
  },
];

export function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section
        className="py-24 text-center relative"
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
            Est. 2009
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase text-foreground">
            About Our Agency
          </h1>
          <div className="mt-4 w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">
                Our Story
              </p>
              <h2 className="font-display text-3xl font-bold uppercase text-foreground mb-6">
                Founded on Truth. Built on Trust.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Master Detective Agency was founded in 2009 by former law
                enforcement veterans and intelligence analysts who believed that
                private citizens and corporations deserved access to the same
                caliber of investigative expertise available to government
                agencies.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Over 15 years, we have grown into India's most trusted
                investigative firm, with a team of 50+ certified detectives,
                forensic analysts, cyber intelligence specialists, and legal
                advisors operating across all major cities.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our investigations have led to successful prosecutions, saved
                companies millions in fraud losses, reunited families with
                missing loved ones, and protected individuals from harassment
                and identity theft.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 gap-6"
            >
              {teamStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-lg p-6 text-center"
                >
                  <p className="font-display text-4xl font-extrabold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="section-title text-3xl">Our Core Values</h2>
            <div className="mt-3 w-16 h-0.5 bg-primary mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
