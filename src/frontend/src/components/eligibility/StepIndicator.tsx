import { Check } from "lucide-react";
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  isCompleted
                    ? "bg-nf-primary border-nf-primary text-white"
                    : isCurrent
                      ? "bg-white border-nf-primary text-nf-primary"
                      : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isCurrent
                    ? "text-nf-primary"
                    : isCompleted
                      ? "text-gray-600"
                      : "text-gray-400"
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  isCompleted ? "bg-nf-primary" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
