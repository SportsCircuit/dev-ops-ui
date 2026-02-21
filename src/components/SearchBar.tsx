"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#717182]" />
      <input
        type="text"
        placeholder="Search tools, services..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-black/8 rounded-lg placeholder:text-[#717182]/60 text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/15 focus:border-[#2b7fff]/30 transition-colors"
      />
    </div>
  );
}
