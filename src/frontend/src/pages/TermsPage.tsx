import { motion } from "motion/react";

export function TermsPage() {
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
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-sm mt-3">
            Last updated: January 1, 2025
          </p>
          <div className="mt-4 w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>
      </section>
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By engaging Master Detective Agency's services, you agree to
                these terms in full. Services are provided exclusively for
                lawful purposes. Any unlawful use is strictly prohibited and
                will result in immediate termination of services and reporting
                to authorities.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                2. Legal Use Only
              </h2>
              <p>
                Our services are intended solely for legal investigative
                purposes. Clients warrant that they are engaging our services
                for lawful reasons. Investigations targeting individuals for
                harassment, stalking, or illegal purposes are strictly
                prohibited and will be reported to law enforcement.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                3. Fees & Payment
              </h2>
              <p>
                Service fees are agreed upon prior to engagement commencement. A
                retainer is required before investigation begins. Additional
                costs incurred during investigation (travel, third-party fees)
                will be communicated in advance. No refunds for work already
                completed.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                4. Limitation of Liability
              </h2>
              <p>
                Master Detective Agency's liability is limited to the fees paid
                for the specific service. We do not guarantee specific
                investigation outcomes, though we commit to professional
                best-effort service delivery within legal boundaries.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                5. Confidentiality
              </h2>
              <p>
                Both parties agree to maintain strict confidentiality regarding
                case details. Clients agree not to disclose investigation
                methodologies, informant identities, or operational procedures
                to third parties.
              </p>
            </div>
            <div>
              <h2 className="text-foreground font-bold text-lg uppercase tracking-wide mb-3">
                6. Legal Disclaimer
              </h2>
              <p className="font-semibold text-foreground">
                This platform is intended for legal investigative services only.
                Any misuse, unauthorized tracking, or illegal activity is
                strictly prohibited. All data is handled under applicable laws
                including the Information Technology Act 2000, Indian Penal
                Code, and applicable privacy regulations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
