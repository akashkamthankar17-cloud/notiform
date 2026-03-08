import { CheckCircle, Circle, Shield } from "lucide-react";
import React from "react";
import type { VerificationStatus } from "../../types";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md";
}

const BADGE_CONFIG = {
  verified_govt: {
    label: "Govt. Verified",
    className: "badge-gold",
    icon: Shield,
  },
  verified_private: {
    label: "Verified",
    className: "badge-silver",
    icon: CheckCircle,
  },
  not_verified: {
    label: "Unverified",
    className: "badge-unverified",
    icon: Circle,
  },
};

export default function VerificationBadge({
  status,
  size = "sm",
}: VerificationBadgeProps) {
  const config = BADGE_CONFIG[status];
  const Icon = config.icon;
  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.className} ${
        isSmall ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      <Icon className={isSmall ? "w-3 h-3" : "w-4 h-4"} />
      {config.label}
    </span>
  );
}
