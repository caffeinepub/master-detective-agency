import { Button } from "@/components/ui/button";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { FolderOpen, Home, LogOut, Shield } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function ClientPortalLayout() {
  const { identity, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (!identity) {
      navigate({ to: "/login" });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  const principal = identity.getPrincipal().toString();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 bg-sidebar border-b border-sidebar-border flex items-center px-4 sm:px-6 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground leading-none">
              Master Detective
            </p>
            <p className="text-[9px] text-muted-foreground uppercase">
              Client Portal
            </p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground hidden sm:block truncate max-w-[120px]">
            {principal.slice(0, 10)}...
          </p>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.link"
          >
            <Home className="w-4 h-4" />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-muted-foreground hover:text-destructive text-xs"
            data-ocid="nav.primary_button"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Sub nav */}
      <nav className="bg-sidebar border-b border-sidebar-border/50 px-4 sm:px-6">
        <div className="flex gap-4">
          <Link
            to="/client-portal"
            className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider py-3 border-b-2 transition-colors ${
              currentPath === "/client-portal"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="nav.link"
          >
            <FolderOpen className="w-3.5 h-3.5" /> My Cases
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
