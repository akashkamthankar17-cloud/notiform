import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Briefcase,
  Building,
  CreditCard,
  GraduationCap,
  Landmark,
  type LucideIcon,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import CategoryTile from "../components/categories/CategoryTile";
import FormCard from "../components/forms/FormCard";
import { useAppContext } from "../contexts/AppContext";
import MainLayout from "../layouts/MainLayout";
import type { FormCategory, FormSubCategory } from "../types";

interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  category: FormCategory;
  subCategory?: FormSubCategory;
}

const CATEGORIES: CategoryConfig[] = [
  {
    label: "Govt. Scholarships",
    icon: GraduationCap,
    color: "#1565C0",
    bgColor: "#E3F2FD",
    category: "scholarship",
    subCategory: "govt",
  },
  {
    label: "Private Scholarships",
    icon: GraduationCap,
    color: "#6A1B9A",
    bgColor: "#F3E5F5",
    category: "scholarship",
    subCategory: "private",
  },
  {
    label: "Government Jobs",
    icon: Landmark,
    color: "#2E7D32",
    bgColor: "#E8F5E9",
    category: "job",
    subCategory: "govt",
  },
  {
    label: "Private Jobs",
    icon: Briefcase,
    color: "#E65100",
    bgColor: "#FFF3E0",
    category: "job",
    subCategory: "private",
  },
  {
    label: "Admissions",
    icon: BookOpen,
    color: "#00695C",
    bgColor: "#E0F2F1",
    category: "admission",
  },
  {
    label: "Loans",
    icon: CreditCard,
    color: "#AD1457",
    bgColor: "#FCE4EC",
    category: "loan",
  },
  {
    label: "Govt. Schemes",
    icon: Building,
    color: "#4527A0",
    bgColor: "#EDE7F6",
    category: "scheme",
  },
];

export default function Categories() {
  const { forms } = useAppContext();
  const [selected, setSelected] = useState<CategoryConfig | null>(null);

  const activeForms = forms.filter((f) => f.isActive);

  const getCount = (cat: CategoryConfig) => {
    return activeForms.filter(
      (f) =>
        f.category === cat.category &&
        (!cat.subCategory || f.subCategory === cat.subCategory),
    ).length;
  };

  const filteredForms = selected
    ? activeForms.filter(
        (f) =>
          f.category === selected.category &&
          (!selected.subCategory || f.subCategory === selected.subCategory),
      )
    : [];

  return (
    <MainLayout title="Categories">
      <div className="px-4 py-5">
        {/* Category grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {CATEGORIES.map((cat) => (
            <CategoryTile
              key={cat.label}
              label={cat.label}
              icon={cat.icon}
              color={cat.color}
              bgColor={cat.bgColor}
              count={getCount(cat)}
              onClick={() =>
                setSelected(selected?.label === cat.label ? null : cat)
              }
            />
          ))}
        </div>

        {/* Filtered results */}
        {selected && (
          <div className="page-enter">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-gray-900">
                {selected.label}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredForms.length} forms
              </span>
            </div>

            {filteredForms.length === 0 ? (
              <div className="flex flex-col items-center py-12">
                <img
                  src="/assets/generated/empty-state-illustration.dim_400x300.png"
                  alt="No forms"
                  className="w-48 h-36 object-contain opacity-70 mb-4"
                />
                <p className="text-gray-500 font-medium">
                  No forms in this category
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Check back later for new opportunities
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredForms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            )}
          </div>
        )}

        {!selected && (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Select a category above</p>
            <p className="text-gray-400 text-sm mt-1">
              to browse available forms
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
