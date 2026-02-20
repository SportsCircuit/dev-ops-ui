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
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            cat === selected
              ? "bg-[rgba(3,2,19,0.1)] border-[rgba(3,2,19,0.2)] text-[#030213] shadow-sm"
              : "border-transparent text-[#717182] hover:bg-[#eceef2]/40"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
