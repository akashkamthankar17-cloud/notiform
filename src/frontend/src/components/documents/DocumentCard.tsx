import { Button } from "@/components/ui/button";
import { Calendar, Download, FileText, Trash2 } from "lucide-react";
import React from "react";
import type { DocumentModel, DocumentType } from "../../types";
import { formatDate } from "../../utils/dateUtils";

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  aadhaar: "Aadhaar Card",
  marksheet: "Marksheet",
  income_cert: "Income Certificate",
  caste_cert: "Caste Certificate",
  resume: "Resume / CV",
  passport_photo: "Passport Photo",
};

const DOC_TYPE_COLORS: Record<DocumentType, string> = {
  aadhaar: "#1565C0",
  marksheet: "#2E7D32",
  income_cert: "#E65100",
  caste_cert: "#6A1B9A",
  resume: "#00695C",
  passport_photo: "#AD1457",
};

interface DocumentCardProps {
  document: DocumentModel;
  onDelete: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function DocumentCard({
  document,
  onDelete,
  selectable,
  selected,
  onSelect,
}: DocumentCardProps) {
  const color = DOC_TYPE_COLORS[document.documentType];

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white rounded-xl border transition-all ${
        selectable
          ? selected
            ? "border-nf-primary bg-blue-50 cursor-pointer"
            : "border-gray-100 cursor-pointer hover:border-nf-primary/50"
          : "border-gray-100"
      }`}
      onClick={() => selectable && onSelect?.(document.id)}
      onKeyDown={(e) => {
        if (selectable && (e.key === "Enter" || e.key === " "))
          onSelect?.(document.id);
      }}
    >
      {selectable && (
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            selected ? "bg-nf-primary border-nf-primary" : "border-gray-300"
          }`}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-sm" />}
        </div>
      )}

      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <FileText className="w-5 h-5" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {document.fileName}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-medium" style={{ color }}>
            {DOC_TYPE_LABELS[document.documentType]}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(document.uploadedAt)}
          </span>
        </div>
      </div>

      {!selectable && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-nf-primary"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(document.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
