import { useState } from "react";
import { ExternalLink, GitBranch } from "lucide-react";
import { Microservice } from "@/types";
import ViewToggle, { type ViewMode } from "@/components/ui/ViewToggle";

interface RepositoriesViewProps {
  services: Microservice[];
}

export default function RepositoriesView({
  services,
}: RepositoriesViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  return (
    <div className="space-y-3">
      {/* Toggle header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">
          Repositories ({services.length})
        </h3>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "card" ? (
        /* Card grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((service) => (
            <article
              key={service.id}
              aria-label={`${service.name} repository`}
              className="bg-white border border-black/8 rounded-lg shadow-sm flex flex-col"
            >
              {/* Header: name + external link */}
              <div className="px-3 sm:px-5 pt-4 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-[#0a0a0a] tracking-tight">
                    {service.name}
                  </h3>
                  {service.repoUrl && (
                    <a
                      href={service.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#717182] hover:text-[#0a0a0a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 rounded"
                      aria-label={`Open ${service.name} repository`}
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-[#717182]">{service.owner}</p>
              </div>

              {/* Description + repo URL */}
              <div className="px-3 sm:px-5 pt-2 pb-4 space-y-3 flex-1 flex flex-col">
                {service.description && (
                  <p className="text-xs text-[#717182] line-clamp-2">
                    {service.description}
                  </p>
                )}

                {service.repoUrl && (
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[rgba(236,236,240,0.5)] border border-black/8 mt-auto">
                    <GitBranch className="w-3 h-3 text-[#717182] shrink-0" aria-hidden="true" />
                    <span className="text-[11px] text-[#717182] truncate">
                      {service.repoUrl}
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* List / table view */
        <div className="bg-white border border-black/8 rounded-lg overflow-x-auto" tabIndex={0} role="region" aria-label="Repositories table">
          <table className="w-full min-w-[560px]">
            <caption className="sr-only">Code repositories</caption>
            <thead>
              <tr className="bg-[rgba(236,236,240,0.5)] border-b border-black/8">
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">Name</th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">Owner</th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">Description</th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">Repository</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-black/8 last:border-b-0 hover:bg-[#f8fafc] transition-colors">
                  <td className="px-3 py-3 text-[13px] font-medium text-[#0a0a0a]">{service.name}</td>
                  <td className="px-3 py-3 text-[13px] text-[#717182]">{service.owner}</td>
                  <td className="px-3 py-3 text-[12px] text-[#717182] max-w-[200px] truncate">{service.description}</td>
                  <td className="px-3 py-3">
                    {service.repoUrl ? (
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-3 h-3 text-[#717182] shrink-0" aria-hidden="true" />
                        <a
                          href={service.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] text-[#2b7fff] hover:underline truncate max-w-[200px]"
                        >
                          {service.repoUrl}
                        </a>
                        <a
                          href={service.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#717182] hover:text-[#0a0a0a] transition-colors shrink-0"
                          aria-label={`Open ${service.name} repository`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#717182]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
