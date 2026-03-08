import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Edit2,
  FileText,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import AnalyticsPanel from "../../components/admin/AnalyticsPanel";
import FormEditor from "../../components/admin/FormEditor";
import NotificationComposer from "../../components/admin/NotificationComposer";
import VerificationBadge from "../../components/forms/VerificationBadge";
import { useAppContext } from "../../contexts/AppContext";
import MainLayout from "../../layouts/MainLayout";
import type { FormModel } from "../../types";
import { formatDate } from "../../utils/dateUtils";

export default function AdminDashboard() {
  const { forms, addForm, updateForm, deleteForm, userProfile } =
    useAppContext();
  const navigate = useNavigate();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<FormModel | null>(null);

  if (userProfile?.role !== "admin") {
    return (
      <MainLayout title="Admin">
        <div className="flex flex-col items-center py-16 px-4">
          <Shield className="w-16 h-16 text-gray-200 mb-4" />
          <p className="text-gray-600 font-semibold text-lg">Access Denied</p>
          <p className="text-gray-400 text-sm mt-1 text-center">
            You don't have admin privileges
          </p>
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

  const handleSaveForm = (form: FormModel) => {
    const existing = forms.find((f) => f.id === form.id);
    if (existing) {
      updateForm(form.id, form);
      toast.success("Form updated successfully!");
    } else {
      addForm(form);
      toast.success("Form created successfully!");
    }
  };

  const handleDeleteForm = (formId: string) => {
    deleteForm(formId);
    toast.success("Form deleted");
  };

  const handleEdit = (form: FormModel) => {
    setEditingForm(form);
    setEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingForm(null);
    setEditorOpen(true);
  };

  return (
    <MainLayout title="Admin Dashboard">
      <div className="px-4 py-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="text-nf-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h1 className="font-display font-bold text-gray-900 text-lg">
              Admin Dashboard
            </h1>
          </div>
        </div>

        <Tabs defaultValue="forms">
          <TabsList className="w-full mb-5">
            <TabsTrigger value="forms" className="flex-1 gap-1.5">
              <FileText className="w-4 h-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 gap-1.5">
              <Bell className="w-4 h-4" />
              Notify
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 gap-1.5">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Forms tab */}
          <TabsContent value="forms" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {forms.length} forms total
              </p>
              <Button
                size="sm"
                onClick={handleCreate}
                className="gradient-primary text-white border-0 gap-1.5"
              >
                <Plus className="w-4 h-4" />
                New Form
              </Button>
            </div>

            <div className="space-y-3">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-xs p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {form.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {form.organizationName}
                      </p>
                    </div>
                    <VerificationBadge
                      status={form.verificationStatus}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="capitalize">{form.category}</span>
                      <span>·</span>
                      <span>{form.viewCount.toLocaleString()} views</span>
                      <span>·</span>
                      <span>Due {formatDate(form.lastDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-nf-primary"
                        onClick={() => handleEdit(form)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Form</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{form.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteForm(form.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Notifications tab */}
          <TabsContent value="notifications">
            <NotificationComposer />
          </TabsContent>

          {/* Analytics tab */}
          <TabsContent value="analytics">
            <AnalyticsPanel />
          </TabsContent>
        </Tabs>
      </div>

      <FormEditor
        open={editorOpen}
        form={editingForm}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveForm}
      />
    </MainLayout>
  );
}
