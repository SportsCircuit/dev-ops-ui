"use client";

import { ChevronDown, Globe } from "lucide-react";
import { Environment } from "@/types";
import { useState } from "react";

interface HeaderProps {
  title?: string;
  selectedEnvironment: Environment | "All";
  onEnvironmentChange: (env: Environment | "All") => void;
}

const environments: (Environment | "All")[] = ["All", "Dev", "QA", "Stage", "Prod"];

export default function Header({
  title = "dashboard",
  selectedEnvironment,
  onEnvironmentChange,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-12 px-5 bg-white border-b border-black/8">
      <h1 className="text-sm font-semibold text-[#0a0a0a] capitalize">
        {title}
      </h1>

      <div className="flex items-center">
        <div className="flex items-center gap-1.5 h-8 px-2 border border-black/8 rounded-lg bg-white">
          <Globe className="w-3.5 h-3.5 text-[#717182]" />
          <span className="text-xs font-medium text-[#717182]">
            Environment:
          </span>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between gap-1.5 h-7 px-2 rounded-md text-xs font-medium text-[#0a0a0a] hover:bg-gray-50 min-w-[80px]"
            >
              <span>{selectedEnvironment}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-black/8 rounded-lg shadow-lg z-20">
                {environments.map((env) => (
                  <button
                    key={env}
                    onClick={() => {
                      onEnvironmentChange(env);
                      setOpen(false);
                    }}
                    className={`block w-full px-2.5 py-1.5 text-left text-xs hover:bg-[#eceef2]/50 first:rounded-t-lg last:rounded-b-lg ${
                      env === selectedEnvironment
                        ? "font-medium text-[#030213] bg-[#eceef2]/30"
                        : "text-[#717182]"
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
