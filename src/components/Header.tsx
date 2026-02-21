import { ChevronDown, Globe } from "lucide-react";
import { Environment } from "@/types";
import { useState, useRef, useEffect, useCallback } from "react";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveIndex(environments.indexOf(selectedEnvironment));
    }
  }, [open, selectedEnvironment]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (open && activeIndex >= 0) {
            onEnvironmentChange(environments[activeIndex]);
            setOpen(false);
          } else {
            setOpen(true);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!open) setOpen(true);
          else setActiveIndex((p) => (p < environments.length - 1 ? p + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!open) setOpen(true);
          else setActiveIndex((p) => (p > 0 ? p - 1 : environments.length - 1));
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "Tab":
          setOpen(false);
          break;
      }
    },
    [open, activeIndex, onEnvironmentChange]
  );

  return (
    <header className="flex items-center justify-between h-12 px-3 sm:px-5 bg-white border-b border-black/8">
      <h1 className="text-sm font-semibold text-[#0a0a0a] capitalize truncate">
        {title}
      </h1>

      <div className="flex items-center shrink-0">
        <div
          ref={containerRef}
          className="flex items-center gap-1.5 h-8 px-2 border border-black/8 rounded-lg bg-white"
        >
          <Globe className="w-3.5 h-3.5 text-[#717182] hidden sm:block" aria-hidden="true" />
          <span className="text-xs font-medium text-[#717182] hidden sm:inline">
            Environment:
          </span>
          <div className="relative">
            <button
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls="env-listbox"
              aria-label="Select environment"
              onClick={() => setOpen(!open)}
              onKeyDown={handleKeyDown}
              className="flex items-center justify-between gap-1.5 h-7 px-2 rounded-md text-xs font-medium text-[#0a0a0a] hover:bg-gray-50 min-w-[60px] sm:min-w-[80px] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            >
              <span>{selectedEnvironment}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {open && (
              <div
                id="env-listbox"
                role="listbox"
                aria-label="Environment"
                className="absolute right-0 top-full mt-1 w-28 bg-white border border-black/8 rounded-lg shadow-lg z-20"
              >
                {environments.map((env, idx) => (
                  <button
                    key={env}
                    role="option"
                    aria-selected={env === selectedEnvironment}
                    onClick={() => {
                      onEnvironmentChange(env);
                      setOpen(false);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`block w-full px-2.5 py-1.5 text-left text-xs first:rounded-t-lg last:rounded-b-lg ${
                      idx === activeIndex ? "bg-[#eceef2]/50" : ""
                    } ${
                      env === selectedEnvironment
                        ? "font-medium text-[#030213]"
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
