import React from "react";
import { Microservice, ServiceStatus } from "@/types";

interface HealthCheckTableProps {
  services: Microservice[];
  environment: string;
}

const statusConfig: Record<
  ServiceStatus,
  { label: string; bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  healthy: {
    label: "Healthy",
    bg: "bg-[#dcfce7]",
    border: "border-[#b9f8cf]",
    text: "text-[#008236]",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  maintenance: {
    label: "Maintenance",
    bg: "bg-[#dbeafe]",
    border: "border-[#bedbff]",
    text: "text-[#1447e6]",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  degraded: {
    label: "Degraded",
    bg: "bg-[#ffedd4]",
    border: "border-[#fed7aa]",
    text: "text-[#9f2d00]",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  down: {
    label: "Down",
    bg: "bg-[#fef2f2]",
    border: "border-[#ffc9c9]",
    text: "text-[#fb2c36]",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function HealthCheckTable({
  services,
  environment,
}: HealthCheckTableProps) {
  return (
    <div className="bg-white border border-black/8 rounded-lg shadow-sm">
      {/* Card header */}
      <div className="px-5 pt-5 pb-3 space-y-1">
        <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
          System Health Matrix ({environment})
        </h3>
        <p className="text-xs text-[#717182]">
          Real-time health status for {environment} environment.
        </p>
      </div>

      {/* Table */}
      <div className="px-5 pb-5">
        <div className="border border-black/8 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[rgba(236,236,240,0.5)] border-b border-black/8">
                <th className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Service Name
                </th>
                <th className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Owner
                </th>
                <th className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                  Version
                </th>
                <th className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
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
