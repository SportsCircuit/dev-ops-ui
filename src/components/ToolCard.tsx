import { useState, useRef, useEffect } from "react";
import { ExternalLink, Copy, MoreHorizontal, Globe, Trash2, Pencil, Check } from "lucide-react";
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
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function ToolCard({ tool, onDelete, onEdit }: ToolCardProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCopyUrl = async () => {
    if (tool.url) {
      await navigator.clipboard.writeText(tool.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);
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
            onClick={handleCopyUrl}
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-[#eceef2]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            aria-label={copied ? "URL copied" : `Copy URL for ${tool.name}`}
          >
            {copied ? (
              <Check className="w-2.5 h-2.5 text-emerald-500" aria-hidden="true" />
            ) : (
              <Copy className="w-2.5 h-2.5 text-[#717182]" aria-hidden="true" />
            )}
          </button>
          <div className="relative" ref={menuRef}>
            {(onEdit || onDelete) && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-[#eceef2]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
              aria-label={`More options for ${tool.name}`}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <MoreHorizontal className="w-2.5 h-2.5 text-[#717182]" aria-hidden="true" />
            </button>
            )}
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 w-32 bg-white border border-black/8 rounded-lg shadow-lg z-20 py-1"
              >
                {onEdit && (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(tool.id);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-xs text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors"
                  >
                    <Pencil className="w-3 h-3" aria-hidden="true" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(tool.id);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-xs text-[#d4183d] hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" aria-hidden="true" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
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
