import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface FormCardSkeletonProps {
  compact?: boolean;
}

export default function FormCardSkeleton({
  compact = false,
}: FormCardSkeletonProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${compact ? "w-72 flex-shrink-0" : "w-full"}`}
    >
      <div className="h-1 w-full bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-2/3" />
        {!compact && (
          <>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}
