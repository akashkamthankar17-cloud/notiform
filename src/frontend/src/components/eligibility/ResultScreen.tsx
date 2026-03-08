import { Button } from "@/components/ui/button";
import { AlertCircle, Check, CheckCircle, X, XCircle } from "lucide-react";
import React from "react";
import type { EligibilityResult } from "../../types";

interface ResultScreenProps {
  result: EligibilityResult;
  formTitle: string;
  onReset: () => void;
  onApply?: () => void;
}

const RESULT_CONFIG = {
  eligible: {
    icon: CheckCircle,
    color: "#4CAF50",
    bgColor: "#E8F5E9",
    label: "Eligible",
    message: "Great news! You meet all the eligibility criteria for this form.",
  },
  not_eligible: {
    icon: XCircle,
    color: "#F44336",
    bgColor: "#FFEBEE",
    label: "Not Eligible",
    message:
      "Unfortunately, you do not meet the eligibility criteria for this form.",
  },
  partially_eligible: {
    icon: AlertCircle,
    color: "#FF9800",
    bgColor: "#FFF3E0",
    label: "Partially Eligible",
    message: "You meet some but not all eligibility criteria for this form.",
  },
};

export default function ResultScreen({
  result,
  formTitle,
  onReset,
  onApply,
}: ResultScreenProps) {
  const config = RESULT_CONFIG[result.status];
  const Icon = config.icon;

  return (
    <div className="text-center space-y-6 page-enter">
      {/* Result indicator */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon className="w-12 h-12" style={{ color: config.color }} />
        </div>
        <div>
          <h2
            className="text-2xl font-display font-bold"
            style={{ color: config.color }}
          >
            {config.label}
          </h2>
          <p className="text-gray-600 mt-1 text-sm">{config.message}</p>
        </div>
      </div>

      {/* Form title */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">Checked for</p>
        <p className="font-semibold text-gray-800 text-sm">{formTitle}</p>
      </div>

      {/* Criteria breakdown */}
      <div className="text-left space-y-3">
        {result.matchedCriteria.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Criteria Met (
              {result.matchedCriteria.length})
            </h4>
            <ul className="space-y-1.5">
              {result.matchedCriteria.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-green-600" />
                  </div>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.missedCriteria.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1.5">
              <X className="w-4 h-4" /> Criteria Not Met (
              {result.missedCriteria.length})
            </h4>
            <ul className="space-y-1.5">
              {result.missedCriteria.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-2.5 h-2.5 text-red-600" />
                  </div>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset} className="flex-1">
          Check Another
        </Button>
        {result.status !== "not_eligible" && onApply && (
          <Button
            onClick={onApply}
            className="flex-1 gradient-primary text-white border-0"
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
}
