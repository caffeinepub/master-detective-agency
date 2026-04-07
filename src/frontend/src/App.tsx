import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense } from "react";
import { AdminLayout } from "./admin/AdminLayout";
import { AdminCaseDetail } from "./admin/pages/AdminCaseDetail";
import { AdminCases } from "./admin/pages/AdminCases";
import { AdminClients } from "./admin/pages/AdminClients";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { AdminInquiries } from "./admin/pages/AdminInquiries";
import { AdminLogs } from "./admin/pages/AdminLogs";
import { AdminMedia } from "./admin/pages/AdminMedia";
import { AdminSettings } from "./admin/pages/AdminSettings";
import { AdminStaff } from "./admin/pages/AdminStaff";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { FloatingButtons } from "./components/FloatingButtons";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AboutPage } from "./pages/AboutPage";
import { CaseSearchPage } from "./pages/CaseSearchPage";
import { ClientCaseDetail } from "./pages/ClientCaseDetail";
import { ClientPortalLayout } from "./pages/ClientPortalLayout";
import { ClientPortalPage } from "./pages/ClientPortalPage";
import { ContactPage } from "./pages/ContactPage";
import { FAQPage } from "./pages/FAQPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { AdminLoginPage, LoginPage } from "./pages/LoginPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ServicesPage } from "./pages/ServicesPage";
import { TermsPage } from "./pages/TermsPage";

// PWA registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-pulse">🕵️</div>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">
          Loading...
        </p>
      </div>
    </div>
  );
}

// ─── Route Definitions ───

// Public layout
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <AppErrorBoundary>
      <Outlet />
      <Toaster theme="dark" position="top-right" />
    </AppErrorBoundary>
  ),
});

// Public routes
const publicLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
});
const homeRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/",
  component: HomePage,
});
const aboutRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/about",
  component: AboutPage,
});
const servicesRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/services",
  component: ServicesPage,
});
const contactRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/contact",
  component: ContactPage,
});
const galleryRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/gallery",
  component: GalleryPage,
});
const faqRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/faq",
  component: FAQPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/privacy",
  component: PrivacyPage,
});
const termsRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/terms",
  component: TermsPage,
});
const caseSearchRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/case-search",
  component: CaseSearchPage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

// Admin routes
const adminLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  path: "/admin",
  component: AdminLayout,
});
const adminDashboard = createRoute({
  getParentRoute: () => adminLayout,
  path: "/",
  component: AdminDashboard,
});
const adminCases = createRoute({
  getParentRoute: () => adminLayout,
  path: "cases",
  component: AdminCases,
});
const adminCaseDetail = createRoute({
  getParentRoute: () => adminLayout,
  path: "cases/$id",
  component: AdminCaseDetail,
});
const adminClients = createRoute({
  getParentRoute: () => adminLayout,
  path: "clients",
  component: AdminClients,
});
const adminStaff = createRoute({
  getParentRoute: () => adminLayout,
  path: "staff",
  component: AdminStaff,
});
const adminInquiries = createRoute({
  getParentRoute: () => adminLayout,
  path: "inquiries",
  component: AdminInquiries,
});
const adminMedia = createRoute({
  getParentRoute: () => adminLayout,
  path: "media",
  component: AdminMedia,
});
const adminSettings = createRoute({
  getParentRoute: () => adminLayout,
  path: "settings",
  component: AdminSettings,
});
const adminLogs = createRoute({
  getParentRoute: () => adminLayout,
  path: "logs",
  component: AdminLogs,
});

// Client portal routes
const clientPortalLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "clientPortal",
  path: "/client-portal",
  component: ClientPortalLayout,
});
const clientPortalHome = createRoute({
  getParentRoute: () => clientPortalLayout,
  path: "/",
  component: ClientPortalPage,
});
const clientCaseDetail = createRoute({
  getParentRoute: () => clientPortalLayout,
  path: "case/$id",
  component: ClientCaseDetail,
});

// ─── Router ───
const routeTree = rootRoute.addChildren([
  publicLayout.addChildren([
    homeRoute,
    aboutRoute,
    servicesRoute,
    contactRoute,
    galleryRoute,
    faqRoute,
    privacyRoute,
    termsRoute,
    caseSearchRoute,
  ]),
  loginRoute,
  adminLoginRoute,
  adminLayout.addChildren([
    adminDashboard,
    adminCases,
    adminCaseDetail,
    adminClients,
    adminStaff,
    adminInquiries,
    adminMedia,
    adminSettings,
    adminLogs,
  ]),
  clientPortalLayout.addChildren([clientPortalHome, clientCaseDetail]),
]);

const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error }) => (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-xl font-bold text-foreground mb-2 uppercase">
          Page Error
        </h2>
        <p className="text-muted-foreground text-sm">{String(error)}</p>
      </div>
    </div>
  ),
  defaultPendingComponent: () => <PageLoader />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
