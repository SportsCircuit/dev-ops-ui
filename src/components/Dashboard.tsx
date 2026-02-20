"use client";

import { useState, useMemo } from "react";
import { Settings2, Plus } from "lucide-react";
import { Category, Environment } from "@/types";
import { tools, categories } from "@/data/tools";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import ToolSection from "@/components/ToolSection";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "All"
  >("Prod");

  // Filter tools by search, category, and environment
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        search === "" ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;

      const matchesEnv =
        selectedEnvironment === "All" ||
        tool.environments.includes(selectedEnvironment as Environment);

      return matchesSearch && matchesCategory && matchesEnv;
    });
  }, [search, selectedCategory, selectedEnvironment]);

  // Group filtered tools by category
  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof filteredTools> = {};
    for (const tool of filteredTools) {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    }
    return groups;
  }, [filteredTools]);

  // Determine which categories to display (preserve order from categories array)
  const displayCategories = categories.filter(
    (cat) => cat !== "All" && cat !== "Observability" && groupedTools[cat]
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
      />

      {/* Sticky sub-header with search + tabs */}
      <div className="sticky top-0 z-10 bg-white/60 backdrop-blur-sm border-b border-black/10 shadow-sm">
        <div className="px-6 pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0a0a0a] tracking-tight">
              Quick Links
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[#eceef2]/50 transition-colors">
                <Settings2 className="w-4 h-4 text-[#717182]" />
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border border-black/10 text-sm font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add Link
              </button>
            </div>
          </div>
          <SearchBar value={search} onChange={setSearch} />
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Tool sections */}
      <main className="flex-1 overflow-y-auto bg-white px-6 pt-6 pb-12">
        <div className="space-y-8">
          {displayCategories.length > 0 ? (
            displayCategories.map((cat) => (
              <ToolSection
                key={cat}
                category={cat}
                tools={groupedTools[cat]}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-[#717182]">
              <p className="text-sm">No tools match your current filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
