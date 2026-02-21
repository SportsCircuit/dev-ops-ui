"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Settings2, Plus } from "lucide-react";
import { Category, Environment, Tool } from "@/types";
import { fetchTools, fetchCategories, createTool, CategoryRow } from "@/lib/api";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import ToolSection from "@/components/ToolSection";
import AddLinkModal from "@/components/AddLinkModal";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "All"
  >("Prod");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [toolsList, setToolsList] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [toolsData, categoriesData] = await Promise.all([
        fetchTools(),
        fetchCategories(),
      ]);
      setToolsList(toolsData);
      setCategories(categoriesData.map((c: CategoryRow) => c.name as Category));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter tools by search, category, and environment
  const filteredTools = useMemo(() => {
    return toolsList.filter((tool) => {
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
  }, [search, selectedCategory, selectedEnvironment, toolsList]);

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
      <div className="sticky top-0 z-10 bg-[#f8fafc]/80 backdrop-blur-sm border-b border-black/8">
        <div className="px-3 sm:px-5 pt-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">
              Quick Links
            </h2>
            <div className="flex items-center gap-2 shrink-0">
              <button
                className="p-1.5 rounded-md hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                aria-label="Settings"
              >
                <Settings2 className="w-3.5 h-3.5 text-[#717182]" aria-hidden="true" />
              </button>
              <button
                onClick={() => setAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-md border border-black/8 text-xs font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
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
      <main
        id="main-content"
        className="flex-1 overflow-y-auto bg-[#f8fafc] px-3 sm:px-5 pt-4 pb-8"
        aria-busy={loading}
      >
        <div className="space-y-5" role="region" aria-label="Tool listings">
          {loading ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center justify-center py-20 text-[#717182]"
            >
              <p className="text-sm">Loading tools...</p>
            </div>
          ) : displayCategories.length > 0 ? (
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

      {/* Add Link Modal */}
      <AddLinkModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        categories={categories}
        onSubmit={async (data) => {
          try {
            const created = await createTool({
              name: data.title,
              description: data.description,
              category: data.category,
              environments: data.environments,
              status: "healthy",
              url: data.url,
            });
            setToolsList((prev) => [created, ...prev]);
          } catch (error) {
            console.error("Failed to create tool:", error);
          }
        }}
      />
    </div>
  );
}
