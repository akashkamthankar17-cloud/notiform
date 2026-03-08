import type { LucideIcon } from "lucide-react";
import React from "react";

interface CategoryTileProps {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  onClick: () => void;
  count?: number;
}

export default function CategoryTile({
  label,
  icon: Icon,
  color,
  bgColor,
  onClick,
  count,
}: CategoryTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-xs card-hover w-full text-center group"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
        style={{ backgroundColor: bgColor }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 leading-tight">
          {label}
        </p>
        {count !== undefined && (
          <p className="text-xs text-gray-400 mt-0.5">{count} forms</p>
        )}
      </div>
    </button>
  );
}
