import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { generateId } from "../../lib/utils";
import type {
  FormCategory,
  FormModel,
  FormSubCategory,
  VerificationStatus,
} from "../../types";

interface FormEditorProps {
  open: boolean;
  form?: FormModel | null;
  onClose: () => void;
  onSave: (form: FormModel) => void;
}

const EMPTY_FORM: Omit<FormModel, "id" | "createdAt" | "viewCount"> = {
  title: "",
  organizationName: "",
  category: "scholarship",
  subCategory: "govt",
  eligibilitySummary: "",
  lastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  applyUrl: "",
  hasInternalForm: false,
  verificationStatus: "not_verified",
  eligibilityCriteria: {},
  isActive: true,
  description: "",
  requiredDocuments: [],
};

export default function FormEditor({
  open,
  form,
  onClose,
  onSave,
}: FormEditorProps) {
  const [data, setData] = useState({ ...EMPTY_FORM });
  const [docInput, setDocInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on open change
  useEffect(() => {
    if (form) {
      setData({
        title: form.title,
        organizationName: form.organizationName,
        category: form.category,
        subCategory: form.subCategory,
        eligibilitySummary: form.eligibilitySummary,
        lastDate: form.lastDate,
        applyUrl: form.applyUrl,
        hasInternalForm: form.hasInternalForm,
        verificationStatus: form.verificationStatus,
        eligibilityCriteria: form.eligibilityCriteria,
        isActive: form.isActive,
        description: form.description,
        requiredDocuments: [...form.requiredDocuments],
      });
    } else {
      setData({ ...EMPTY_FORM });
    }
    setErrors({});
  }, [form, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.title.trim()) errs.title = "Title is required";
    if (!data.organizationName.trim())
      errs.organizationName = "Organization name is required";
    if (!data.eligibilitySummary.trim())
      errs.eligibilitySummary = "Eligibility summary is required";
    if (!data.applyUrl.trim()) errs.applyUrl = "Apply URL is required";
    if (!data.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    onSave({
      ...data,
      id: form?.id || generateId(),
      createdAt: form?.createdAt || new Date(),
      viewCount: form?.viewCount || 0,
    });
    setLoading(false);
    onClose();
  };

  const addDoc = () => {
    if (docInput.trim() && !data.requiredDocuments.includes(docInput.trim())) {
      setData((p) => ({
        ...p,
        requiredDocuments: [...p.requiredDocuments, docInput.trim()],
      }));
      setDocInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {form ? "Edit Form" : "Create New Form"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Title *</Label>
            <Input
              value={data.title}
              onChange={(e) =>
                setData((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Form title"
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label>Organization Name *</Label>
            <Input
              value={data.organizationName}
              onChange={(e) =>
                setData((p) => ({ ...p, organizationName: e.target.value }))
              }
              placeholder="Organization name"
            />
            {errors.organizationName && (
              <p className="text-xs text-red-500">{errors.organizationName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={data.category}
              onValueChange={(v) =>
                setData((p) => ({ ...p, category: v as FormCategory }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["scholarship", "job", "admission", "loan", "scheme"].map(
                  (c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Sub-Category</Label>
            <Select
              value={data.subCategory}
              onValueChange={(v) =>
                setData((p) => ({ ...p, subCategory: v as FormSubCategory }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="govt">Government</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Verification Status</Label>
            <Select
              value={data.verificationStatus}
              onValueChange={(v) =>
                setData((p) => ({
                  ...p,
                  verificationStatus: v as VerificationStatus,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified_govt">
                  Verified Government
                </SelectItem>
                <SelectItem value="verified_private">
                  Verified Private
                </SelectItem>
                <SelectItem value="not_verified">Not Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Last Date</Label>
            <Input
              type="date"
              value={data.lastDate.toISOString().split("T")[0]}
              onChange={(e) =>
                setData((p) => ({ ...p, lastDate: new Date(e.target.value) }))
              }
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label>Apply URL *</Label>
            <Input
              value={data.applyUrl}
              onChange={(e) =>
                setData((p) => ({ ...p, applyUrl: e.target.value }))
              }
              placeholder="https://..."
            />
            {errors.applyUrl && (
              <p className="text-xs text-red-500">{errors.applyUrl}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label>Eligibility Summary *</Label>
            <Textarea
              value={data.eligibilitySummary}
              onChange={(e) =>
                setData((p) => ({ ...p, eligibilitySummary: e.target.value }))
              }
              rows={2}
            />
            {errors.eligibilitySummary && (
              <p className="text-xs text-red-500">
                {errors.eligibilitySummary}
              </p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label>Description *</Label>
            <Textarea
              value={data.description}
              onChange={(e) =>
                setData((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Eligibility criteria */}
          <div className="sm:col-span-2">
            <Label className="text-sm font-semibold mb-2 block">
              Eligibility Criteria
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Min Age</Label>
                <Input
                  type="number"
                  placeholder="e.g. 18"
                  value={data.eligibilityCriteria.minAge ?? ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      eligibilityCriteria: {
                        ...p.eligibilityCriteria,
                        minAge: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Age</Label>
                <Input
                  type="number"
                  placeholder="e.g. 35"
                  value={data.eligibilityCriteria.maxAge ?? ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      eligibilityCriteria: {
                        ...p.eligibilityCriteria,
                        maxAge: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Income (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 300000"
                  value={data.eligibilityCriteria.maxIncome ?? ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      eligibilityCriteria: {
                        ...p.eligibilityCriteria,
                        maxIncome: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min Education</Label>
                <Select
                  value={data.eligibilityCriteria.minEducation ?? ""}
                  onValueChange={(v) =>
                    setData((p) => ({
                      ...p,
                      eligibilityCriteria: {
                        ...p.eligibilityCriteria,
                        minEducation: v as any,
                      },
                    }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "10th",
                      "12th",
                      "Diploma",
                      "Graduate",
                      "Postgraduate",
                      "Doctorate",
                    ].map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Required documents */}
          <div className="sm:col-span-2 space-y-2">
            <Label>Required Documents</Label>
            <div className="flex gap-2">
              <Input
                value={docInput}
                onChange={(e) => setDocInput(e.target.value)}
                placeholder="e.g. aadhaar, marksheet"
                onKeyDown={(e) => e.key === "Enter" && addDoc()}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addDoc}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.requiredDocuments.map((doc) => (
                <span
                  key={doc}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                >
                  {doc}
                  <button
                    type="button"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        requiredDocuments: p.requiredDocuments.filter(
                          (d) => d !== doc,
                        ),
                      }))
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <Checkbox
              id="hasInternalForm"
              checked={data.hasInternalForm}
              onCheckedChange={(v) =>
                setData((p) => ({ ...p, hasInternalForm: !!v }))
              }
            />
            <Label htmlFor="hasInternalForm" className="cursor-pointer">
              Has internal application form
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="gradient-primary text-white border-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Form"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
