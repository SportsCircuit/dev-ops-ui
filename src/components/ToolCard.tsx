import { ExternalLink, Globe } from "lucide-react";
import { Tool, Environment } from "@/types";

const environmentStyles: Record<Environment, { bg: string; text: string }> = {
  Dev: { bg: "bg-[#dbeafe]", text: "text-[#193cb8]" },
  QA: { bg: "bg-[#f3e8ff]", text: "text-[#6e11b0]" },
  Stage: { bg: "bg-[#ffedd4]", text: "text-[#9f2d00]" },
  Prod: { bg: "bg-[#dcfce7]", text: "text-[#016630]" },
};

const statusBorderColor: Record<string, string> = {
  healthy: "border-l-[#00c950]",
  warning: "border-l-[#f0b100]",
  error: "border-l-red-500",
  unknown: "border-l-gray-300",
};

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div
      className={`relative bg-white border border-black/10 border-l-4 ${statusBorderColor[tool.status]} rounded-[10px] shadow-sm hover:shadow-md transition-shadow w-full min-w-[194px]`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-3 h-10">
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="w-4 h-4 text-[#717182] shrink-0" />
          <h3 className="text-sm font-semibold text-[#0a0a0a] truncate tracking-tight">
            {tool.name}
          </h3>
        </div>
        <a
          href={tool.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 hover:opacity-100 transition-opacity shrink-0"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Description */}
      <p className="px-3 text-xs leading-4 text-[#717182] line-clamp-2">
        {tool.description}
      </p>

      {/* Environment tags */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2">
        {tool.environments.map((env) => (
          <span
            key={env}
            className={`inline-flex items-center px-1.5 h-4 rounded-full text-[10px] font-normal ${environmentStyles[env].bg} ${environmentStyles[env].text}`}
          >
            {env}
          </span>
        ))}
      </div>
    </div>
  );
}
