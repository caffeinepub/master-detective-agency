import { motion } from "motion/react";

export function PrivacyPage() {
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
          <h1 className="font-display text-5xl font-extrabold uppercase text-foreground">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm mt-3">
            Last updated: January 1, 2025
          </p>
          <div className="mt-4 w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>
      </section>
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert prose-sm max-w-none">
          <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                1. Information We Collect
              </h2>
              <p>
                Master Detective Agency collects information necessary to
                provide investigative services, including name, contact details,
                case-related information, and identification documents for KYC
                compliance. We collect only what is necessary for the legitimate
                purpose of delivering contracted services.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                2. How We Use Your Information
              </h2>
              <p>
                Information is used exclusively to: conduct requested
                investigations, communicate case progress, comply with legal
                obligations, improve service quality, and maintain records as
                required by applicable law. We do not sell, rent, or share
                personal information with third parties except as required by
                law or with explicit client consent.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                3. Data Security
              </h2>
              <p>
                All client data is encrypted in transit and at rest using
                industry-standard protocols. Access is restricted to authorized
                personnel on a need-to-know basis. We maintain comprehensive
                access logs and conduct regular security audits.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                4. Data Retention
              </h2>
              <p>
                Case files and client records are retained for 7 years as
                required by Indian law. After this period, records are securely
                destroyed unless ongoing legal proceedings require extended
                retention.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                5. Your Rights
              </h2>
              <p>
                You have the right to access your personal data, request
                corrections, request deletion (subject to legal retention
                requirements), and withdraw consent for non-essential
                processing. Contact our Data Protection Officer at
                privacy@masterdetective.in.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                6. Contact
              </h2>
              <p>
                For privacy-related inquiries: privacy@masterdetective.in | 221B
                Baker Street, New Delhi 110001.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
