import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Phone, Shield, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/case-search", label: "Case Search" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, clear } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (identity) {
      clear();
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar border-b border-border/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 rounded-sm bg-primary flex items-center justify-center shadow-glow-sm">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-widest text-foreground leading-none">
                Master Detective
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Agency Platform
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link"
                data-ocid="nav.link"
                activeProps={{ className: "nav-link !text-primary" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {identity && isAdmin && (
              <Link to="/admin" data-ocid="nav.link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider"
                >
                  Admin
                </Button>
              </Link>
            )}
            {identity && (
              <Link to="/client-portal" data-ocid="nav.link">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider"
                >
                  Portal
                </Button>
              </Link>
            )}
            <Button
              onClick={handleAuthAction}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-accent text-xs uppercase tracking-wider font-bold px-4"
              data-ocid="nav.primary_button"
            >
              {identity ? "Sign Out" : "Request Consultation"}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-sidebar border-t border-border/60 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block py-2.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border/40 flex flex-col gap-2">
            {identity && isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                <Button
                  variant="ghost"
                  className="w-full text-left text-xs uppercase tracking-wider"
                >
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button
              onClick={() => {
                handleAuthAction();
                setMobileOpen(false);
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-accent text-xs uppercase tracking-wider"
              data-ocid="nav.primary_button"
            >
              {identity ? "Sign Out" : "Request Consultation"}
            </Button>
          </div>
          <div className="flex gap-2 pt-2">
            <a
              href="tel:+919876543210"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded bg-muted text-foreground text-xs font-semibold"
              data-ocid="nav.link"
            >
              <Phone className="w-3.5 h-3.5" /> Call Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
