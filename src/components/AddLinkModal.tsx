import { useState, useId, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Category, Environment } from "@/types";
import Modal from "@/components/ui/Modal";

interface AddLinkModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: {
    title: string;
    url: string;
    category: Category;
    environments: Environment[];
    description: string;
  }) => void;
  initialData?: {
    title: string;
    url: string;
    category: Category;
    environments: Environment[];
    description: string;
  };
}

const allEnvironments: Environment[] = ["Local", "Dev", "QA", "Stage", "Prod"];

export default function AddLinkModal({
  open,
  onClose,
  categories,
  onSubmit,
  initialData,
}: AddLinkModalProps) {
  const uid = useId();
  const formCategories = categories.filter(
    (c) => c !== "All" && c !== "Observability"
  );
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>("Logging");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state when initialData changes (edit mode) or modal opens
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setCategory(initialData.category);
      setEnvironments(initialData.environments);
      setDescription(initialData.description);
    } else {
      setTitle("");
      setUrl("");
      setCategory("Logging");
      setEnvironments([]);
      setDescription("");
    }
    setErrors({});
  }, [initialData, open]);

  const toggleEnv = (env: Environment) => {
    setEnvironments((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env]
    );
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!url.trim()) newErrors.url = "URL is required.";
    else if (!/^https?:\/\/.+/i.test(url.trim())) newErrors.url = "Enter a valid URL starting with http(s)://";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (environments.length === 0) newErrors.environments = "Select at least one environment.";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit({ title, url, category, environments, description });
    setTitle("");
    setUrl("");
    setCategory("Logging");
    setEnvironments([]);
    setDescription("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? "Edit Link" : "Add New Link"}
      description={initialData ? "Update the tool link details." : "Fill out the form to add a new tool link to the dashboard."}
    >
      <div className="space-y-3.5">
        {/* Title */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-title`} className="block text-xs font-medium text-[#0a0a0a]">
            Title
          </label>
          <input
            id={`${uid}-title`}
            type="text"
            placeholder="e.g. Kibana Logs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
          />
          {errors.title && <p className="text-xs text-red-500 mt-0.5">{errors.title}</p>}
        </div>

        {/* URL */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-url`} className="block text-xs font-medium text-[#0a0a0a]">
            URL
          </label>
          <input
            id={`${uid}-url`}
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
          />
          {errors.url && <p className="text-xs text-red-500 mt-0.5">{errors.url}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label id={`${uid}-cat-label`} className="block text-xs font-medium text-[#0a0a0a]">
            Category
          </label>
          <div className="relative">
            <button
              type="button"
              role="combobox"
              aria-expanded={categoryOpen}
              aria-haspopup="listbox"
              aria-labelledby={`${uid}-cat-label`}
              aria-controls={categoryOpen ? `${uid}-cat-list` : undefined}
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center justify-between w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            >
              <span>{category}</span>
              <ChevronDown className="w-4 h-4 text-[#717182]" aria-hidden="true" />
            </button>
            {categoryOpen && (
              <div
                id={`${uid}-cat-list`}
                role="listbox"
                aria-labelledby={`${uid}-cat-label`}
                className="absolute left-0 top-full mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
              >
                {formCategories.map((cat) => (
                  <button
                    key={cat}
                    role="option"
                    aria-selected={cat === category}
                    onClick={() => {
                      setCategory(cat);
                      setCategoryOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#eceef2]/50 ${
                      cat === category
                        ? "font-medium text-[#030213] bg-[#eceef2]/30"
                        : "text-[#717182]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Environments */}
        <fieldset className="space-y-1.5">
          <legend className="block text-xs font-medium text-[#0a0a0a]">
            Environments
          </legend>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            {allEnvironments.map((env) => {
              const checked = environments.includes(env);
              return (
                <label
                  key={env}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleEnv(env)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 ${
                      checked
                        ? "bg-[#030213] border-[#030213]"
                        : "border-black/20 bg-white"
                    }`}
                  >
                    {checked && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="text-xs text-[#0a0a0a]">{env}</span>
                </label>
              );
            })}
          </div>
          {errors.environments && <p className="text-xs text-red-500 mt-0.5">{errors.environments}</p>}
        </fieldset>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-desc`} className="block text-xs font-medium text-[#0a0a0a]">
            Description
          </label>
          <textarea
            id={`${uid}-desc`}
            placeholder="Brief description of the tool..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] resize-none focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
          />
          {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-3.5 h-9 rounded-lg border border-black/8 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3.5 h-9 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            {initialData ? "Save Changes" : "Create Link"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
