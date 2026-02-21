"use client";

import {
  LayoutDashboard,
  Cpu,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
  User,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Tech", icon: Cpu, href: "/tech" },
  { label: "Security", icon: Shield, href: "/security" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const roles = ["Admin", "Developer", "Viewer"];

interface SidebarProps {
  /** Called when the mobile close button is pressed */
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [roleOpen, setRoleOpen] = useState(false);
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const pathname = usePathname();
  const roleListRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!roleOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        roleListRef.current &&
        !roleListRef.current.closest(".role-dropdown-container")?.contains(e.target as Node)
      ) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [roleOpen]);

  const handleRoleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (roleOpen) {
          setSelectedRole(roles[activeRoleIndex]);
          setRoleOpen(false);
        } else {
          setRoleOpen(true);
          setActiveRoleIndex(roles.indexOf(selectedRole));
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!roleOpen) {
          setRoleOpen(true);
        } else {
          setActiveRoleIndex((p) => (p < roles.length - 1 ? p + 1 : 0));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!roleOpen) {
          setRoleOpen(true);
        } else {
          setActiveRoleIndex((p) => (p > 0 ? p - 1 : roles.length - 1));
        }
        break;
      case "Escape":
        e.preventDefault();
        setRoleOpen(false);
        break;
    }
  };

  return (
    <aside
      aria-label="Main navigation"
      className="flex flex-col w-56 h-screen bg-white border-r border-black/8 shrink-0"
    >
      {/* Logo + mobile close */}
      <div className="flex items-center justify-between h-14 px-5 border-b border-black/8">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-[#030213] rounded-[10px]">
            <Zap className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-[#0a0a0a]">DevPortal</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#eceef2]/50 transition-colors sm:hidden"
          >
            <X className="w-5 h-5 text-[#717182]" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav aria-label="Primary" className="flex-1 px-3 pt-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={onClose}
              className={`flex items-center gap-2.5 w-full px-3 h-9 rounded-lg text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 ${
                isActive
                  ? "bg-[#eceef2] text-[#030213]"
                  : "text-[#0a0a0a]/70 hover:bg-[#eceef2]/50 hover:text-[#0a0a0a]"
              }`}
            >
              <item.icon className="w-4 h-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-black/8 bg-[#f5f6f8] px-3 pt-3 pb-3 space-y-3">
        {/* Role Simulator */}
        <div className="role-dropdown-container">
          <label
            id="role-simulator-label"
            className="text-[10px] font-semibold tracking-widest uppercase text-[#717182]"
          >
            Simulate Role
          </label>
          <div className="relative mt-1.5">
            <button
              role="combobox"
              aria-expanded={roleOpen}
              aria-haspopup="listbox"
              aria-controls="role-listbox"
              aria-labelledby="role-simulator-label"
              onClick={() => {
                setRoleOpen(!roleOpen);
                setActiveRoleIndex(roles.indexOf(selectedRole));
              }}
              onKeyDown={handleRoleKeyDown}
              className="flex items-center justify-between w-full h-9 px-2.5 bg-white border border-black/8 rounded-lg text-[13px] font-medium text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
            >
              <span>{selectedRole}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${roleOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {roleOpen && (
              <div
                ref={roleListRef}
                id="role-listbox"
                role="listbox"
                aria-label="Simulate role"
                className="absolute bottom-full left-0 w-full mb-1 bg-white border border-black/8 rounded-lg shadow-lg z-10"
              >
                {roles.map((role, idx) => (
                  <button
                    key={role}
                    role="option"
                    aria-selected={role === selectedRole}
                    onClick={() => {
                      setSelectedRole(role);
                      setRoleOpen(false);
                    }}
                    onMouseEnter={() => setActiveRoleIndex(idx)}
                    className={`block w-full px-2.5 py-1.5 text-left text-[13px] first:rounded-t-lg last:rounded-b-lg ${
                      idx === activeRoleIndex ? "bg-[#eceef2]/50" : ""
                    } ${
                      role === selectedRole
                        ? "font-medium text-[#030213]"
                        : "text-[#717182]"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eceef2]">
            <User className="w-4 h-4 text-[#717182]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#0a0a0a]">Demo Admin</p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-[#2b7fff] bg-[#eff6ff] border border-[#bedbff] rounded-full">
              <Shield className="w-2.5 h-2.5" aria-hidden="true" />
              Admin
            </span>
          </div>
        </div>

        {/* Sign Out */}
        <button
          aria-label="Sign out"
          className="flex items-center gap-2.5 w-full px-2.5 h-8 rounded-lg text-[13px] font-medium text-[#717182] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
