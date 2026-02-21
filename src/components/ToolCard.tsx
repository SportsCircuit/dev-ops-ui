import { ExternalLink, Copy, MoreHorizontal, Globe } from "lucide-react";
import { Tool, Environment, ToolStatus } from "@/types";

const environmentStyles: Record<Environment, { bg: string; text: string }> = {
  Local: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
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

const statusLabel: Record<ToolStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  error: "Error",
  unknown: "Unknown",
};

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <article
      aria-label={`${tool.name} — ${statusLabel[tool.status]}`}
      className={`relative bg-white border border-black/8 border-l-[3px] ${statusBorderColor[tool.status]} rounded-lg hover:shadow-md hover:border-black/12 transition-all duration-150 w-full min-w-0`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-2.5 h-9">
        <div className="flex items-center gap-1.5 min-w-0">
          <Globe className="w-3.5 h-3.5 text-[#717182] shrink-0" aria-hidden="true" />
          <h3 className="text-[13px] font-semibold text-[#0a0a0a] truncate tracking-tight">
            {tool.name}
          </h3>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <a
            href={tool.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-[#eceef2]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            aria-label={`Open ${tool.name} in new tab`}
          >
            <ExternalLink className="w-2.5 h-2.5 text-[#717182]" aria-hidden="true" />
          </a>
          <button
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-[#eceef2]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            aria-label={`Copy URL for ${tool.name}`}
          >
            <Copy className="w-2.5 h-2.5 text-[#717182]" aria-hidden="true" />
          </button>
          <button
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-[#eceef2]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            aria-label={`More options for ${tool.name}`}
          >
            <MoreHorizontal className="w-2.5 h-2.5 text-[#717182]" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="px-2.5 text-[11px] leading-[14px] text-[#717182] line-clamp-2">
        {tool.description}
      </p>

      {/* Status (screen-reader only text) + Environment tags */}
      <div className="flex flex-wrap gap-1 px-2.5 py-1.5">
        <span className="sr-only">Status: {statusLabel[tool.status]}</span>
        {tool.environments.map((env) => (
          <span
            key={env}
            className={`inline-flex items-center px-1.5 h-4 rounded-full text-[10px] font-normal ${environmentStyles[env].bg} ${environmentStyles[env].text}`}
          >
            {env}
          </span>
        ))}
      </div>
    </article>
  );
}
