"use client";

import { Category } from "@/types";

interface CategoryTabsProps {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryTabs({
  categories,
  selected,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide pb-1.5">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
            cat === selected
              ? "bg-[#030213] text-white shadow-sm"
              : "text-[#717182] hover:bg-[#eceef2]/50 hover:text-[#0a0a0a]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
