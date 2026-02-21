import { useState, useId, useEffect } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { Microservice } from "@/types";
import Modal from "@/components/ui/Modal";

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
  initialData?: NewServiceData;
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
  initialData,
}: AddServiceModalProps) {
  const uid = useId();
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

  useEffect(() => {
    if (initialData && open) {
      setName(initialData.name);
      setDescription(initialData.description);
      setOwner(initialData.owner);
      setVersion(initialData.version);
      setCluster(initialData.cluster);
      setPort(initialData.port);
      setInstances(initialData.instances);
      setRepoUrl(initialData.repoUrl);
      setSwaggerUrl(initialData.swaggerUrl);
      setProductionUrl(initialData.productionUrl);
      setTechStack(initialData.techStack);
      setDependencies(initialData.dependencies || []);
    } else if (!initialData && open) {
      resetForm();
    }
  }, [initialData, open]);

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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Service name is required.";
    if (!owner.trim()) errs.owner = "Owner is required.";
    if (!version.trim()) errs.version = "Version is required.";
    if (Object.keys(errs).length) {
      setValidationErrors(errs);
      return;
    }
    setValidationErrors({});
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
  };

  const inputClass =
    "w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40";

  const labelClass = "block text-sm font-medium text-[#0a0a0a]";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? "Edit Microservice" : "Add New Microservice"}
      description={initialData ? "Update the microservice details." : "Register a new microservice to the dashboard."}
    >
      <div className="space-y-3.5">
        {/* Service Name */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-name`} className={labelClass}>Service Name</label>
          <input
            id={`${uid}-name`}
            type="text"
            placeholder="e.g. User Service"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          {validationErrors.name && <p className="text-xs text-red-500 mt-0.5">{validationErrors.name}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-desc`} className={labelClass}>Description</label>
          <textarea
            id={`${uid}-desc`}
            placeholder="Brief description of the service..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] resize-none focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
          />
        </div>

        {/* Owner Team + Initial Version */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor={`${uid}-owner`} className={labelClass}>Owner Team</label>
            <input
              id={`${uid}-owner`}
              type="text"
              placeholder="e.g. Identity Team"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className={inputClass}
            />
            {validationErrors.owner && <p className="text-xs text-red-500 mt-0.5">{validationErrors.owner}</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${uid}-ver`} className={labelClass}>Initial Version</label>
            <input
              id={`${uid}-ver`}
              type="text"
              placeholder="1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className={inputClass}
            />
            {validationErrors.version && <p className="text-xs text-red-500 mt-0.5">{validationErrors.version}</p>}
          </div>
        </div>

        {/* Cluster + Port */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor={`${uid}-cluster`} className={labelClass}>Cluster</label>
            <input
              id={`${uid}-cluster`}
              type="text"
              placeholder="e.g. k8s-prod-useast1"
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${uid}-port`} className={labelClass}>Port</label>
            <input
              id={`${uid}-port`}
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
          <label htmlFor={`${uid}-pods`} className={labelClass}>Instances (Pods)</label>
          <input
            id={`${uid}-pods`}
            type="text"
            placeholder="1/1"
            value={instances}
            onChange={(e) => setInstances(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Repository URL */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-repo`} className={labelClass}>Repository URL</label>
          <input
            id={`${uid}-repo`}
            type="url"
            placeholder="https://github.com/org/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Swagger/OpenAPI URL */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-swagger`} className={labelClass}>Swagger/OpenAPI URL</label>
          <input
            id={`${uid}-swagger`}
            type="url"
            placeholder="https://api.example.com/docs"
            value={swaggerUrl}
            onChange={(e) => setSwaggerUrl(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Production URL (Optional) */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-prod`} className={labelClass}>Production URL (Optional)</label>
          <input
            id={`${uid}-prod`}
            type="url"
            placeholder="https://api.example.com"
            value={productionUrl}
            onChange={(e) => setProductionUrl(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-tech`} className={labelClass}>Tech Stack (comma separated)</label>
          <input
            id={`${uid}-tech`}
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
                    className="text-[#717182] hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 rounded"
                    aria-label={`Remove dependency ${dep.name}`}
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Type + Name dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type dropdown */}
            <div className="space-y-1.5">
              <label id={`${uid}-deptype-label`} className="block text-xs font-medium text-[#0a0a0a]">
                Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={depTypeOpen}
                  aria-haspopup="listbox"
                  aria-labelledby={`${uid}-deptype-label`}
                  aria-controls={`${uid}-deptype-listbox`}
                  onClick={() => {
                    setDepTypeOpen(!depTypeOpen);
                    setDepNameOpen(false);
                    setDepConnectionOpen(false);
                  }}
                  className="flex items-center justify-between w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                >
                  <span>{depType}</span>
                  <ChevronDown className="w-4 h-4 text-[#717182]" aria-hidden="true" />
                </button>
                {depTypeOpen && (
                  <div id={`${uid}-deptype-listbox`} role="listbox" aria-labelledby={`${uid}-deptype-label`} className="absolute left-0 top-full mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {dependencyTypes.map((t) => (
                      <button
                        key={t}
                        role="option"
                        aria-selected={t === depType}
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
              <label id={`${uid}-depname-label`} className="block text-xs font-medium text-[#0a0a0a]">
                Name
              </label>
              <div className="relative">
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={depNameOpen}
                  aria-haspopup="listbox"
                  aria-labelledby={`${uid}-depname-label`}
                  aria-controls={`${uid}-depname-listbox`}
                  onClick={() => {
                    setDepNameOpen(!depNameOpen);
                    setDepTypeOpen(false);
                    setDepConnectionOpen(false);
                  }}
                  className="flex items-center justify-between w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                >
                  <span className={depName ? "" : "text-[#717182]"}>
                    {depName || "Select service"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#717182]" aria-hidden="true" />
                </button>
                {depNameOpen && (
                  <div id={`${uid}-depname-listbox`} role="listbox" aria-labelledby={`${uid}-depname-label`} className="absolute left-0 top-full mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {existingServices.map((s) => (
                      <button
                        key={s.id}
                        role="option"
                        aria-selected={s.name === depName}
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
            <div className="flex-1 space-y-1.5">
              <label id={`${uid}-depconn-label`} className="block text-xs font-medium text-[#0a0a0a]">
                Connection
              </label>
              <div className="relative">
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={depConnectionOpen}
                  aria-haspopup="listbox"
                  aria-labelledby={`${uid}-depconn-label`}
                  aria-controls={`${uid}-depconn-listbox`}
                  onClick={() => {
                    setDepConnectionOpen(!depConnectionOpen);
                    setDepTypeOpen(false);
                    setDepNameOpen(false);
                  }}
                  className="flex items-center justify-between w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                >
                  <span>{depConnection}</span>
                  <ChevronDown className="w-4 h-4 text-[#717182]" aria-hidden="true" />
                </button>
                {depConnectionOpen && (
                  <div id={`${uid}-depconn-listbox`} role="listbox" aria-labelledby={`${uid}-depconn-label`} className="absolute left-0 top-full mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {connectionTypes.map((c) => (
                      <button
                        key={c}
                        role="option"
                        aria-selected={c === depConnection}
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
              className="h-10 px-4 rounded-lg bg-[#eceef2] text-sm font-medium text-[#030213] hover:bg-[#dddfe4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="h-10 px-4 rounded-lg bg-[#030213] text-sm font-medium text-white hover:bg-[#030213]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            {initialData ? "Save Changes" : "Add Microservice"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
