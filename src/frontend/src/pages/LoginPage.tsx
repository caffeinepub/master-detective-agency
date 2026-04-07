import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerRole, useIsAdmin } from "../hooks/useQueries";

export function LoginPage() {
  const { login, isLoggingIn, isLoginSuccess, identity } =
    useInternetIdentity();
  const { data: isAdmin, isFetching: adminFetching } = useIsAdmin();
  const { data: role, isFetching: roleFetching } = useCallerRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) return;
    if (adminFetching || roleFetching) return;
    if (isAdmin) {
      navigate({ to: "/admin" });
    } else if (role === "user") {
      navigate({ to: "/client-portal" });
    } else {
      navigate({ to: "/client-portal" });
    }
  }, [identity, isAdmin, role, adminFetching, roleFetching, navigate]);

  const waiting =
    isLoggingIn || (isLoginSuccess && (adminFetching || roleFetching));

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-card border border-border rounded-lg p-8 shadow-card text-center">
          <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold uppercase text-foreground mb-2">
            Client Login
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sign in securely with Internet Identity to access the Master
            Detective client portal.
          </p>
          <Button
            onClick={login}
            disabled={waiting}
            className="w-full bg-primary text-primary-foreground hover:bg-accent font-bold uppercase tracking-wider py-3"
            data-ocid="login.primary_button"
          >
            {waiting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                Authenticating...
              </>
            ) : (
              <>🔑 Sign In with Internet Identity</>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-6">
            Your data is secured with decentralized identity. No passwords
            stored.
          </p>
        </div>
      </motion.div>
    </main>
  );
}

export function AdminLoginPage() {
  return <LoginPage />;
}
