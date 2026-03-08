// NotiForm domain types - used throughout the frontend

export type VerificationStatus =
  | "verified_govt"
  | "verified_private"
  | "not_verified";
export type FormCategory =
  | "scholarship"
  | "job"
  | "admission"
  | "loan"
  | "scheme";
export type FormSubCategory = "govt" | "private";
export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "approved"
  | "rejected"
  | "draft";
export type DocumentType =
  | "aadhaar"
  | "marksheet"
  | "income_cert"
  | "caste_cert"
  | "resume"
  | "passport_photo";
export type NotificationType = "new_form" | "reminder" | "personalized";
export type UserCategory = "General" | "OBC" | "SC" | "ST" | "EWS";
export type EducationLevel =
  | "10th"
  | "12th"
  | "Diploma"
  | "Graduate"
  | "Postgraduate"
  | "Doctorate";
export type Gender = "Male" | "Female" | "Other";

export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  minEducation?: EducationLevel;
  maxIncome?: number;
  eligibleStates?: string[];
  eligibleCategories?: UserCategory[];
}

export interface FormModel {
  id: string;
  title: string;
  organizationName: string;
  category: FormCategory;
  subCategory: FormSubCategory;
  eligibilitySummary: string;
  lastDate: Date;
  applyUrl: string;
  hasInternalForm: boolean;
  verificationStatus: VerificationStatus;
  eligibilityCriteria: EligibilityCriteria;
  viewCount: number;
  createdAt: Date;
  isActive: boolean;
  description: string;
  requiredDocuments: string[];
}

export interface UserProfile {
  uid: string;
  fullName: string;
  age: number;
  gender: Gender;
  state: string;
  category: UserCategory;
  educationLevel: EducationLevel;
  annualIncome: number;
  interests: string[];
  role: "user" | "admin";
  createdAt: Date;
}

export interface ApplicationModel {
  id: string;
  userId: string;
  formId: string;
  formTitle: string;
  organizationName: string;
  status: ApplicationStatus;
  formData: Record<string, string>;
  attachedDocuments: string[];
  appliedAt: Date;
  updatedAt?: Date;
}

export interface DocumentModel {
  id: string;
  userId: string;
  documentType: DocumentType;
  fileName: string;
  downloadUrl: string;
  storagePath: string;
  uploadedAt: Date;
}

export interface NotificationModel {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  formId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface EligibilityResult {
  status: "eligible" | "not_eligible" | "partially_eligible";
  matchedCriteria: string[];
  missedCriteria: string[];
}
