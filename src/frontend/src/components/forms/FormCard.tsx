import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Calendar, ChevronRight, ExternalLink } from "lucide-react";
import type React from "react";
import { useAppContext } from "../../contexts/AppContext";
import type { FormModel } from "../../types";
import {
  formatDate,
  getCountdownColor,
  getCountdownLabel,
} from "../../utils/dateUtils";
import VerificationBadge from "./VerificationBadge";

interface FormCardProps {
  form: FormModel;
  compact?: boolean;
}

export default function FormCard({ form, compact = false }: FormCardProps) {
  const navigate = useNavigate();
  const { incrementViewCount } = useAppContext();

  const handleCardClick = () => {
    incrementViewCount(form.id);
    navigate({ to: "/apply/$formId", params: { formId: form.id } });
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementViewCount(form.id);
    if (!form.hasInternalForm) {
      window.open(form.applyUrl, "_blank", "noopener,noreferrer");
    } else {
      navigate({ to: "/apply/$formId", params: { formId: form.id } });
    }
  };

  const countdownLabel = getCountdownLabel(form.lastDate);
  const countdownColor = getCountdownColor(form.lastDate);

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCardClick();
      }}
      className={`bg-white rounded-xl border border-gray-100 shadow-card card-hover cursor-pointer overflow-hidden ${
        compact ? "w-72 flex-shrink-0" : "w-full"
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full ${
          form.verificationStatus === "verified_govt"
            ? "bg-amber-400"
            : form.verificationStatus === "verified_private"
              ? "bg-gray-400"
              : "bg-gray-200"
        }`}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
              {form.title}
            </h3>
          </div>
          <VerificationBadge status={form.verificationStatus} size="sm" />
        </div>

        {/* Organization */}
        <div className="flex items-center gap-1.5 mb-2">
          <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 truncate">
            {form.organizationName}
          </span>
        </div>

        {/* Eligibility */}
        {!compact && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {form.eligibilitySummary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <div>
              <span className="text-xs text-gray-400">
                {formatDate(form.lastDate)}
              </span>
              <span
                className={`ml-1.5 text-xs font-semibold ${countdownColor}`}
              >
                · {countdownLabel}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleApply}
            className="h-7 px-3 text-xs gradient-primary text-white border-0 hover:opacity-90"
          >
            {form.hasInternalForm ? (
              "Apply"
            ) : (
              <>
                <ExternalLink className="w-3 h-3 mr-1" />
                Apply
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
