import type {
  EducationLevel,
  EligibilityResult,
  FormModel,
  UserProfile,
} from "../types";

const EDUCATION_ORDER: EducationLevel[] = [
  "10th",
  "12th",
  "Diploma",
  "Graduate",
  "Postgraduate",
  "Doctorate",
];

function getEducationRank(level: EducationLevel): number {
  return EDUCATION_ORDER.indexOf(level);
}

export function checkEligibility(
  form: FormModel,
  age: number,
  educationLevel: EducationLevel,
  annualIncome: number,
  state: string,
  category?: string,
): EligibilityResult {
  const criteria = form.eligibilityCriteria;
  const matched: string[] = [];
  const missed: string[] = [];

  // Age check
  if (criteria.minAge !== undefined || criteria.maxAge !== undefined) {
    const minOk = criteria.minAge === undefined || age >= criteria.minAge;
    const maxOk = criteria.maxAge === undefined || age <= criteria.maxAge;
    if (minOk && maxOk) {
      matched.push(
        `Age ${age} is within the eligible range (${criteria.minAge ?? 0}–${criteria.maxAge ?? "∞"})`,
      );
    } else {
      missed.push(
        `Age ${age} is outside the eligible range (${criteria.minAge ?? 0}–${criteria.maxAge ?? "∞"})`,
      );
    }
  }

  // Education check
  if (criteria.minEducation) {
    const userRank = getEducationRank(educationLevel);
    const minRank = getEducationRank(criteria.minEducation);
    if (userRank >= minRank) {
      matched.push(
        `Education level (${educationLevel}) meets the minimum requirement (${criteria.minEducation})`,
      );
    } else {
      missed.push(
        `Education level (${educationLevel}) is below the minimum requirement (${criteria.minEducation})`,
      );
    }
  }

  // Income check
  if (criteria.maxIncome !== undefined) {
    if (annualIncome <= criteria.maxIncome) {
      matched.push(
        `Annual income ₹${annualIncome.toLocaleString("en-IN")} is within the limit (≤ ₹${criteria.maxIncome.toLocaleString("en-IN")})`,
      );
    } else {
      missed.push(
        `Annual income ₹${annualIncome.toLocaleString("en-IN")} exceeds the limit (≤ ₹${criteria.maxIncome.toLocaleString("en-IN")})`,
      );
    }
  }

  // State check
  if (criteria.eligibleStates && criteria.eligibleStates.length > 0) {
    if (criteria.eligibleStates.includes(state)) {
      matched.push(`State (${state}) is in the eligible states list`);
    } else {
      missed.push(`State (${state}) is not in the eligible states list`);
    }
  }

  // Category check
  if (
    criteria.eligibleCategories &&
    criteria.eligibleCategories.length > 0 &&
    category
  ) {
    if (criteria.eligibleCategories.includes(category as any)) {
      matched.push(`Category (${category}) is eligible`);
    } else {
      missed.push(`Category (${category}) is not eligible for this form`);
    }
  }

  // Determine result
  let status: EligibilityResult["status"];
  if (missed.length === 0 && matched.length > 0) {
    status = "eligible";
  } else if (matched.length === 0) {
    status = "not_eligible";
  } else {
    status = "partially_eligible";
  }

  return { status, matchedCriteria: matched, missedCriteria: missed };
}

export function checkEligibilityFromProfile(
  form: FormModel,
  profile: UserProfile,
): EligibilityResult {
  return checkEligibility(
    form,
    profile.age,
    profile.educationLevel,
    profile.annualIncome,
    profile.state,
    profile.category,
  );
}
