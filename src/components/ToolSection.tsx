import { Tool, Category } from "@/types";
import ToolCard from "./ToolCard";

interface ToolSectionProps {
  category: Category;
  tools: Tool[];
  onDeleteTool?: (id: string) => void;
  onEditTool?: (id: string) => void;
}

export default function ToolSection({ category, tools, onDeleteTool, onEditTool }: ToolSectionProps) {
  if (tools.length === 0) return null;

  return (
    <section aria-label={`${category} tools`} className="space-y-2">
      {/* Section header */}
      <div className="flex items-center gap-2 pb-1 border-b border-black/6">
        <h2 className="text-xs font-semibold text-[rgba(10,10,10,0.7)] uppercase tracking-wide">
          {category}
        </h2>
        <span
          aria-label={`${tools.length} tool${tools.length !== 1 ? "s" : ""}`}
          className="inline-flex items-center justify-center px-1.5 h-4 text-[10px] font-semibold text-[#717182] bg-[#eceef2] rounded-full"
        >
          {tools.length}
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onDelete={onDeleteTool} onEdit={onEditTool} />
        ))}
      </div>
    </section>
  );
}
