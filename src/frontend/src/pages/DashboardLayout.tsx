import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Brain,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  LogOut,
  PawPrint,
  Settings,
  Share2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navItems = [
  { path: "/app", label: "My Pets", icon: LayoutDashboard, exact: true },
  { path: "/app/timeline", label: "Health Timeline", icon: Activity },
  { path: "/app/symptoms", label: "Symptom Analyzer", icon: Brain },
  { path: "/app/reminders", label: "Care Reminders", icon: Bell },
  { path: "/app/share", label: "Sitter Share", icon: Share2 },
  { path: "/app/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout() {
  const {
    isLoginSuccess,
    isInitializing,
    login,
    isLoggingIn,
    identity,
    clear,
  } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-24 h-3 rounded" />
        </div>
      </div>
    );
  }

  if (!isLoginSuccess) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-orange/10 flex items-center justify-center shadow-card">
            <PawPrint className="w-8 h-8 text-orange" />
          </div>
          <h1 className="text-3xl font-bold text-navy tracking-tight">
            Pawsport
          </h1>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            The AI-Powered Pet Health Tracker &amp; Digital Wallet
          </p>
        </div>
        <div className="w-full max-w-sm bg-card-bg rounded-3xl shadow-card-hover p-8 border border-warm-border">
          <h2 className="text-xl font-bold text-navy mb-1">Welcome Back</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to access your pet&apos;s digital health passport.
          </p>
          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full h-11 text-sm font-semibold bg-orange text-white hover:bg-orange/90 rounded-pill"
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Secured by Internet Identity — no passwords required
          </p>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with ❤ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="hover:text-navy transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    );
  }

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 6)}…${principal.slice(-4)}`
    : "Guest";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-50 bg-dark-btn border-b border-white/10 h-14 flex items-center no-print">
        <div className="w-full px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
            <div className="w-7 h-7 rounded-lg bg-orange flex items-center justify-center">
              <PawPrint className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold tracking-tight">
              Pawsport
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-xs hidden sm:block">
              {shortPrincipal}
            </span>
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors"
              data-ocid="nav.button"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed sidebar */}
        <aside className="w-56 flex-shrink-0 bg-card-bg border-r border-warm-border flex flex-col no-print sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? currentPath === item.path
                : currentPath.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-ocid="nav.link"
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-orange text-white shadow-warm"
                      : "text-muted-foreground hover:bg-pale-blue/50 hover:text-navy"
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-warm-border">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-navy transition-colors"
              data-ocid="nav.link"
            >
              <PawPrint className="w-3 h-3" />
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
