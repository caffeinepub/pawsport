import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { DashboardLayout } from "./pages/DashboardLayout";
import { HealthTimelinePage } from "./pages/HealthTimelinePage";
import { LandingPage } from "./pages/LandingPage";
import { MyPetsPage } from "./pages/MyPetsPage";
import { RemindersPage } from "./pages/RemindersPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SitterPublicPage } from "./pages/SitterPublicPage";
import { SitterSharePage } from "./pages/SitterSharePage";
import { SymptomAnalyzerPage } from "./pages/SymptomAnalyzerPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const sitterPublicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/share/$token",
  component: SitterPublicPage,
});

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: DashboardLayout,
});

const myPetsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: MyPetsPage,
});

const timelineRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/timeline",
  component: HealthTimelinePage,
});

const symptomsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/symptoms",
  component: SymptomAnalyzerPage,
});

const remindersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/reminders",
  component: RemindersPage,
});

const shareRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/share",
  component: SitterSharePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/settings",
  component: SettingsPage,
});

export const routeTree = rootRoute.addChildren([
  landingRoute,
  sitterPublicRoute,
  dashboardLayoutRoute.addChildren([
    myPetsRoute,
    timelineRoute,
    symptomsRoute,
    remindersRoute,
    shareRoute,
    settingsRoute,
  ]),
]);
