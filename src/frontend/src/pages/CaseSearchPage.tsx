import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Case } from "../backend.d";
import { CaseStatusBadge, PriorityBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";

export function CaseSearchPage() {
  const [caseIdInput, setCaseIdInput] = useState("");
  const [result, setResult] = useState<Case | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { actor } = useActor();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !caseIdInput.trim()) return;
    setLoading(true);
    try {
      const id = BigInt(caseIdInput.trim());
      const found = await actor.getCaseById(id);
      setResult(found);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
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
            🔎 Case Lookup
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase text-foreground">
            Case Search
          </h1>
          <div className="mt-4 w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-xl mx-auto px-4">
          <form
            onSubmit={handleSearch}
            className="flex gap-3 mb-8"
            data-ocid="case_search.panel"
          >
            <Input
              placeholder="Enter Case ID (e.g. 1001)"
              value={caseIdInput}
              onChange={(e) => setCaseIdInput(e.target.value)}
              className="input-detective flex-1"
              data-ocid="case_search.input"
            />
            <Button
              type="submit"
              disabled={loading || !caseIdInput.trim()}
              className="bg-primary text-primary-foreground hover:bg-accent font-bold uppercase tracking-wider"
              data-ocid="case_search.primary_button"
            >
              {loading ? (
                <Search className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </form>

          {result === null && (
            <div
              className="text-center py-12 bg-card border border-border rounded-lg"
              data-ocid="case_search.empty_state"
            >
              <p className="text-4xl mb-3">🔄</p>
              <p className="text-foreground font-bold">No case found</p>
              <p className="text-muted-foreground text-sm mt-1">
                Please verify your Case ID and try again.
              </p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="detective-card">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">
                        Case #{result.id.toString()}
                      </p>
                      <h2 className="text-lg font-bold text-foreground mt-1">
                        {result.title}
                      </h2>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <CaseStatusBadge status={result.status} />
                      <PriorityBadge priority={result.priority} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-muted/30 rounded p-2">
                      <p className="text-muted-foreground">Created</p>
                      <p className="text-foreground font-semibold">
                        {new Date(
                          Number(result.createdAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded p-2">
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="text-foreground font-semibold">
                        {new Date(
                          Number(result.updatedAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
