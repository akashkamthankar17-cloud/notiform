import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ClipboardList, Grid3X3, Home, Shield, User } from "lucide-react";
import type React from "react";
import LoginButton from "../components/auth/LoginButton";
import { useAppContext } from "../contexts/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/categories", label: "Categories", icon: Grid3X3 },
  { path: "/applications", label: "My Apps", icon: ClipboardList },
  { path: "/notifications", label: "Alerts", icon: Bell },
  { path: "/profile", label: "Profile", icon: User },
];

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  const { unreadCount, userProfile } = useAppContext();
  const { identity } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAdmin = userProfile?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* App Bar */}
      <header className="gradient-primary sticky top-0 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/assets/generated/notiform-logo.dim_256x256.png"
              alt="NotiForm"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-white font-display font-bold text-lg tracking-tight">
              {title || "NotiForm"}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold hover:bg-white/30 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
            {identity ? (
              <LoginButton variant="outline" size="sm" />
            ) : (
              <LoginButton size="sm" />
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full pb-20">
        <div className="page-enter">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-2xl mx-auto flex">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive =
              path === "/" ? currentPath === "/" : currentPath.startsWith(path);
            const isNotif = path === "/notifications";

            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative ${
                  isActive
                    ? "text-nf-primary"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`}
                  />
                  {isNotif && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${isActive ? "text-nf-primary" : ""}`}
                >
                  {label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-nf-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
