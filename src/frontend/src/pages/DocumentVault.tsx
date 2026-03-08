import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderOpen, Upload } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import DocumentCard from "../components/documents/DocumentCard";
import { useAppContext } from "../contexts/AppContext";
import MainLayout from "../layouts/MainLayout";
import { generateId } from "../lib/utils";
import type { DocumentType } from "../types";

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "marksheet", label: "Marksheet" },
  { value: "income_cert", label: "Income Certificate" },
  { value: "caste_cert", label: "Caste Certificate" },
  { value: "resume", label: "Resume / CV" },
  { value: "passport_photo", label: "Passport Photo" },
];

const DOC_TYPE_GROUPS: DocumentType[] = [
  "aadhaar",
  "marksheet",
  "income_cert",
  "caste_cert",
  "resume",
  "passport_photo",
];

export default function DocumentVault() {
  const { documents, addDocument, deleteDocument, userProfile } =
    useAppContext();
  const [selectedType, setSelectedType] = useState<DocumentType>("aadhaar");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    await new Promise((r) => setTimeout(r, 800));

    addDocument({
      id: generateId(),
      userId: userProfile?.uid || "anonymous",
      documentType: selectedType,
      fileName: file.name,
      downloadUrl: "#",
      storagePath: `/docs/${file.name}`,
      uploadedAt: new Date(),
    });

    toast.success(`${file.name} uploaded successfully!`);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (docId: string) => {
    deleteDocument(docId);
    toast.success("Document deleted");
  };

  const groupedDocs = DOC_TYPE_GROUPS.reduce(
    (acc, type) => {
      acc[type] = documents.filter((d) => d.documentType === type);
      return acc;
    },
    {} as Record<DocumentType, typeof documents>,
  );

  const totalDocs = documents.length;

  return (
    <MainLayout title="Document Vault">
      <div className="px-4 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-gray-900 text-lg">
              Document Vault
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalDocs} document{totalDocs !== 1 ? "s" : ""} stored
            </p>
          </div>
        </div>

        {/* Upload section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card p-4">
          <h2 className="font-display font-bold text-gray-900 text-sm mb-3">
            Upload Document
          </h2>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Document Type</Label>
              <Select
                value={selectedType}
                onValueChange={(v) => setSelectedType(v as DocumentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full gradient-primary text-white border-0"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File & Upload
                </>
              )}
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Supported: PDF, JPG, PNG, DOC (max 10MB)
            </p>
          </div>
        </div>

        {/* Documents by type */}
        {totalDocs === 0 ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-600 font-semibold">Vault is empty</p>
            <p className="text-gray-400 text-sm mt-1">
              Upload your documents to get started
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {DOC_TYPE_GROUPS.map((type) => {
              const docs = groupedDocs[type];
              if (docs.length === 0) return null;
              const typeLabel =
                DOC_TYPES.find((t) => t.value === type)?.label || type;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">
                      {typeLabel}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {docs.length} file{docs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {docs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
