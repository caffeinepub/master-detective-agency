import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateInquiry } from "../hooks/useQueries";

export function ContactPage() {
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
      toast.success("Inquiry submitted successfully!");
      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
        serviceType: "general",
      });
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

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
            Reach Out
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase text-foreground">
            Contact Us
          </h1>
          <div className="mt-4 w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-2xl font-bold uppercase text-foreground mb-6">
                Send an Inquiry
              </h2>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="contact.panel"
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
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Phone
                    </p>
                    <Input
                      className="input-detective"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                      data-ocid="contact.input"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Email
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
                    data-ocid="contact.input"
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
                      data-ocid="contact.select"
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
                    placeholder="Describe your case..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                    data-ocid="contact.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createInquiry.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-accent font-bold uppercase tracking-wider"
                  data-ocid="contact.submit_button"
                >
                  {createInquiry.isPending ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="font-display text-2xl font-bold uppercase text-foreground mb-6">
                Our Location
              </h2>
              <div className="rounded-lg overflow-hidden border border-border h-64">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.672!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjAiTiA3N8KwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1"
                  className="w-full h-full border-0 grayscale opacity-70"
                  loading="lazy"
                />
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    label: "+91 98765 43210",
                    sub: "Mon–Sat 9AM–7PM",
                  },
                  {
                    icon: Mail,
                    label: "info@masterdetective.in",
                    sub: "24hr Response",
                  },
                  {
                    icon: MapPin,
                    label: "221B Baker Street, New Delhi 110001",
                    sub: "Head Office",
                  },
                  {
                    icon: Clock,
                    label: "Mon–Saturday: 9:00 AM – 7:00 PM",
                    sub: "Emergency: 24/7",
                  },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 bg-card border border-border rounded-lg p-4"
                  >
                    <div className="w-9 h-9 rounded-sm bg-primary/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
