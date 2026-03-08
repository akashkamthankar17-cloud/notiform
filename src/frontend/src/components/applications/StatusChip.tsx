import React from "react";
import type { ApplicationStatus } from "../../types";

interface StatusChipProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: { label: "Applied", className: "status-applied" },
  under_review: { label: "Under Review", className: "status-review" },
  approved: { label: "Approved", className: "status-approved" },
  rejected: { label: "Rejected", className: "status-rejected" },
  draft: { label: "Draft", className: "status-draft" },
};

export default function StatusChip({ status, size = "sm" }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${config.className} ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      {config.label}
    </span>
  );
}
