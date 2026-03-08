import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { INDIAN_STATES, INTERESTS } from "../../data/mockData";
import type {
  EducationLevel,
  Gender,
  UserCategory,
  UserProfile,
} from "../../types";

interface EditProfileFormProps {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export default function EditProfileForm({
  profile,
  onSave,
  onCancel,
}: EditProfileFormProps) {
  const [form, setForm] = useState({
    fullName: profile.fullName,
    age: String(profile.age),
    gender: profile.gender,
    state: profile.state,
    category: profile.category,
    educationLevel: profile.educationLevel,
    annualIncome: String(profile.annualIncome),
    interests: [...profile.interests],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (
      !form.age ||
      Number.isNaN(Number(form.age)) ||
      Number(form.age) < 10 ||
      Number(form.age) > 100
    )
      errs.age = "Valid age (10–100) required";
    if (!form.state) errs.state = "State is required";
    if (
      !form.annualIncome ||
      Number.isNaN(Number(form.annualIncome)) ||
      Number(form.annualIncome) < 0
    )
      errs.annualIncome = "Valid income required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave({
      fullName: form.fullName.trim(),
      age: Number(form.age),
      gender: form.gender,
      state: form.state,
      category: form.category,
      educationLevel: form.educationLevel,
      annualIncome: Number(form.annualIncome),
      interests: form.interests,
    });
    toast.success("Profile updated successfully!");
    setLoading(false);
    onCancel();
  };

  const toggleInterest = (value: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <Label>Full Name *</Label>
          <Input
            value={form.fullName}
            onChange={(e) =>
              setForm((p) => ({ ...p, fullName: e.target.value }))
            }
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Age *</Label>
          <Input
            type="number"
            value={form.age}
            onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
            placeholder="Your age"
          />
          {errors.age && <p className="text-xs text-red-500">{errors.age}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, gender: v as Gender }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>State *</Label>
          <Select
            value={form.state}
            onValueChange={(v) => setForm((p) => ({ ...p, state: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {INDIAN_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-xs text-red-500">{errors.state}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, category: v as UserCategory }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["General", "OBC", "SC", "ST", "EWS"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Education Level</Label>
          <Select
            value={form.educationLevel}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, educationLevel: v as EducationLevel }))
            }
          >
            <SelectTrigger>
              <SelectValue />
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

        <div className="sm:col-span-2 space-y-1.5">
          <Label>Annual Income (₹) *</Label>
          <Input
            type="number"
            value={form.annualIncome}
            onChange={(e) =>
              setForm((p) => ({ ...p, annualIncome: e.target.value }))
            }
            placeholder="e.g. 300000"
          />
          {errors.annualIncome && (
            <p className="text-xs text-red-500">{errors.annualIncome}</p>
          )}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <Label>Interests</Label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest.value}
              type="button"
              onClick={() => toggleInterest(interest.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                form.interests.includes(interest.value)
                  ? "bg-nf-primary text-white border-nf-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-nf-primary hover:text-nf-primary"
              }`}
            >
              {interest.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 gradient-primary text-white border-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
