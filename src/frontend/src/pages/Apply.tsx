import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  FileText,
  Loader2,
  Paperclip,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import DocumentCard from "../components/documents/DocumentCard";
import VerificationBadge from "../components/forms/VerificationBadge";
import { useAppContext } from "../contexts/AppContext";
import MainLayout from "../layouts/MainLayout";
import { generateId } from "../lib/utils";
import {
  formatDate,
  getCountdownColor,
  getCountdownLabel,
} from "../utils/dateUtils";

export default function Apply() {
  const { formId } = useParams({ from: "/app/apply/$formId" });
  const { forms, userProfile, documents, addApplication, applications } =
    useAppContext();
  const navigate = useNavigate();

  const form = forms.find((f) => f.id === formId);
  const existingApp = applications.find((a) => a.formId === formId);

  const [formData, setFormData] = useState<Record<string, string>>({
    fullName: userProfile?.fullName || "",
    age: userProfile ? String(userProfile.age) : "",
    gender: userProfile?.gender || "",
    state: userProfile?.state || "",
    category: userProfile?.category || "",
    educationLevel: userProfile?.educationLevel || "",
    annualIncome: userProfile ? String(userProfile.annualIncome) : "",
  });
  const [selectedDocs, setSelectedDocs] = useState<string[]>(
    existingApp?.attachedDocuments || [],
  );
  const [showDocPicker, setShowDocPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(
    existingApp?.status === "applied" || existingApp?.status === "under_review",
  );

  if (!form) {
    return (
      <MainLayout title="Apply">
        <div className="flex flex-col items-center py-16 px-4">
          <p className="text-gray-500">Form not found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate({ to: "/" })}
          >
            Go Home
          </Button>
        </div>
      </MainLayout>
    );
  }

  const countdownLabel = getCountdownLabel(form.lastDate);
  const countdownColor = getCountdownColor(form.lastDate);

  const handleExternalApply = () => {
    window.open(form.applyUrl, "_blank", "noopener,noreferrer");
    if (!existingApp) {
      addApplication({
        id: generateId(),
        userId: userProfile?.uid || "anonymous",
        formId: form.id,
        formTitle: form.title,
        organizationName: form.organizationName,
        status: "applied",
        formData: {},
        attachedDocuments: [],
        appliedAt: new Date(),
      });
      setSubmitted(true);
      toast.success("Application recorded!");
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!isDraft && !formData.fullName.trim()) {
      toast.error("Please fill in your full name");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    addApplication({
      id: existingApp?.id || generateId(),
      userId: userProfile?.uid || "anonymous",
      formId: form.id,
      formTitle: form.title,
      organizationName: form.organizationName,
      status: isDraft ? "draft" : "applied",
      formData,
      attachedDocuments: selectedDocs,
      appliedAt: existingApp?.appliedAt || new Date(),
      updatedAt: new Date(),
    });
    setLoading(false);
    if (!isDraft) {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } else {
      toast.success("Draft saved!");
    }
  };

  const toggleDoc = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((d) => d !== docId) : [...prev, docId],
    );
  };

  return (
    <MainLayout title="Apply">
      <div className="px-4 py-5 space-y-5">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1.5 text-nf-primary text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Form header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h1 className="font-display font-bold text-gray-900 text-base leading-snug flex-1">
              {form.title}
            </h1>
            <VerificationBadge status={form.verificationStatus} />
          </div>
          <p className="text-sm text-gray-500 mb-3">{form.organizationName}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {form.eligibilitySummary}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-400">
              Last date: {formatDate(form.lastDate)}
            </span>
            <span className={`font-semibold ${countdownColor}`}>
              · {countdownLabel}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
          <h2 className="font-display font-bold text-gray-900 text-sm mb-2">
            About
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {form.description}
          </p>
          {form.requiredDocuments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs font-semibold text-gray-700 mb-1.5">
                Required Documents:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {form.requiredDocuments.map((doc) => (
                  <span
                    key={doc}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs capitalize"
                  >
                    {doc.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submitted state */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800 text-sm">
                Application Submitted!
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                Track your status in My Applications
              </p>
            </div>
          </div>
        )}

        {/* External apply mode */}
        {!form.hasInternalForm && !submitted && (
          <div className="space-y-3">
            <Button
              onClick={handleExternalApply}
              className="w-full gradient-primary text-white border-0 h-12 text-base font-semibold"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Apply on Official Website
            </Button>
            <p className="text-xs text-gray-400 text-center">
              You'll be redirected to {form.applyUrl}
            </p>
          </div>
        )}

        {/* Internal form mode */}
        {form.hasInternalForm && !submitted && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 space-y-4">
            <h2 className="font-display font-bold text-gray-900 text-sm">
              Application Form
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  key: "fullName",
                  label: "Full Name",
                  type: "text",
                  colSpan: true,
                },
                { key: "age", label: "Age", type: "number", colSpan: false },
                {
                  key: "gender",
                  label: "Gender",
                  type: "text",
                  colSpan: false,
                },
                { key: "state", label: "State", type: "text", colSpan: false },
                {
                  key: "category",
                  label: "Category",
                  type: "text",
                  colSpan: false,
                },
                {
                  key: "educationLevel",
                  label: "Education",
                  type: "text",
                  colSpan: false,
                },
              ].map((field) => (
                <div
                  key={field.key}
                  className={`${field.colSpan ? "col-span-2" : ""} space-y-1`}
                >
                  <Label className="text-xs">{field.label}</Label>
                  <Input
                    type={field.type}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="h-9 text-sm"
                  />
                </div>
              ))}
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Annual Income (₹)</Label>
                <Input
                  type="number"
                  value={formData.annualIncome || ""}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, annualIncome: e.target.value }))
                  }
                  className="h-9 text-sm"
                />
              </div>
            </div>

            {/* Document attachment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-semibold">
                  Attached Documents ({selectedDocs.length})
                </Label>
                <button
                  type="button"
                  onClick={() => setShowDocPicker(true)}
                  className="flex items-center gap-1 text-xs text-nf-primary font-semibold"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Attach from Vault
                </button>
              </div>
              {selectedDocs.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedDocs.map((docId) => {
                    const doc = documents.find((d) => d.id === docId);
                    return doc ? (
                      <span
                        key={docId}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        <FileText className="w-3 h-3" />
                        {doc.fileName}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="flex-1"
              >
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="flex-1 gradient-primary text-white border-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Document picker dialog */}
      <Dialog open={showDocPicker} onOpenChange={setShowDocPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Select Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No documents in vault</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowDocPicker(false);
                    navigate({ to: "/documents" });
                  }}
                  className="text-nf-primary text-sm font-semibold mt-2"
                >
                  Upload Documents
                </button>
              </div>
            ) : (
              documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={() => {}}
                  selectable
                  selected={selectedDocs.includes(doc.id)}
                  onSelect={toggleDoc}
                />
              ))
            )}
          </div>
          <Button
            onClick={() => setShowDocPicker(false)}
            className="w-full gradient-primary text-white border-0"
          >
            Done ({selectedDocs.length} selected)
          </Button>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
