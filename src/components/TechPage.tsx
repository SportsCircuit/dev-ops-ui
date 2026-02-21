import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Environment, Microservice, TechTab } from "@/types";
import { fetchMicroservices, createMicroservice, updateMicroservice, deleteMicroservice } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import TechTabs from "@/components/TechTabs";
import HealthCheckTable from "@/components/HealthCheckTable";
import ArchitectureView from "@/components/ArchitectureView";
import RepositoriesView from "@/components/RepositoriesView";
import SwaggerEndpointsView from "@/components/SwaggerEndpointsView";
import ResourcesView from "@/components/ResourcesView";
import AddServiceModal, {
  NewServiceData,
} from "@/components/AddServiceModal";
import Modal from "@/components/ui/Modal";

export default function TechPage() {
  const { isAdmin } = useAuth();
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "All"
  >("Prod");
  const [selectedTab, setSelectedTab] = useState<TechTab>("health-check");
  const [servicesList, setServicesList] = useState<Microservice[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Microservice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Microservice | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMicroservices();
      setServicesList(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to load microservices.";
      console.error("Failed to load microservices:", msg, error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const envLabel =
    selectedEnvironment === "All" ? "All Environments" : selectedEnvironment;

  const handleAddService = async (data: NewServiceData) => {
    try {
      const created = await createMicroservice({
        name: data.name,
        owner: data.owner,
        version: data.version ? `v${data.version.replace(/^v/, "")}` : "v1.0.0",
        status: "healthy",
        description: data.description || undefined,
        techStack: data.techStack
          ? data.techStack.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        repoUrl: data.repoUrl || undefined,
        swaggerUrl: data.swaggerUrl || undefined,
        pods: data.instances || undefined,
        dependencies: data.dependencies?.length
          ? data.dependencies.map((d) => ({ name: d.name, type: d.type as import("@/types").DependencyType }))
          : undefined,
      });
      setServicesList((prev) => [created, ...prev]);
      setAddModalOpen(false);
      showFeedback("success", `Service "${data.name}" created.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to create microservice.";
      console.error("Failed to create microservice:", msg, error);
      showFeedback("error", msg);
    }
  };

  const handleEditService = (id: string) => {
    const svc = servicesList.find((s) => s.id === id);
    if (svc) setEditingService(svc);
  };

  const handleUpdateService = async (data: NewServiceData) => {
    if (!editingService) return;
    try {
      const updated = await updateMicroservice(editingService.id, {
        name: data.name,
        owner: data.owner,
        version: data.version ? `v${data.version.replace(/^v/, "")}` : undefined,
        description: data.description || undefined,
        techStack: data.techStack
          ? data.techStack.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        repoUrl: data.repoUrl || undefined,
        swaggerUrl: data.swaggerUrl || undefined,
        pods: data.instances || undefined,
        dependencies: data.dependencies?.length
          ? data.dependencies.map((d) => ({ name: d.name, type: d.type as import("@/types").DependencyType }))
          : undefined,
      });
      setServicesList((prev) => prev.map((s) => (s.id === editingService.id ? updated : s)));
      setEditingService(null);
      showFeedback("success", `Service "${data.name}" updated.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update microservice.";
      console.error("Failed to update microservice:", msg, error);
      showFeedback("error", msg);
    }
  };

  const handleDeleteService = async (id: string) => {
    const svc = servicesList.find((s) => s.id === id);
    if (svc) setDeleteTarget(svc);
  };

  const confirmDeleteService = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMicroservice(deleteTarget.id);
      setServicesList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      showFeedback("success", `Service "${deleteTarget.name}" deleted.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete microservice.";
      console.error("Failed to delete microservice:", msg, error);
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
      {/* Header */}
      <Header
        title="microservices"
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
      />

      {/* Page content */}
      <main id="main-content" className="flex-1 overflow-y-auto bg-[#f8fafc] px-3 sm:px-5 py-5" aria-busy={loading}>
        <div className="space-y-5">
          {/* Page title + Add Service button */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Microservices
              </h2>
              <p className="text-sm text-[#717182]">
                Manage and monitor your microservices ecosystem in {envLabel}.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={loadData}
                className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg border border-black/8 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                aria-label="Refresh services"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                  aria-label="Add new service"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Add Service</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <TechTabs selected={selectedTab} onSelect={setSelectedTab} />

          {/* Tab content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#717182]" role="status" aria-live="polite">
              <p className="text-sm">Loading microservices...</p>
            </div>
          ) : (
            <>
              {selectedTab === "health-check" && (
                <HealthCheckTable
                  services={servicesList}
                  environment={envLabel}
                  onDelete={isAdmin ? handleDeleteService : undefined}
                  onEdit={isAdmin ? handleEditService : undefined}
                />
              )}

              {selectedTab === "architecture" && (
                <ArchitectureView services={servicesList} />
              )}

              {selectedTab === "repositories" && (
                <RepositoriesView services={servicesList} />
              )}

              {selectedTab === "swagger-endpoints" && (
                <SwaggerEndpointsView
                  services={servicesList}
                  environment={envLabel}
                />
              )}

              {selectedTab === "resources" && (
                <ResourcesView
                  services={servicesList}
                  environment={envLabel}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Service Modal */}
      <AddServiceModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddService}
        existingServices={servicesList}
      />

      {/* Edit Service Modal */}
      <AddServiceModal
        open={!!editingService}
        onClose={() => setEditingService(null)}
        onSubmit={handleUpdateService}
        existingServices={servicesList}
        initialData={
          editingService
            ? {
                name: editingService.name,
                description: editingService.description || "",
                owner: editingService.owner,
                version: (editingService.version || "").replace(/^v/, ""),
                cluster: "",
                port: "",
                instances: editingService.pods || "",
                repoUrl: editingService.repoUrl || "",
                swaggerUrl: editingService.swaggerUrl || "",
                productionUrl: "",
                techStack: (editingService.techStack || []).join(", "),
                dependencies: (editingService.dependencies || []).map((d) => ({
                  type: d.type,
                  name: d.name,
                  connection: "Outbound (Outgoing)",
                })),
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Service"
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
            onClick={confirmDeleteService}
            className="px-3.5 h-9 rounded-lg bg-[#d4183d] text-[13px] font-medium text-white hover:bg-[#c10007] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
