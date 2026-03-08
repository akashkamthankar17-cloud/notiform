import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  ChevronRight,
  Clock,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import FormCard from "../components/forms/FormCard";
import FormCardSkeleton from "../components/forms/FormCardSkeleton";
import { useAppContext } from "../contexts/AppContext";
import MainLayout from "../layouts/MainLayout";
import type { FormModel } from "../types";
import { getDaysRemaining } from "../utils/dateUtils";

function SectionHeader({
  title,
  icon: Icon,
  onSeeAll,
}: { title: string; icon: React.ElementType; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-nf-primary" />
        <h2 className="font-display font-bold text-gray-900 text-base">
          {title}
        </h2>
      </div>
      {onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="text-xs text-nf-primary font-semibold flex items-center gap-0.5 hover:underline"
        >
          See all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function HorizontalScroll({
  forms,
  loading,
}: { forms: FormModel[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {[1, 2, 3].map((i) => (
          <FormCardSkeleton key={i} compact />
        ))}
      </div>
    );
  }
  if (forms.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        No forms available
      </p>
    );
  }
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      {forms.map((form) => (
        <FormCard key={form.id} form={form} compact />
      ))}
    </div>
  );
}

export default function Home() {
  const { forms, userProfile } = useAppContext();
  const navigate = useNavigate();

  const activeForms = forms.filter((f) => f.isActive);

  const latestForms = [...activeForms]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);
  const closingSoon = activeForms
    .filter((f) => {
      const days = getDaysRemaining(f.lastDate);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => a.lastDate.getTime() - b.lastDate.getTime())
    .slice(0, 8);
  const trending = [...activeForms]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 8);
  const verifiedGovt = activeForms
    .filter((f) => f.verificationStatus === "verified_govt")
    .slice(0, 8);
  const verifiedPrivate = activeForms
    .filter((f) => f.verificationStatus === "verified_private")
    .slice(0, 8);

  const recommended = userProfile
    ? activeForms
        .filter((f) => {
          const c = f.eligibilityCriteria;
          if (
            c.eligibleCategories &&
            c.eligibleCategories.length > 0 &&
            !c.eligibleCategories.includes(userProfile.category)
          )
            return false;
          if (
            c.maxIncome !== undefined &&
            userProfile.annualIncome > c.maxIncome
          )
            return false;
          return true;
        })
        .slice(0, 8)
    : latestForms.slice(0, 8);

  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="NotiForm Hero"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 gradient-primary opacity-80" />
        <div className="absolute inset-0 flex flex-col justify-center px-5">
          <h1 className="text-white font-display font-bold text-xl leading-tight">
            Find Government Forms,
            <br />
            Scholarships & Jobs
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {activeForms.length}+ opportunities available
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/eligibility" })}
            className="mt-3 self-start flex items-center gap-1.5 bg-white text-nf-primary text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Check Eligibility
          </button>
        </div>
      </div>

      <div className="px-4 py-5 space-y-7">
        {/* Latest Forms */}
        <section>
          <SectionHeader
            title="Latest Forms"
            icon={Star}
            onSeeAll={() => navigate({ to: "/categories" })}
          />
          <HorizontalScroll forms={latestForms} />
        </section>

        {/* Closing Soon */}
        {closingSoon.length > 0 && (
          <section>
            <SectionHeader title="Closing Soon" icon={Clock} />
            <HorizontalScroll forms={closingSoon} />
          </section>
        )}

        {/* Recommended */}
        <section>
          <SectionHeader
            title={userProfile ? "Recommended For You" : "Popular Forms"}
            icon={Sparkles}
          />
          <HorizontalScroll forms={recommended} />
        </section>

        {/* Trending */}
        <section>
          <SectionHeader title="Trending" icon={TrendingUp} />
          <HorizontalScroll forms={trending} />
        </section>

        {/* Verified Government */}
        {verifiedGovt.length > 0 && (
          <section>
            <SectionHeader title="Verified Government" icon={Shield} />
            <HorizontalScroll forms={verifiedGovt} />
          </section>
        )}

        {/* Verified Private */}
        {verifiedPrivate.length > 0 && (
          <section>
            <SectionHeader title="Verified Private" icon={Building2} />
            <HorizontalScroll forms={verifiedPrivate} />
          </section>
        )}
      </div>
    </MainLayout>
  );
}
