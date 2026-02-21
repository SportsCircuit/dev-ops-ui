"use client";

import React, { useState } from "react";
import {
  Database,
  HardDrive,
  Box,
  MessageSquare,
  Cloud,
  Globe,
  LayoutGrid,
  GitFork,
} from "lucide-react";
import { DependencyType, Microservice } from "@/types";

interface ArchitectureViewProps {
  services: Microservice[];
}

type ViewMode = "cards" | "graph";

const dependencyIconMap: Record<DependencyType, React.ReactNode> = {
  Database: <Database className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />,
  Cache: <HardDrive className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />,
  External: <Globe className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />,
  Microservice: <Box className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />,
  MessageQueue: <MessageSquare className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />,
  Storage: <Cloud className="w-3.5 h-3.5 text-yellow-600" aria-hidden="true" />,
};

export default function ArchitectureView({
  services,
}: ArchitectureViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  return (
    <div className="space-y-3">
      {/* View toggle */}
      <div className="flex justify-end">
        <div
          className="inline-flex items-center border border-black/10 rounded-lg bg-[rgba(236,236,240,0.5)] p-1"
          role="group"
          aria-label="View mode"
        >
          <button
            onClick={() => setViewMode("cards")}
            aria-pressed={viewMode === "cards"}
            aria-label="Card view"
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 ${
              viewMode === "cards"
                ? "bg-white shadow-sm text-[#0a0a0a]"
                : "text-[#717182] hover:text-[#0a0a0a]"
            }`}
          >
            <LayoutGrid className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => setViewMode("graph")}
            aria-pressed={viewMode === "graph"}
            aria-label="Graph view"
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 ${
              viewMode === "graph"
                ? "bg-white shadow-sm text-[#0a0a0a]"
                : "text-[#717182] hover:text-[#0a0a0a]"
            }`}
          >
            <GitFork className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Service cards */}
      {viewMode === "cards" && (
        <div className="space-y-6">
          {services.map((service) => (
            <article
              key={service.id}
              aria-label={`${service.name} architecture`}
              className="bg-white border border-black/8 rounded-lg shadow-sm"
            >
              {/* Service header */}
              <div className="px-3 sm:px-5 py-4 space-y-1">
                <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="text-sm text-[#717182]">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Service details */}
              <div className="px-3 sm:px-5 pb-5 space-y-4">
                {/* Tech Stack */}
                {service.techStack && service.techStack.length > 0 && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-medium text-[#717182]">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies">
                      {service.techStack.map((tech) => (
                        <span
                          key={tech}
                          role="listitem"
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#eceef2] text-[#030213]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dependencies */}
                {service.dependencies && service.dependencies.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#717182]">
                      Dependencies
                    </p>
                    <div className="space-y-1.5" role="list" aria-label="Service dependencies">
                      {service.dependencies.map((dep) => (
                        <div
                          key={dep.name}
                          role="listitem"
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-md border border-black/8 bg-[rgba(236,236,240,0.3)]"
                        >
                          <div className="flex items-center gap-2">
                            {dependencyIconMap[dep.type]}
                            <span className="text-[13px] font-medium text-[#0a0a0a]">
                              {dep.name}
                            </span>
                          </div>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] text-[#717182] bg-white border border-black/8">
                            {dep.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Graph view placeholder */}
      {viewMode === "graph" && (
        <div className="flex items-center justify-center py-20 text-[#717182]">
          <p className="text-sm">Graph view coming soon.</p>
        </div>
      )}
    </div>
  );
}
