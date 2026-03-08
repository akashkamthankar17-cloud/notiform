import { type Bell, Briefcase, ChevronRight, Clock, User } from "lucide-react";
import React from "react";
import type { NotificationModel, NotificationType } from "../../types";
import { timeAgo } from "../../utils/dateUtils";

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: typeof Bell; color: string; bgColor: string; label: string }
> = {
  new_form: {
    icon: Briefcase,
    color: "#1565C0",
    bgColor: "#E3F2FD",
    label: "New Form",
  },
  reminder: {
    icon: Clock,
    color: "#E65100",
    bgColor: "#FFF3E0",
    label: "Reminder",
  },
  personalized: {
    icon: User,
    color: "#2E7D32",
    bgColor: "#E8F5E9",
    label: "For You",
  },
};

interface NotificationCardProps {
  notification: NotificationModel;
  onRead: (id: string) => void;
  onNavigate?: (formId: string) => void;
}

export default function NotificationCard({
  notification,
  onRead,
  onNavigate,
}: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.isRead) onRead(notification.id);
    if (notification.formId && onNavigate) onNavigate(notification.formId);
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
        notification.isRead
          ? "bg-white border-gray-100"
          : "bg-blue-50/50 border-blue-100"
      }`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.bgColor }}
      >
        <Icon className="w-5 h-5" style={{ color: config.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: config.bgColor, color: config.color }}
              >
                {config.label}
              </span>
              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-nf-primary" />
              )}
            </div>
            <h4
              className={`text-sm font-semibold leading-snug ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}
            >
              {notification.title}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {notification.body}
            </p>
          </div>
          {notification.formId && (
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}
