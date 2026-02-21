"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Environment, UserRole } from "@/types";

export interface NewUserData {
  name: string;
  role: UserRole;
  access: Environment[];
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewUserData) => void;
}

const roles: UserRole[] = ["Admin", "DevOps", "Dev", "QA", "Viewer"];
const environments: Environment[] = ["Local", "Dev", "QA", "Stage", "Prod"];

export default function AddUserModal({
  open,
  onClose,
  onSubmit,
}: AddUserModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Dev");
  const [access, setAccess] = useState<Environment[]>([]);
  const [roleOpen, setRoleOpen] = useState(false);

  if (!open) return null;

  const toggleAccess = (env: Environment) => {
    setAccess((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), role, access });
    setName("");
    setRole("Dev");
    setAccess([]);
    onClose();
  };

  const handleClose = () => {
    setName("");
    setRole("Dev");
    setAccess([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-black/8 rounded-lg shadow-xl w-[480px] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#0a0a0a]/70 hover:text-[#0a0a0a] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-5 pt-5 space-y-1">
          <h2 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
            Add New User
          </h2>
          <p className="text-sm text-[#717182]">
            Configure user details and permissions.
          </p>
        </div>

        {/* Form */}
        <div className="px-5 pt-3 space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#0a0a0a]">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full h-10 px-3 rounded-lg border border-black/10 text-sm text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:border-[#030213] transition-colors"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#0a0a0a]">Role</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleOpen(!roleOpen)}
                className="w-full h-10 px-3 rounded-lg border border-black/10 text-sm font-medium text-[#0a0a0a] flex items-center justify-between hover:border-[#030213] transition-colors"
              >
                <span>{role}</span>
                <ChevronDown className="w-4 h-4 text-[#717182]" />
              </button>
              {roleOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-lg shadow-lg z-10 py-1">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setRoleOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-[#f8fafc] transition-colors ${
                        r === role
                          ? "font-medium text-[#0a0a0a]"
                          : "text-[#717182]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Environment Access */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0a0a0a]">
              Environment Access
            </label>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {environments.map((env) => (
                <label
                  key={env}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccess(env)}
                    className={`w-4 h-4 rounded-[6px] border shrink-0 flex items-center justify-center transition-colors ${
                      access.includes(env)
                        ? "bg-[#030213] border-[#030213]"
                        : "border-[#030213] bg-white"
                    }`}
                  >
                    {access.includes(env) && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-[#0a0a0a]">{env}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 px-5 py-5">
          <button
            onClick={handleClose}
            className="h-9 px-3.5 rounded-lg border border-black/8 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#f8fafc] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="h-9 px-3.5 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors"
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  );
}
