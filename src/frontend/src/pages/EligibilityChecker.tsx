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
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import ResultScreen from "../components/eligibility/ResultScreen";
import StepIndicator from "../components/eligibility/StepIndicator";
import { useAppContext } from "../contexts/AppContext";
import { INDIAN_STATES } from "../data/mockData";
import MainLayout from "../layouts/MainLayout";
import type { EducationLevel, EligibilityResult } from "../types";
import { checkEligibility } from "../utils/eligibilityUtils";

const STEP_LABELS = ["Age", "Education", "Income", "State"];

export default function EligibilityChecker() {
  const { forms: allForms } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState<EducationLevel | "">("");
  const [income, setIncome] = useState("");
  const [state, setState] = useState("");
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeForms = allForms.filter((f) => f.isActive);
  const selectedForm = activeForms.find((f) => f.id === selectedFormId);

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 0 && !selectedFormId) errs.form = "Please select a form";
    if (step === 1) {
      if (
        !age ||
        Number.isNaN(Number(age)) ||
        Number(age) < 1 ||
        Number(age) > 120
      )
        errs.age = "Please enter a valid age";
    }
    if (step === 2 && !education)
      errs.education = "Please select your education level";
    if (step === 3) {
      if (!income || Number.isNaN(Number(income)) || Number(income) < 0)
        errs.income = "Please enter a valid income";
    }
    if (step === 4 && !state) errs.state = "Please select your state";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 4) {
      setStep((s) => s + 1);
    } else {
      // Calculate result
      if (!selectedForm) return;
      const res = checkEligibility(
        selectedForm,
        Number(age),
        education as EducationLevel,
        Number(income),
        state,
      );
      setResult(res);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedFormId("");
    setAge("");
    setEducation("");
    setIncome("");
    setState("");
    setResult(null);
    setErrors({});
  };

  return (
    <MainLayout title="Eligibility Checker">
      <div className="px-4 py-5">
        <div className="flex items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="text-nf-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-gray-900 text-lg">
            Eligibility Checker
          </h1>
        </div>

        {result ? (
          <ResultScreen
            result={result}
            formTitle={selectedForm?.title || "Selected Form"}
            onReset={handleReset}
            onApply={
              selectedForm
                ? () =>
                    navigate({
                      to: "/apply/$formId",
                      params: { formId: selectedForm.id },
                    })
                : undefined
            }
          />
        ) : (
          <div className="space-y-6">
            {/* Step indicator */}
            <StepIndicator
              currentStep={step}
              totalSteps={4}
              labels={STEP_LABELS}
            />

            <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5 min-h-[200px]">
              {/* Form selector (always visible) */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-semibold">
                      Select a Form to Check
                    </Label>
                    <Select
                      value={selectedFormId}
                      onValueChange={setSelectedFormId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a form..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {activeForms.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.form && (
                      <p className="text-xs text-red-500">{errors.form}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-semibold">Step 1: Your Age</Label>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="text-lg h-12"
                    />
                    {errors.age && (
                      <p className="text-xs text-red-500">{errors.age}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-1.5">
                  <Label className="font-semibold text-base">
                    Step 2: Education Level
                  </Label>
                  <p className="text-sm text-gray-500 mb-3">
                    What is your highest education qualification?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        "10th",
                        "12th",
                        "Diploma",
                        "Graduate",
                        "Postgraduate",
                        "Doctorate",
                      ] as EducationLevel[]
                    ).map((level) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setEducation(level)}
                        className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                          education === level
                            ? "border-nf-primary bg-blue-50 text-nf-primary"
                            : "border-gray-200 text-gray-600 hover:border-nf-primary/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  {errors.education && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.education}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-1.5">
                  <Label className="font-semibold text-base">
                    Step 3: Annual Income
                  </Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Enter your family's annual income in rupees
                  </p>
                  <Input
                    type="number"
                    placeholder="e.g. 300000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="text-lg h-12"
                  />
                  <p className="text-xs text-gray-400">
                    {income && !Number.isNaN(Number(income))
                      ? `₹${Number(income).toLocaleString("en-IN")} per year`
                      : "Enter amount in ₹"}
                  </p>
                  {errors.income && (
                    <p className="text-xs text-red-500">{errors.income}</p>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-1.5">
                  <Label className="font-semibold text-base">
                    Step 4: Your State
                  </Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Select your state of residence
                  </p>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger className="h-12">
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
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="flex-1 gradient-primary text-white border-0"
              >
                {step === 4 ? (
                  "Check Eligibility"
                ) : (
                  <>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
