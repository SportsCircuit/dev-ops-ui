"use client";

import React from "react";
import { ExternalLink, Code2, Copy } from "lucide-react";
import { Microservice } from "@/types";

interface SwaggerEndpointsViewProps {
  services: Microservice[];
  environment: string;
}

export default function SwaggerEndpointsView({
  services,
  environment,
}: SwaggerEndpointsViewProps) {
  const servicesWithSwagger = services.filter((s) => s.swaggerUrl);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {servicesWithSwagger.map((service) => (
        <div
          key={service.id}
          className="bg-white border border-black/8 rounded-lg shadow-sm flex flex-col"
        >
          {/* Header: Service name + External link */}
          <div className="flex flex-col gap-1 px-5 pt-4 pb-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-[#0a0a0a] tracking-tight">
                {service.name}
              </h3>
              <a
                href={service.swaggerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#717182] hover:text-[#0a0a0a] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-[#717182]">{environment} Environment</p>
          </div>

          {/* Badges + URL */}
          <div className="flex flex-col gap-3 px-5 py-3">
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
              <Code2 className="w-3 h-3 text-[#717182] shrink-0" />
              <span className="text-[11px] text-[#717182] truncate flex-1">
                {service.swaggerUrl}
              </span>
              <button
                onClick={() => handleCopyUrl(service.swaggerUrl!)}
                className="text-[#717182] hover:text-[#0a0a0a] transition-colors shrink-0"
                title="Copy URL"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
