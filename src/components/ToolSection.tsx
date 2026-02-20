import { Tool, Category } from "@/types";
import ToolCard from "./ToolCard";

interface ToolSectionProps {
  category: Category;
  tools: Tool[];
}

export default function ToolSection({ category, tools }: ToolSectionProps) {
  if (tools.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2 pb-1 border-b border-black/10">
        <h2 className="text-sm font-semibold text-[rgba(10,10,10,0.8)]">
          {category}
        </h2>
        <span className="inline-flex items-center justify-center w-5 h-4 text-[10px] font-semibold text-[#030213] bg-[#eceef2] rounded-full border border-transparent">
          {tools.length}
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
