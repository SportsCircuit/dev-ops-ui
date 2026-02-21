"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Category, Environment } from "@/types";

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
}

const allEnvironments: Environment[] = ["Local", "Dev", "QA", "Stage", "Prod"];

export default function AddLinkModal({
  open,
  onClose,
  categories,
  onSubmit,
}: AddLinkModalProps) {
  const formCategories = categories.filter(
    (c) => c !== "All" && c !== "Observability"
  );
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>("Logging");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [description, setDescription] = useState("");

  const toggleEnv = (env: Environment) => {
    setEnvironments((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env]
    );
  };

  const handleSubmit = () => {
    onSubmit({ title, url, category, environments, description });
    setTitle("");
    setUrl("");
    setCategory("Logging");
    setEnvironments([]);
    setDescription("");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] bg-white rounded-lg border border-black/8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[#0a0a0a]">
              Add New Link
            </h2>
            <p className="text-sm text-[#717182]">
              Fill out the form to add a new tool link to the dashboard.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-4 h-4 text-[#717182] hover:text-[#0a0a0a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 pt-3 pb-5 space-y-3.5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#0a0a0a]">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Kibana Logs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#0a0a0a]">
              URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#0a0a0a]">
              Category
            </label>
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center justify-between w-full h-10 px-3 text-sm border border-black/10 rounded-lg bg-white text-[#0a0a0a]"
              >
                <span>{category}</span>
                <ChevronDown className="w-4 h-4 text-[#717182]" />
              </button>
              {categoryOpen && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white border border-black/10 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {formCategories.map((cat) => (
                    <button
                      key={cat}
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
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#0a0a0a]">
              Environments
            </label>
            <div className="flex items-center gap-4 pt-1">
              {allEnvironments.map((env) => (
                <label
                  key={env}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() => toggleEnv(env)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      environments.includes(env)
                        ? "bg-[#030213] border-[#030213]"
                        : "border-black/20 bg-white"
                    }`}
                  >
                    {environments.includes(env) && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
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
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#0a0a0a]">
              Description
            </label>
            <textarea
              placeholder="Brief description of the tool..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-black/10 rounded-lg bg-white placeholder:text-[#717182] text-[#0a0a0a] resize-none focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#2b7fff]/40"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="px-3.5 h-9 rounded-lg border border-black/8 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3.5 h-9 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors"
            >
              Create Link
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
