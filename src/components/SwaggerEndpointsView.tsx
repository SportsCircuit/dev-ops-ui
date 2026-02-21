import React, { useState } from "react";
import { ExternalLink, Code2, Copy } from "lucide-react";
import { Microservice } from "@/types";
import ViewToggle, { type ViewMode } from "@/components/ui/ViewToggle";

interface SwaggerEndpointsViewProps {
  services: Microservice[];
  environment: string;
}

export default function SwaggerEndpointsView({
  services,
  environment,
}: SwaggerEndpointsViewProps) {
  const servicesWithSwagger = services.filter((s) => s.swaggerUrl);
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-3">
      {/* Toggle header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">
          Swagger Endpoints ({servicesWithSwagger.length})
        </h3>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "card" ? (
        /* Card grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {servicesWithSwagger.map((service) => (
            <article
              key={service.id}
              aria-label={`${service.name} API documentation`}
              className="bg-white border border-black/8 rounded-lg shadow-sm flex flex-col"
            >
              {/* Header: Service name + External link */}
              <div className="flex flex-col gap-1 px-3 sm:px-5 pt-4 pb-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-[#0a0a0a] tracking-tight">
                    {service.name}
                  </h3>
                  <a
                    href={service.swaggerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#717182] hover:text-[#0a0a0a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 rounded"
                    aria-label={`Open ${service.name} Swagger docs`}
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
                <p className="text-xs text-[#717182]">{environment} Environment</p>
              </div>

              {/* Badges + URL */}
              <div className="flex flex-col gap-3 px-3 sm:px-5 py-3">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  {service.apiVersion && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f0fdf4] text-[#008236] border border-[#b9f8cf]">
                      {service.apiVersion}
                    </span>
                  )}
                  {service.apiType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#0a0a0a] border border-black/10">
                      {service.apiType}
                    </span>
                  )}
                </div>

                {/* Swagger URL bar */}
                <div className="flex items-center gap-2 bg-[rgba(236,236,240,0.5)] border border-black/8 rounded px-2 py-1.5">
                  <Code2 className="w-3 h-3 text-[#717182] shrink-0" aria-hidden="true" />
                  <span className="text-[11px] text-[#717182] truncate flex-1">
                    {service.swaggerUrl}
                  </span>
                  <button
                    onClick={() => handleCopyUrl(service.swaggerUrl!)}
                    className="text-[#717182] hover:text-[#0a0a0a] transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 rounded"
                    aria-label={`Copy ${service.name} Swagger URL`}
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* List / table view */
        <div className="bg-white border border-black/8 rounded-lg overflow-x-auto" tabIndex={0} role="region" aria-label="Swagger endpoints table">
          <table className="w-full min-w-[600px]">
            <caption className="sr-only">Swagger API endpoints for {environment}</caption>
            <thead>
              <tr className="bg-[rgba(236,236,240,0.5)] border-b border-black/8">
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">Service</th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">API Version</th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">API Type</th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">Swagger URL</th>
              </tr>
            </thead>
            <tbody>
              {servicesWithSwagger.map((service) => (
                <tr key={service.id} className="border-b border-black/8 last:border-b-0 hover:bg-[#f8fafc] transition-colors">
                  <td className="px-3 py-3 text-[13px] font-medium text-[#0a0a0a]">{service.name}</td>
                  <td className="px-3 py-3">
                    {service.apiVersion ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#f0fdf4] text-[#008236] border border-[#b9f8cf]">
                        {service.apiVersion}
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#717182]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {service.apiType ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#0a0a0a] border border-black/10">
                        {service.apiType}
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#717182]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3 h-3 text-[#717182] shrink-0" aria-hidden="true" />
                      <a
                        href={service.swaggerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-[#2b7fff] hover:underline truncate max-w-[240px]"
                      >
                        {service.swaggerUrl}
                      </a>
                      <button
                        onClick={() => handleCopyUrl(service.swaggerUrl!)}
                        className="text-[#717182] hover:text-[#0a0a0a] transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 rounded"
                        aria-label={`Copy ${service.name} Swagger URL`}
                      >
                        <Copy className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <a
                        href={service.swaggerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#717182] hover:text-[#0a0a0a] transition-colors shrink-0"
                        aria-label={`Open ${service.name} Swagger docs`}
                      >
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
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
