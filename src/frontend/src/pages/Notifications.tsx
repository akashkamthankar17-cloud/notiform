import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import React from "react";
import NotificationCard from "../components/notifications/NotificationCard";
import { useAppContext } from "../contexts/AppContext";
import MainLayout from "../layouts/MainLayout";

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useAppContext();
  const navigate = useNavigate();

  const sorted = [...notifications].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  const handleNavigate = (formId: string) => {
    navigate({ to: "/apply/$formId", params: { formId } });
  };

  return (
    <MainLayout title="Notifications">
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display font-bold text-gray-900 text-lg">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500 mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-8 gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-600 font-semibold">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">
              We'll notify you about new forms and updates
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onRead={markAsRead}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
