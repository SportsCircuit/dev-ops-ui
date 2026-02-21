import { Tool, Category, Environment, ToolStatus } from "@/types";
import { ExternalLink, Globe, Copy, Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ViewMode } from "@/components/ui/ViewToggle";
import ToolCard from "./ToolCard";

const environmentStyles: Record<Environment, { bg: string; text: string }> = {
  Local: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
  Dev: { bg: "bg-[#dbeafe]", text: "text-[#193cb8]" },
  QA: { bg: "bg-[#f3e8ff]", text: "text-[#6e11b0]" },
  Stage: { bg: "bg-[#ffedd4]", text: "text-[#9f2d00]" },
  Prod: { bg: "bg-[#dcfce7]", text: "text-[#016630]" },
};

const statusDot: Record<ToolStatus, string> = {
  healthy: "bg-[#00c950]",
  warning: "bg-[#f0b100]",
  error: "bg-red-500",
  unknown: "bg-gray-300",
};

interface ToolSectionProps {
  category: Category;
  tools: Tool[];
  onDeleteTool?: (id: string) => void;
  onEditTool?: (id: string) => void;
  viewMode?: ViewMode;
}

export default function ToolSection({ category, tools, onDeleteTool, onEditTool, viewMode = "card" }: ToolSectionProps) {
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

      {viewMode === "card" ? (
        /* Cards grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onDelete={onDeleteTool} onEdit={onEditTool} />
          ))}
        </div>
      ) : (
        /* List / table view */
        <div className="bg-white border border-black/8 rounded-lg overflow-x-auto" tabIndex={0} role="region" aria-label={`${category} tools table`}>
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-[rgba(236,236,240,0.5)] border-b border-black/8">
                <th scope="col" className="text-left px-3 py-2 text-xs font-medium text-[#717182]">Name</th>
                <th scope="col" className="text-left px-3 py-2 text-xs font-medium text-[#717182]">Description</th>
                <th scope="col" className="text-left px-3 py-2 text-xs font-medium text-[#717182]">Status</th>
                <th scope="col" className="text-left px-3 py-2 text-xs font-medium text-[#717182]">Environments</th>
                {(onEditTool || onDeleteTool) && (
                  <th scope="col" className="text-right px-3 py-2 text-xs font-medium text-[#717182]">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <ToolListRow
                  key={tool.id}
                  tool={tool}
                  onEdit={onEditTool}
                  onDelete={onDeleteTool}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ─── Inline list-row sub-component ───────────────────── */

function ToolListRow({
  tool,
  onEdit,
  onDelete,
}: {
  tool: Tool;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
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
    <tr className="border-b border-black/8 last:border-b-0 hover:bg-[#f8fafc] transition-colors">
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="w-3.5 h-3.5 text-[#717182] shrink-0" aria-hidden="true" />
          <a
            href={tool.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-[#0a0a0a] hover:text-[#2b7fff] truncate max-w-[180px]"
          >
            {tool.name}
          </a>
          <button
            onClick={handleCopyUrl}
            className="shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-[#eceef2]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            aria-label={copied ? "URL copied" : `Copy URL for ${tool.name}`}
          >
            {copied ? (
              <Check className="w-2.5 h-2.5 text-emerald-500" aria-hidden="true" />
            ) : (
              <Copy className="w-2.5 h-2.5 text-[#717182]" aria-hidden="true" />
            )}
          </button>
        </div>
      </td>
      <td className="px-3 py-2.5 text-[12px] text-[#717182] max-w-[200px] truncate">
        {tool.description}
      </td>
      <td className="px-3 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[12px] text-[#717182] capitalize">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[tool.status]}`} />
          {tool.status}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex flex-wrap gap-1">
          {tool.environments.map((env) => (
            <span
              key={env}
              className={`inline-flex items-center px-1.5 h-4 rounded-full text-[10px] font-normal ${environmentStyles[env].bg} ${environmentStyles[env].text}`}
            >
              {env}
            </span>
          ))}
        </div>
      </td>
      {(onEdit || onDelete) && (
        <td className="px-3 py-2.5 text-right">
          <div className="relative inline-flex" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[#717182] hover:text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
              aria-label={`More options for ${tool.name}`}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <MoreHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 top-full mt-1 w-32 bg-white border border-black/8 rounded-lg shadow-lg z-20 py-1">
                {onEdit && (
                  <button role="menuitem" onClick={() => { setMenuOpen(false); onEdit(tool.id); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-xs text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors">
                    <Pencil className="w-3 h-3" aria-hidden="true" /> Edit
                  </button>
                )}
                {onDelete && (
                  <button role="menuitem" onClick={() => { setMenuOpen(false); onDelete(tool.id); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-left text-xs text-[#d4183d] hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3 h-3" aria-hidden="true" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
