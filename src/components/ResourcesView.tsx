"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Microservice, ServiceStatus } from "@/types";

interface ResourcesViewProps {
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
    icon: <CheckCircle2 className="w-4 h-4 text-[#008236]" />,
  },
  maintenance: {
    label: "Maintenance",
    bg: "bg-[#dbeafe]",
    border: "border-[#bedbff]",
    text: "text-[#1447e6]",
    icon: <AlertTriangle className="w-4 h-4 text-[#1447e6]" />,
  },
  degraded: {
    label: "Degraded",
    bg: "bg-[#fef3c7]",
    border: "border-[#fde68a]",
    text: "text-[#d97706]",
    icon: <AlertTriangle className="w-4 h-4 text-[#d97706]" />,
  },
  down: {
    label: "Down",
    bg: "bg-[#ffe2e2]",
    border: "border-[#ffc9c9]",
    text: "text-[#c10007]",
    icon: <XCircle className="w-4 h-4 text-[#c10007]" />,
  },
};

export default function ResourcesView({
  services,
  environment,
}: ResourcesViewProps) {
  return (
    <div className="bg-white border border-black/8 rounded-lg shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
          Service Resources
        </h3>
        <p className="text-xs text-[#717182] mt-0.5">
          Infrastructure and cloud resources usage for {environment}.
        </p>
      </div>

      {/* Table */}
      <div className="mx-5 mb-5 border border-black/8 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[rgba(236,236,240,0.5)] border-b border-black/8">
              <th className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                Service
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                CPU
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                Memory
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-[#717182]">
                Pods
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
