import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "card" | "list";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex items-center border border-black/10 rounded-lg bg-[rgba(236,236,240,0.5)] p-0.5"
      role="group"
      aria-label="View mode"
    >
      <button
        onClick={() => onChange("card")}
        aria-pressed={mode === "card"}
        aria-label="Card view"
        className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 ${
          mode === "card"
            ? "bg-white shadow-sm text-[#0a0a0a]"
            : "text-[#717182] hover:text-[#0a0a0a]"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      <button
        onClick={() => onChange("list")}
        aria-pressed={mode === "list"}
        aria-label="List view"
        className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 ${
          mode === "list"
            ? "bg-white shadow-sm text-[#0a0a0a]"
            : "text-[#717182] hover:text-[#0a0a0a]"
        }`}
      >
        <List className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
