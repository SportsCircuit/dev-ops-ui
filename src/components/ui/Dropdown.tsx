"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  /** Currently selected value */
  value: string;
  /** Callback when a new value is selected */
  onChange: (value: string) => void;
  /** Options to display */
  options: DropdownOption[];
  /** Accessible label for the dropdown */
  ariaLabel: string;
  /** Additional class name for the trigger button */
  triggerClassName?: string;
  /** Placeholder when no value is selected */
  placeholder?: string;
  /** Position of the dropdown panel */
  position?: "top" | "bottom";
}

/**
 * Accessible dropdown/listbox with keyboard navigation,
 * ARIA attributes, and outside-click handling.
 */
export default function Dropdown({
  value,
  onChange,
  options,
  ariaLabel,
  triggerClassName = "",
  placeholder = "Select...",
  position = "bottom",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset active index when opening
  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [open, options, value]);

  // Scroll active item into view
  useEffect(() => {
    if (open && listRef.current && activeIndex >= 0) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (open && activeIndex >= 0) {
            onChange(options[activeIndex].value);
            setOpen(false);
          } else {
            setOpen(true);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!open) {
            setOpen(true);
          } else {
            setActiveIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!open) {
            setOpen(true);
          } else {
            setActiveIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1
            );
          }
          break;
        case "Home":
          e.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIndex(options.length - 1);
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
    [open, activeIndex, options, onChange]
  );

  const listId = `dropdown-list-${ariaLabel.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        aria-activedescendant={
          open && activeIndex >= 0
            ? `${listId}-option-${activeIndex}`
            : undefined
        }
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={`flex items-center justify-between w-full text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40 ${triggerClassName}`}
      >
        <span className={value ? "" : "text-[#717182]"}>{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#717182] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute left-0 w-full bg-white border border-black/10 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto ${
            position === "top" ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((option, idx) => (
            <button
              key={option.value}
              id={`${listId}-option-${idx}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`block w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                idx === activeIndex ? "bg-[#eceef2]/50" : ""
              } ${
                option.value === value
                  ? "font-medium text-[#030213]"
                  : "text-[#717182]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
