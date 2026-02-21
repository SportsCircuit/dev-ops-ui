"use client";

import { useState, useId } from "react";
import { Environment, UserRole } from "@/types";
import Modal from "@/components/ui/Modal";
import { ChevronDown } from "lucide-react";

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
  const uid = useId();
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Dev");
  const [access, setAccess] = useState<Environment[]>([]);
  const [roleOpen, setRoleOpen] = useState(false);

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
    <Modal
      open={open}
      onClose={handleClose}
      title="Add New User"
      description="Configure user details and permissions."
    >
      <div className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-name`} className="text-sm font-medium text-[#0a0a0a]">
            Full Name
          </label>
          <input
            id={`${uid}-name`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full h-10 px-3 rounded-lg border border-black/10 text-sm text-[#0a0a0a] placeholder:text-[#717182] outline-none focus:ring-2 focus:ring-[#2b7fff]/20 focus:border-[#030213] transition-colors"
          />
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <label id={`${uid}-role-label`} className="text-sm font-medium text-[#0a0a0a]">Role</label>
          <div className="relative">
            <button
              type="button"
              role="combobox"
              aria-expanded={roleOpen}
              aria-haspopup="listbox"
              aria-labelledby={`${uid}-role-label`}
              aria-controls={roleOpen ? `${uid}-role-list` : undefined}
              onClick={() => setRoleOpen(!roleOpen)}
              className="w-full h-10 px-3 rounded-lg border border-black/10 text-sm font-medium text-[#0a0a0a] flex items-center justify-between hover:border-[#030213] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            >
              <span>{role}</span>
              <ChevronDown className="w-4 h-4 text-[#717182]" aria-hidden="true" />
            </button>
            {roleOpen && (
              <div
                id={`${uid}-role-list`}
                role="listbox"
                aria-labelledby={`${uid}-role-label`}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-lg shadow-lg z-10 py-1"
              >
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="option"
                    aria-selected={r === role}
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
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-[#0a0a0a]">
            Environment Access
          </legend>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {environments.map((env) => {
              const checked = access.includes(env);
              return (
                <label
                  key={env}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleAccess(env)}
                    className={`w-4 h-4 rounded-[6px] border shrink-0 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 ${
                      checked
                        ? "bg-[#030213] border-[#030213]"
                        : "border-[#030213] bg-white"
                    }`}
                  >
                    {checked && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
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
              );
            })}
          </div>
        </fieldset>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={handleClose}
            className="h-9 px-3.5 rounded-lg border border-black/8 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#f8fafc] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="h-9 px-3.5 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            Save User
          </button>
        </div>
      </div>
    </Modal>
  );
}
