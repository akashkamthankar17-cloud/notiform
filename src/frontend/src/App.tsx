import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React, { useState, useEffect } from "react";
import ProfileSetupModal from "./components/auth/ProfileSetupModal";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import { generateId } from "./lib/utils";
import ApplicationDetail from "./pages/ApplicationDetail";
import Apply from "./pages/Apply";
import Categories from "./pages/Categories";
import DocumentVault from "./pages/DocumentVault";
import EligibilityChecker from "./pages/EligibilityChecker";
import Home from "./pages/Home";
import MyApplications from "./pages/MyApplications";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import type { UserProfile } from "./types";

// Root layout component
function RootLayout() {
  return <Outlet />;
}

// App shell that handles auth and profile setup
function AppShell() {
  const { identity, isInitializing } = useInternetIdentity();
  const { userProfile, setUserProfile } = useAppContext();
  const { data: isAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !isInitializing && !userProfile;

  const handleProfileComplete = (
    profileData: Omit<UserProfile, "uid" | "role" | "createdAt">,
  ) => {
    const uid = identity?.getPrincipal().toString() || generateId();
    setUserProfile({
      ...profileData,
      uid,
      role: isAdmin ? "admin" : "user",
      createdAt: new Date(),
    });
  };

  return (
    <>
      <Outlet />
      <ProfileSetupModal
        open={showProfileSetup}
        onComplete={handleProfileComplete}
      />
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({ component: RootLayout });

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AppShell,
});

const homeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/",
  component: Home,
});

const categoriesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/categories",
  component: Categories,
});

const applicationsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/applications",
  component: MyApplications,
});

const applicationDetailRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/applications/$appId",
  component: ApplicationDetail,
});

const applyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/apply/$formId",
  component: Apply,
});

const notificationsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/notifications",
  component: Notifications,
});

const profileRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/profile",
  component: Profile,
});

const documentsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/documents",
  component: DocumentVault,
});

const eligibilityRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/eligibility",
  component: EligibilityChecker,
});

const adminRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/admin",
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  appRoute.addChildren([
    homeRoute,
    categoriesRoute,
    applicationsRoute,
    applicationDetailRoute,
    applyRoute,
    notificationsRoute,
    profileRoute,
    documentsRoute,
    eligibilityRoute,
    adminRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </AppProvider>
    </ThemeProvider>
  );
}
