"use client";

import React from "react";
import { TechTab } from "@/types";

interface TechTabsProps {
  selected: TechTab;
  onSelect: (tab: TechTab) => void;
}

const techTabs: { id: TechTab; label: string }[] = [
  { id: "health-check", label: "Health Check" },
  { id: "architecture", label: "Architecture" },
  { id: "repositories", label: "Repositories" },
  { id: "swagger-endpoints", label: "Swagger Endpoints" },
  { id: "resources", label: "Resources" },
];

const tabIcons: Record<TechTab, React.ReactNode> = {
  "health-check": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  architecture: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  repositories: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  "swagger-endpoints": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  resources: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  ),
};

export default function TechTabs({ selected, onSelect }: TechTabsProps) {
  return (
    <div className="flex items-center h-9 bg-[rgba(236,236,240,0.5)] rounded-lg p-0.5 overflow-x-auto scrollbar-hide">
      {techTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center gap-1.5 shrink-0 px-2.5 h-8 rounded-md text-xs font-medium transition-colors ${
            tab.id === selected
              ? "bg-white text-[#0a0a0a] shadow-sm"
              : "text-[#717182] hover:text-[#0a0a0a]"
          }`}
        >
          {tabIcons[tab.id]}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
