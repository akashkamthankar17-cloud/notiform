import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, ClipboardList } from "lucide-react";
import React from "react";
import StatusChip from "../components/applications/StatusChip";
import { useAppContext } from "../contexts/AppContext";
import MainLayout from "../layouts/MainLayout";
import { formatDate } from "../utils/dateUtils";

export default function MyApplications() {
  const { applications } = useAppContext();
  const navigate = useNavigate();

  const sorted = [...applications].sort(
    (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime(),
  );

  return (
    <MainLayout title="My Applications">
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-bold text-gray-900 text-lg">
            My Applications
          </h1>
          <span className="text-sm text-gray-500">
            {applications.length} total
          </span>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <img
              src="/assets/generated/empty-state-illustration.dim_400x300.png"
              alt="No applications"
              className="w-48 h-36 object-contain opacity-70 mb-4"
            />
            <p className="text-gray-600 font-semibold text-base">
              No applications yet
            </p>
            <p className="text-gray-400 text-sm mt-1 text-center">
              Browse forms and apply to track your progress here
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="mt-4 px-5 py-2 gradient-primary text-white rounded-full text-sm font-semibold"
            >
              Browse Forms
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((app) => (
              <div
                key={app.id}
                onClick={() =>
                  navigate({
                    to: "/applications/$appId",
                    params: { appId: app.id },
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    navigate({
                      to: "/applications/$appId",
                      params: { appId: app.id },
                    });
                }}
                className="bg-white rounded-xl border border-gray-100 shadow-xs p-4 cursor-pointer card-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {app.formTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {app.organizationName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusChip status={app.status} />
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Applied {formatDate(app.appliedAt)}
                    </span>
                  </div>
                  {app.updatedAt && (
                    <span className="text-xs text-gray-400">
                      · Updated {formatDate(app.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
