import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  GraduationCap,
  IndianRupee,
  LogOut,
  MapPin,
  Shield,
  Tag,
  User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import EditProfileForm from "../components/profile/EditProfileForm";
import { useAppContext } from "../contexts/AppContext";
import MainLayout from "../layouts/MainLayout";
import type { UserProfile } from "../types";

function ProfileField({
  icon: Icon,
  label,
  value,
}: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-nf-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { userProfile, updateUserProfile } = useAppContext();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  const handleSave = (updates: Partial<UserProfile>) => {
    updateUserProfile(updates);
    setEditing(false);
  };

  if (!userProfile) {
    return (
      <MainLayout title="Profile">
        <div className="flex flex-col items-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-600 font-semibold">Not signed in</p>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to view your profile
          </p>
        </div>
      </MainLayout>
    );
  }

  const initials = userProfile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <MainLayout title="Profile">
      <div className="px-4 py-5 space-y-5">
        {/* Profile header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-display font-bold text-xl">
                {initials}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-gray-900 text-lg">
                {userProfile.fullName}
              </h1>
              <p className="text-sm text-gray-500">
                {userProfile.gender} · {userProfile.age} years
              </p>
              {userProfile.role === "admin" && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
          </div>

          {identity && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
              <p className="text-xs text-gray-400">Principal ID</p>
              <p className="text-xs font-mono text-gray-600 truncate">
                {identity.getPrincipal().toString()}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
              className="flex-1 gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {editing ? "Cancel Edit" : "Edit Profile"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex-1 gap-1.5 text-red-500 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Edit form */}
        {editing && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 page-enter">
            <h2 className="font-display font-bold text-gray-900 text-sm mb-4">
              Edit Profile
            </h2>
            <EditProfileForm
              profile={userProfile}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          </div>
        )}

        {/* Profile details */}
        {!editing && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4 page-enter">
            <h2 className="font-display font-bold text-gray-900 text-sm mb-2">
              Profile Details
            </h2>
            <ProfileField
              icon={MapPin}
              label="State"
              value={userProfile.state}
            />
            <ProfileField
              icon={User}
              label="Category"
              value={userProfile.category}
            />
            <ProfileField
              icon={GraduationCap}
              label="Education Level"
              value={userProfile.educationLevel}
            />
            <ProfileField
              icon={IndianRupee}
              label="Annual Income"
              value={`₹${userProfile.annualIncome.toLocaleString("en-IN")}`}
            />
            {userProfile.interests.length > 0 && (
              <div className="flex items-start gap-3 py-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-nf-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1.5">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {userProfile.interests.map((i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium capitalize"
                      >
                        {i.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
