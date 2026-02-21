import React from "react";
import type { ServiceStatus } from "@/types";

/** Shared status configuration used by HealthCheckTable and ResourcesView */
export const statusConfig: Record<
  ServiceStatus,
  {
    label: string;
    bg: string;
    border: string;
    text: string;
    icon: React.ReactNode;
  }
> = {
  healthy: {
    label: "Healthy",
    bg: "bg-[#dcfce7]",
    border: "border-[#b9f8cf]",
    text: "text-[#008236]",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  maintenance: {
    label: "Maintenance",
    bg: "bg-[#dbeafe]",
    border: "border-[#bedbff]",
    text: "text-[#1447e6]",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  degraded: {
    label: "Degraded",
    bg: "bg-[#ffedd4]",
    border: "border-[#fed7aa]",
    text: "text-[#9f2d00]",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  down: {
    label: "Down",
    bg: "bg-[#fef2f2]",
    border: "border-[#ffc9c9]",
    text: "text-[#fb2c36]",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};
