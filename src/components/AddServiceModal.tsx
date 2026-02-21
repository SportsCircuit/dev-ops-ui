"use client";

import { useState } from "react";
import { X, ChevronDown, Plus } from "lucide-react";
import { Microservice } from "@/types";

export interface NewServiceData {
  name: string;
  description: string;
  owner: string;
  version: string;
  cluster: string;
  port: string;
  instances: string;
  repoUrl: string;
  swaggerUrl: string;
  productionUrl: string;
  techStack: string;
  dependencies: Dependency[];
}

interface Dependency {
  type: string;
  name: string;
  connection: string;
}

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewServiceData) => void;
  existingServices: Microservice[];
}

const dependencyTypes = [
  "Microservice",
  "Database",
  "Queue",
  "Cache",
  "External API",
];

const connectionTypes = [
  "Outbound (Outgoing)",
  "Inbound (Incoming)",
  "Bidirectional",
];

export default function AddServiceModal({
  open,
  onClose,
  onSubmit,
  existingServices,
}: AddServiceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [version, setVersion] = useState("");
  const [cluster, setCluster] = useState("");
  const [port, setPort] = useState("");
  const [instances, setInstances] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [swaggerUrl, setSwaggerUrl] = useState("");
  const [productionUrl, setProductionUrl] = useState("");
  const [techStack, setTechStack] = useState("");

  // Dependencies
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [depType, setDepType] = useState("Microservice");
  const [depName, setDepName] = useState("");
  const [depConnection, setDepConnection] = useState("Outbound (Outgoing)");

  // Dropdown open states
  const [depTypeOpen, setDepTypeOpen] = useState(false);
  const [depNameOpen, setDepNameOpen] = useState(false);
  const [depConnectionOpen, setDepConnectionOpen] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setOwner("");
    setVersion("");
    setCluster("");
    setPort("");
    setInstances("");
    setRepoUrl("");
    setSwaggerUrl("");
    setProductionUrl("");
    setTechStack("");
    setDependencies([]);
    setDepType("Microservice");
    setDepName("");
    setDepConnection("Outbound (Outgoing)");
  };

  const handleAddDependency = () => {
    if (depName) {
      setDependencies((prev) => [
        ...prev,
        { type: depType, name: depName, connection: depConnection },
      ]);
      setDepType("Microservice");
      setDepName("");
      setDepConnection("Outbound (Outgoing)");
    }
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      description,
      owner,
      version,
      cluster,
      port,
      instances,
      repoUrl,
      swaggerUrl,
      productionUrl,
      techStack,
      dependencies,
    });
    resetForm();
    onClose();
  };

  if (!open) return null;

  const inputClass =
    "w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40";

  const labelClass = "block text-sm font-medium text-[#0a0a0a]";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[520px] max-h-[90vh] bg-white rounded-lg border border-black/8 shadow-2xl overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex items-center justify-center w-4 h-4 text-[#717182] hover:text-[#0a0a0a] transition-colors opacity-70"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-5 pt-5 space-y-1">
          <h2 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
            Add New Microservice
          </h2>
          <p className="text-sm text-[#717182]">
            Register a new microservice to the dashboard.
          </p>
        </div>

        {/* Form */}
        <div className="px-5 pt-3 pb-5 space-y-3.5">
          {/* Service Name */}
          <div className="space-y-1.5">
            <label className={labelClass}>Service Name</label>
            <input
              type="text"
              placeholder="e.g. User Service"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <textarea
              placeholder="Brief description of the service..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] resize-none focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
            />
          </div>

          {/* Owner Team + Initial Version */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Owner Team</label>
              <input
                type="text"
                placeholder="e.g. Identity Team"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Initial Version</label>
              <input
                type="text"
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Cluster + Port */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Cluster</label>
              <input
                type="text"
                placeholder="e.g. k8s-prod-useast1"
                value={cluster}
                onChange={(e) => setCluster(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Port</label>
              <input
                type="text"
                placeholder="8080"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Instances (Pods) */}
          <div className="space-y-1.5">
            <label className={labelClass}>Instances (Pods)</label>
            <input
              type="text"
              placeholder="1/1"
              value={instances}
              onChange={(e) => setInstances(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Repository URL */}
          <div className="space-y-1.5">
            <label className={labelClass}>Repository URL</label>
            <input
              type="url"
              placeholder="https://github.com/org/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Swagger/OpenAPI URL */}
          <div className="space-y-1.5">
            <label className={labelClass}>Swagger/OpenAPI URL</label>
            <input
              type="url"
              placeholder="https://api.example.com/docs"
              value={swaggerUrl}
              onChange={(e) => setSwaggerUrl(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Production URL (Optional) */}
          <div className="space-y-1.5">
            <label className={labelClass}>Production URL (Optional)</label>
            <input
              type="url"
              placeholder="https://api.example.com"
              value={productionUrl}
              onChange={(e) => setProductionUrl(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <label className={labelClass}>Tech Stack (comma separated)</label>
            <input
              type="text"
              placeholder="Node.js, React, Redis"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Dependencies section */}
          <div className="border border-black/10 rounded-lg bg-[rgba(236,236,240,0.2)] p-4 space-y-4">
            <h3 className="text-base font-semibold text-[#0a0a0a]">
              Dependencies
            </h3>

            {/* Added dependencies list */}
            {dependencies.length > 0 && (
              <div className="space-y-2">
                {dependencies.map((dep, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 text-sm bg-white border border-black/10 rounded-lg"
                  >
                    <span className="text-[#0a0a0a]">
                      {dep.type} — {dep.name} ({dep.connection})
                    </span>
                    <button
                      onClick={() =>
                        setDependencies((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-[#717182] hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Type + Name dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              {/* Type dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#0a0a0a]">
                  Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setDepTypeOpen(!depTypeOpen);
                      setDepNameOpen(false);
                      setDepConnectionOpen(false);
                    }}
                    className="flex items-center justify-between w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a]"
                  >
                    <span>{depType}</span>
                    <ChevronDown className="w-4 h-4 text-[#717182]" />
                  </button>
                  {depTypeOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {dependencyTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setDepType(t);
                            setDepTypeOpen(false);
                          }}
                          className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#eceef2]/50 ${
                            t === depType
                              ? "font-medium text-[#030213] bg-[#eceef2]/30"
                              : "text-[#717182]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Name dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#0a0a0a]">
                  Name
                </label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setDepNameOpen(!depNameOpen);
                      setDepTypeOpen(false);
                      setDepConnectionOpen(false);
                    }}
                    className="flex items-center justify-between w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a]"
                  >
                    <span className={depName ? "" : "text-[#717182]"}>
                      {depName || "Select service"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#717182]" />
                  </button>
                  {depNameOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {existingServices.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setDepName(s.name);
                            setDepNameOpen(false);
                          }}
                          className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#eceef2]/50 ${
                            s.name === depName
                              ? "font-medium text-[#030213] bg-[#eceef2]/30"
                              : "text-[#717182]"
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connection + Add button */}
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="block text-xs font-medium text-[#0a0a0a]">
                  Connection
                </label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setDepConnectionOpen(!depConnectionOpen);
                      setDepTypeOpen(false);
                      setDepNameOpen(false);
                    }}
                    className="flex items-center justify-between w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a]"
                  >
                    <span>{depConnection}</span>
                    <ChevronDown className="w-4 h-4 text-[#717182]" />
                  </button>
                  {depConnectionOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {connectionTypes.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setDepConnection(c);
                            setDepConnectionOpen(false);
                          }}
                          className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#eceef2]/50 ${
                            c === depConnection
                              ? "font-medium text-[#030213] bg-[#eceef2]/30"
                              : "text-[#717182]"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddDependency}
                className="h-10 px-4 rounded-lg bg-[#eceef2] text-sm font-medium text-[#030213] hover:bg-[#dddfe4] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              className="h-10 px-4 rounded-lg bg-[#030213] text-sm font-medium text-white hover:bg-[#030213]/90 transition-colors"
            >
              Add Microservice
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
