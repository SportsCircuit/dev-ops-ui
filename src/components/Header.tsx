"use client";

import { ChevronDown, Globe } from "lucide-react";
import { Environment } from "@/types";
import { useState } from "react";

interface HeaderProps {
  selectedEnvironment: Environment | "All";
  onEnvironmentChange: (env: Environment | "All") => void;
}

const environments: (Environment | "All")[] = ["All", "Dev", "QA", "Stage", "Prod"];

export default function Header({
  selectedEnvironment,
  onEnvironmentChange,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-black/10 shadow-sm">
      <h1 className="text-lg font-semibold capitalize text-[#0a0a0a]">
        Dashboard
      </h1>

      <div className="flex items-center">
        <div className="flex items-center gap-2 h-10 px-2 border border-black/10 rounded-lg bg-white">
          <Globe className="w-4 h-4 text-[#717182]" />
          <span className="text-sm font-medium text-[#717182]">
            Environment:
          </span>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between gap-2 h-8 px-3 rounded-lg text-sm font-medium text-[#0a0a0a] hover:bg-gray-50 min-w-[90px]"
            >
              <span>{selectedEnvironment}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-black/10 rounded-lg shadow-lg z-20">
                {environments.map((env) => (
                  <button
                    key={env}
                    onClick={() => {
                      onEnvironmentChange(env);
                      setOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#eceef2]/50 first:rounded-t-lg last:rounded-b-lg ${
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
