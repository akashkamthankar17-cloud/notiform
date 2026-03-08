import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Loader2, User, X } from "lucide-react";
import React, { useState } from "react";
import { INDIAN_STATES, INTERESTS } from "../../data/mockData";
import type {
  EducationLevel,
  Gender,
  UserCategory,
  UserProfile,
} from "../../types";

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: (
    profile: Omit<UserProfile, "uid" | "role" | "createdAt">,
  ) => void;
}

export default function ProfileSetupModal({
  open,
  onComplete,
}: ProfileSetupModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "" as Gender,
    state: "",
    category: "" as UserCategory,
    educationLevel: "" as EducationLevel,
    annualIncome: "",
    interests: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (
      !form.age ||
      Number.isNaN(Number(form.age)) ||
      Number(form.age) < 10 ||
      Number(form.age) > 100
    )
      errs.age = "Please enter a valid age (10–100)";
    if (!form.gender) errs.gender = "Please select your gender";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!form.state) errs.state = "Please select your state";
    if (!form.category) errs.category = "Please select your category";
    if (!form.educationLevel)
      errs.educationLevel = "Please select your education level";
    if (
      !form.annualIncome ||
      Number.isNaN(Number(form.annualIncome)) ||
      Number(form.annualIncome) < 0
    )
      errs.annualIncome = "Please enter a valid annual income";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const toggleInterest = (value: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onComplete({
      fullName: form.fullName.trim(),
      age: Number(form.age),
      gender: form.gender,
      state: form.state,
      category: form.category,
      educationLevel: form.educationLevel,
      annualIncome: Number(form.annualIncome),
      interests: form.interests,
    });
    setLoading(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-display">
                Complete Your Profile
              </DialogTitle>
              <DialogDescription className="text-sm">
                Step {step} of 3 — Help us personalize your experience
              </DialogDescription>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-nf-primary" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fullName: e.target.value }))
                  }
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Your age"
                    value={form.age}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, age: e.target.value }))
                    }
                  />
                  {errors.age && (
                    <p className="text-xs text-red-500">{errors.age}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Gender *</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, gender: v as Gender }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-500">{errors.gender}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-1.5">
                <Label>State *</Label>
                <Select
                  value={form.state}
                  onValueChange={(v) => setForm((p) => ({ ...p, state: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, category: v as UserCategory }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {["General", "OBC", "SC", "ST", "EWS"].map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-red-500">{errors.category}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Education *</Label>
                  <Select
                    value={form.educationLevel}
                    onValueChange={(v) =>
                      setForm((p) => ({
                        ...p,
                        educationLevel: v as EducationLevel,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
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
                  {errors.educationLevel && (
                    <p className="text-xs text-red-500">
                      {errors.educationLevel}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="income">Annual Income (₹) *</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="e.g. 300000"
                  value={form.annualIncome}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, annualIncome: e.target.value }))
                  }
                />
                {errors.annualIncome && (
                  <p className="text-xs text-red-500">{errors.annualIncome}</p>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">
                  Select Your Interests
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose topics you want to receive updates about
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    type="button"
                    key={interest.value}
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
              <p className="text-xs text-muted-foreground">
                {form.interests.length === 0
                  ? "Select at least one interest"
                  : `${form.interests.length} selected`}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1 gradient-primary text-white border-0"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 gradient-primary text-white border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
