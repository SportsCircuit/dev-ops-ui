import { useState, useMemo, useEffect, useCallback } from "react";
import { Settings2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Category, Environment, Tool } from "@/types";
import { fetchTools, fetchCategories, createTool, updateTool, deleteTool, CategoryRow } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import ToolSection from "@/components/ToolSection";
import AddLinkModal from "@/components/AddLinkModal";
import Modal from "@/components/ui/Modal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "All"
  >("Prod");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [toolsList, setToolsList] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Tool | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
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
      const msg = error instanceof Error ? error.message : "Failed to load dashboard data.";
      console.error("Failed to load dashboard data:", msg, error);
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

  const handleEditTool = (id: string) => {
    const tool = toolsList.find((t) => t.id === id);
    if (tool) setEditingTool(tool);
  };

  const handleUpdateTool = async (data: { title: string; url: string; category: Category; environments: Environment[]; description: string }) => {
    if (!editingTool) return;
    try {
      const updated = await updateTool(editingTool.id, {
        name: data.title,
        description: data.description,
        category: data.category,
        environments: data.environments,
        url: data.url,
      });
      setToolsList((prev) => prev.map((t) => (t.id === editingTool.id ? updated : t)));
      setEditingTool(null);
      showFeedback("success", `Tool "${data.title}" updated.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update tool.";
      console.error("Failed to update tool:", msg, error);
      showFeedback("error", msg);
    }
  };

  const handleDeleteTool = (id: string) => {
    const tool = toolsList.find((t) => t.id === id);
    if (tool) setDeleteTarget(tool);
  };

  const confirmDeleteTool = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTool(deleteTarget.id);
      setToolsList((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      showFeedback("success", `Tool "${deleteTarget.name}" deleted.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete tool.";
      console.error("Failed to delete tool:", msg, error);
      showFeedback("error", msg);
    } finally {
      setDeleteTarget(null);
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

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
                onClick={() => navigate("/settings")}
                className="p-1.5 rounded-md hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                aria-label="Settings"
              >
                <Settings2 className="w-3.5 h-3.5 text-[#717182]" aria-hidden="true" />
              </button>
              {isAdmin && (
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-md border border-black/8 text-xs font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Add Link
                </button>
              )}
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
                onEditTool={isAdmin ? handleEditTool : undefined}
                onDeleteTool={isAdmin ? handleDeleteTool : undefined}
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
            setAddModalOpen(false);
            showFeedback("success", `Tool "${data.title}" created.`);
          } catch (error) {
            const msg = error instanceof Error ? error.message : "Failed to create tool.";
            console.error("Failed to create tool:", msg, error);
            showFeedback("error", msg);
          }
        }}
      />

      {/* Edit Link Modal */}
      <AddLinkModal
        open={!!editingTool}
        onClose={() => setEditingTool(null)}
        categories={categories}
        onSubmit={handleUpdateTool}
        initialData={
          editingTool
            ? {
                title: editingTool.name,
                url: editingTool.url || "",
                category: editingTool.category,
                environments: editingTool.environments,
                description: editingTool.description,
              }
            : undefined
        }
      />

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback.message}
        </div>
      )}

      {/* Delete Tool Confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Tool"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      >
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-3.5 h-9 rounded-lg border border-black/8 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteTool}
            className="px-3.5 h-9 rounded-lg bg-[#d4183d] text-[13px] font-medium text-white hover:bg-[#c10007] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
