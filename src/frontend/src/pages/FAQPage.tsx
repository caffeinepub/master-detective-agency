import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const faqs = [
  {
    q: "Are your investigations legally compliant?",
    a: "Absolutely. All our investigations are conducted in strict accordance with Indian law, including the Right to Privacy regulations, IT Act, and Code of Criminal Procedure. We never engage in illegal surveillance, hacking, or entrapment.",
  },
  {
    q: "How do I start an investigation?",
    a: "Simply submit an inquiry through our contact form or call us directly. A senior investigator will review your case, provide a confidential consultation, and outline a proposed investigation plan within 24 hours.",
  },
  {
    q: "How much do your services cost?",
    a: "Costs vary significantly by case complexity, scope, and duration. Background checks start from ₹2,500. Surveillance operations range from ₹15,000 to ₹1,00,000+. We provide transparent quotations with no hidden fees after the initial consultation.",
  },
  {
    q: "Is my information kept confidential?",
    a: "Confidentiality is the cornerstone of our service. All client information, case details, and investigation findings are protected under our strict non-disclosure protocols. We never share your information with third parties.",
  },
  {
    q: "How long does an investigation typically take?",
    a: "Timeline varies by case type. Background verifications typically take 3–7 business days. Personal surveillance cases range from 1–4 weeks. Corporate investigations may take 2–8 weeks depending on complexity. Missing persons cases are treated as urgent with immediate deployment.",
  },
  {
    q: "Will evidence gathered be admissible in court?",
    a: "We follow legally-admissible evidence collection protocols. All evidence is documented with timestamps, chain of custody records, and can be presented in court. Our investigators can also testify as expert witnesses when required.",
  },
  {
    q: "Do you work across India?",
    a: "Yes. We have operatives and partner networks in all major cities and states including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, and tier-2 cities. Cross-border operations in neighboring countries are available upon request.",
  },
  {
    q: "Can I track my case progress online?",
    a: "Yes. Every client receives access to our secure Client Portal where you can track case status, view investigator notes (as authorized), upload documents, and communicate directly with your assigned investigator.",
  },
];

export function FAQPage() {
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
            Have Questions?
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase text-foreground">
            FAQ
          </h1>
          <div className="mt-4 w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>
      </section>
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${faq.q.slice(0, 20)}`}
                className="bg-card border border-border rounded-lg px-4 data-[state=open]:border-primary/40"
                data-ocid={`faq.item.${i + 1}`}
              >
                <AccordionTrigger className="text-sm font-bold text-foreground hover:text-primary hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}
