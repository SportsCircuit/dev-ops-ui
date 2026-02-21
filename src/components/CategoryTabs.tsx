import { useCallback } from "react";
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
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      let nextIdx = idx;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextIdx = idx < categories.length - 1 ? idx + 1 : 0;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        nextIdx = idx > 0 ? idx - 1 : categories.length - 1;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIdx = categories.length - 1;
      } else {
        return;
      }
      onSelect(categories[nextIdx]);
      // Focus the newly selected tab
      const container = e.currentTarget.closest('[role="tablist"]');
      const buttons = container?.querySelectorAll<HTMLElement>('[role="tab"]');
      buttons?.[nextIdx]?.focus();
    },
    [categories, onSelect]
  );

  return (
    <div
      role="tablist"
      aria-label="Category filter"
      className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide pb-1.5"
    >
      {categories.map((cat, idx) => {
        const isActive = cat === selected;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            id={`cat-tab-${cat}`}
            aria-controls="category-tabpanel"
            onClick={() => onSelect(cat)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 ${
              isActive
                ? "bg-[#030213] text-white shadow-sm"
                : "text-[#717182] hover:bg-[#eceef2]/50 hover:text-[#0a0a0a]"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
