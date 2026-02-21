import React from "react";
import { Microservice, ServiceStatus } from "@/types";
import { statusConfig } from "@/lib/constants";

interface HealthCheckTableProps {
  services: Microservice[];
  environment: string;
}

export default function HealthCheckTable({
  services,
  environment,
}: HealthCheckTableProps) {
  return (
    <div className="bg-white border border-black/8 rounded-lg shadow-sm">
      {/* Card header */}
      <div className="px-3 sm:px-5 pt-5 pb-3 space-y-1">
        <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
          System Health Matrix ({environment})
        </h3>
        <p className="text-xs text-[#717182]">
          Real-time health status for {environment} environment.
        </p>
      </div>

      {/* Table */}
      <div className="px-3 sm:px-5 pb-5">
        <div className="border border-black/8 rounded-lg overflow-x-auto" tabIndex={0} role="region" aria-label="Health check data">
          <table className="w-full min-w-[480px]">
            <caption className="sr-only">Service health status for {environment}</caption>
            <thead>
              <tr className="bg-[rgba(236,236,240,0.5)] border-b border-black/8">
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Service Name
                </th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Owner
                </th>
                <th scope="col" className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Version
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
                    <td className="px-3 py-3 text-[13px] font-medium text-[#0a0a0a]">
                      {service.name}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-[#717182]">
                      {service.owner}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-[#717182]">
                        {service.version}
                      </span>
                    </td>
                    <td className="px-4 py-4">
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
    </div>
  );
}
