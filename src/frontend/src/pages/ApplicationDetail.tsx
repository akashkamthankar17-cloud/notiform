import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, FileText } from "lucide-react";
import React from "react";
import StatusChip from "../components/applications/StatusChip";
import { useAppContext } from "../contexts/AppContext";
import MainLayout from "../layouts/MainLayout";
import { formatDate } from "../utils/dateUtils";

export default function ApplicationDetail() {
  const { appId } = useParams({ from: "/app/applications/$appId" });
  const { applications, forms } = useAppContext();
  const navigate = useNavigate();

  const app = applications.find((a) => a.id === appId);
  const form = app ? forms.find((f) => f.id === app.formId) : null;

  if (!app) {
    return (
      <MainLayout title="Application Detail">
        <div className="flex flex-col items-center py-16 px-4">
          <p className="text-gray-500">Application not found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate({ to: "/applications" })}
          >
            Back to Applications
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Application Detail">
      <div className="px-4 py-5 space-y-5">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate({ to: "/applications" })}
          className="flex items-center gap-1.5 text-nf-primary text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </button>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h1 className="font-display font-bold text-gray-900 text-base leading-snug">
                {app.formTitle}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {app.organizationName}
              </p>
            </div>
            <StatusChip status={app.status} size="md" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Applied On</p>
                <p className="text-sm font-medium text-gray-700">
                  {formatDate(app.appliedAt)}
                </p>
              </div>
            </div>
            {app.updatedAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Last Updated</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(app.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form data */}
        {Object.keys(app.formData).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
            <h2 className="font-display font-bold text-gray-900 text-sm mb-3">
              Submitted Information
            </h2>
            <div className="space-y-2">
              {Object.entries(app.formData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attached documents */}
        {app.attachedDocuments.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
            <h2 className="font-display font-bold text-gray-900 text-sm mb-3">
              Attached Documents
            </h2>
            <div className="space-y-2">
              {app.attachedDocuments.map((doc) => (
                <div key={doc} className="flex items-center gap-2.5 py-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-nf-primary" />
                  </div>
                  <span className="text-sm text-gray-700 capitalize">
                    {doc.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form details */}
        {form && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
            <h2 className="font-display font-bold text-gray-900 text-sm mb-2">
              About This Form
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {form.eligibilitySummary}
            </p>
            {form.lastDate && (
              <p className="text-xs text-gray-400 mt-2">
                Last date: {formatDate(form.lastDate)}
              </p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
