import React, { useState } from "react";
import { Microservice } from "@/types";
import { statusConfig } from "@/lib/constants";
import ViewToggle, { type ViewMode } from "@/components/ui/ViewToggle";

interface ResourcesViewProps {
  services: Microservice[];
  environment: string;
}

export default function ResourcesView({
  services,
  environment,
}: ResourcesViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <div className="bg-white border border-black/8 rounded-lg shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-5 pb-3 gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
            Service Resources
          </h3>
          <p className="text-xs text-[#717182] mt-0.5">
            Infrastructure and cloud resources usage for {environment}.
          </p>
        </div>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "list" ? (
        /* Table view */
        <div className="mx-3 sm:mx-5 mb-5 border border-black/8 rounded-lg overflow-x-auto" tabIndex={0} role="region" aria-label="Resource usage data">
          <table className="w-full min-w-[560px]">
            <caption className="sr-only">Service resource usage for {environment}</caption>
            <thead>
              <tr className="bg-[rgba(236,236,240,0.5)] border-b border-black/8">
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Service
                </th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  CPU
                </th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Memory
                </th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Pods
                </th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const config = statusConfig[service.status];
                return (
                  <tr
                    key={service.id}
                    className="border-b border-black/8 last:border-b-0 hover:bg-[#f8fafc] transition-colors"
                  >
                    {/* Service name + owner */}
                    <td className="px-3 py-3">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-[#0a0a0a]">
                          {service.name}
                        </span>
                        <span className="text-[11px] font-medium text-[#717182]">
                          {service.owner}
                        </span>
                      </div>
                    </td>
                    {/* CPU */}
                    <td className="px-3 py-3 text-[13px] text-[#717182]">
                      {service.cpu ?? "—"}
                    </td>
                    {/* Memory */}
                    <td className="px-3 py-3 text-[13px] text-[#717182]">
                      {service.memory ?? "—"}
                    </td>
                    {/* Pods */}
                    <td className="px-3 py-3 text-[13px] text-[#717182]">
                      {service.pods ?? "—"}
                    </td>
                    {/* Status badge */}
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.border} ${config.text}`}
                      >
                        {config.icon}
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card view */
        <div className="px-3 sm:px-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {services.map((service) => {
              const config = statusConfig[service.status];
              return (
                <article
                  key={service.id}
                  className={`bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3 ${config.border}`}
                  aria-label={`${service.name} resources`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-semibold text-[#0a0a0a] truncate">{service.name}</h4>
                      <p className="text-[11px] text-[#717182] mt-0.5">{service.owner}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${config.bg} ${config.border} ${config.text}`}
                    >
                      {config.icon}
                      {config.label}
                    </span>
                  </div>

                  {/* Resource metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#f8fafc] rounded-md p-2 text-center">
                      <p className="text-[10px] text-[#717182] uppercase tracking-wide">CPU</p>
                      <p className="text-[13px] font-semibold text-[#0a0a0a] mt-0.5">{service.cpu ?? "—"}</p>
                    </div>
                    <div className="bg-[#f8fafc] rounded-md p-2 text-center">
                      <p className="text-[10px] text-[#717182] uppercase tracking-wide">Memory</p>
                      <p className="text-[13px] font-semibold text-[#0a0a0a] mt-0.5">{service.memory ?? "—"}</p>
                    </div>
                    <div className="bg-[#f8fafc] rounded-md p-2 text-center">
                      <p className="text-[10px] text-[#717182] uppercase tracking-wide">Pods</p>
                      <p className="text-[13px] font-semibold text-[#0a0a0a] mt-0.5">{service.pods ?? "—"}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
