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
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Tech", icon: Cpu, active: false },
  { label: "Security", icon: Shield, active: false },
  { label: "Settings", icon: Settings, active: false },
];

const roles = ["Admin", "Developer", "Viewer"];

export default function Sidebar() {
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [roleOpen, setRoleOpen] = useState(false);

  return (
    <aside className="flex flex-col w-64 h-screen bg-white border-r border-black/10 shrink-0">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-black/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-[#030213] rounded-[10px]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#0a0a0a]">DevPortal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 w-full px-4 h-11 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-[#eceef2] text-[#030213]"
                : "text-[#0a0a0a] hover:bg-[#eceef2]/50"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-black/10 bg-[#eceef2]/20 px-4 pt-4 pb-4 space-y-4">
        {/* Role Simulator */}
        <div>
          <label className="text-xs font-semibold tracking-widest uppercase text-[#717182]">
            Simulate Role
          </label>
          <div className="relative mt-2">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="flex items-center justify-between w-full h-10 px-3 bg-white border border-black/10 rounded-lg text-sm font-medium text-[#0a0a0a]"
            >
              <span>{selectedRole}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {roleOpen && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-white border border-black/10 rounded-lg shadow-md z-10">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setRoleOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-[#eceef2]/50 ${
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
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-sm bg-[#eceef2]">
            <User className="w-5 h-5 text-[#717182]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#0a0a0a]">Demo Admin</p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-[#2b7fff] bg-[#eff6ff] border border-[#bedbff] rounded-full">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          </div>
        </div>

        {/* Sign Out */}
        <button className="flex items-center gap-3 w-full px-3 h-9 rounded-lg text-sm font-medium text-[#717182] hover:bg-[#eceef2]/50 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
