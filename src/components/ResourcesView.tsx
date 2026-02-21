import React from "react";
import { Microservice } from "@/types";
import { statusConfig } from "@/lib/constants";

interface ResourcesViewProps {
  services: Microservice[];
  environment: string;
}

export default function ResourcesView({
  services,
  environment,
}: ResourcesViewProps) {
  return (
    <div className="bg-white border border-black/8 rounded-lg shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-3 sm:px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
          Service Resources
        </h3>
        <p className="text-xs text-[#717182] mt-0.5">
          Infrastructure and cloud resources usage for {environment}.
        </p>
      </div>

      {/* Table */}
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
    </div>
  );
}
