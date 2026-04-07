import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Principal } from "@icp-sdk/core/principal";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { CaseStatusBadge, PriorityBadge } from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCasesByClient } from "../hooks/useQueries";

export function ClientPortalPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() as unknown as Principal | null;
  const { data: cases = [], isLoading } = useCasesByClient(principal);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-foreground">
          🕵️ My Cases
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Principal:{" "}
          <span className="font-mono text-xs">
            {identity?.getPrincipal().toString().slice(0, 20)}...
          </span>
        </p>
      </div>

      {isLoading ? (
        <div
          className="py-12 text-center text-muted-foreground"
          data-ocid="portal.loading_state"
        >
          Loading your cases...
        </div>
      ) : cases.length === 0 ? (
        <div
          className="py-12 text-center bg-card border border-border rounded-lg"
          data-ocid="portal.empty_state"
        >
          <p className="text-4xl mb-3">📁</p>
          <p className="text-foreground font-bold">No cases found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Your cases will appear here once registered
          </p>
          <Link to="/contact" className="inline-block mt-4">
            <Button
              className="bg-primary text-primary-foreground hover:bg-accent text-sm"
              data-ocid="portal.primary_button"
            >
              Request Investigation
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="portal.list">
          {cases.map((c, i) => (
            <motion.div
              key={c.id.toString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                className="detective-card hover:border-primary/40 transition-colors"
                data-ocid={`portal.item.${i + 1}`}
              >
                <CardContent className="pt-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-primary text-xs font-bold uppercase tracking-wider">
                          Case #{c.id.toString()}
                        </p>
                        <CaseStatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <h2 className="text-base font-bold text-foreground mt-1">
                        {c.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {c.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Opened:{" "}
                        {new Date(
                          Number(c.createdAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to="/client-portal/case/$id"
                      params={{ id: c.id.toString() }}
                      className="shrink-0"
                      data-ocid="portal.link"
                    >
                      <div className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
