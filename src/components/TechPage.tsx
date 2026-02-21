"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Environment, Microservice, TechTab } from "@/types";
import { fetchMicroservices, createMicroservice } from "@/lib/api";
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

export default function TechPage() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "All"
  >("Prod");
  const [selectedTab, setSelectedTab] = useState<TechTab>("health-check");
  const [servicesList, setServicesList] = useState<Microservice[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMicroservices();
      setServicesList(data);
    } catch (error) {
      console.error("Failed to load microservices:", error);
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
      });
      setServicesList((prev) => [created, ...prev]);
    } catch (error) {
      console.error("Failed to create microservice:", error);
    }
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
      <main className="flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5">
        <div className="space-y-5">
          {/* Page title + Add Service button */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
                Microservices
              </h2>
              <p className="text-sm text-[#717182]">
                Manage and monitor your microservices ecosystem in {envLabel}.
              </p>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          {/* Tabs */}
          <TechTabs selected={selectedTab} onSelect={setSelectedTab} />

          {/* Tab content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#717182]">
              <p className="text-sm">Loading microservices...</p>
            </div>
          ) : (
            <>
              {selectedTab === "health-check" && (
                <HealthCheckTable
                  services={servicesList}
                  environment={envLabel}
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
    </div>
  );
}
