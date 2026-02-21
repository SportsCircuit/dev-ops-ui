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
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Tech", icon: Cpu, href: "/tech" },
  { label: "Security", icon: Shield, href: "/security" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const roles = ["Admin", "Developer", "Viewer"];

export default function Sidebar() {
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [roleOpen, setRoleOpen] = useState(false);
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-56 h-screen bg-white border-r border-black/8 shrink-0">
      {/* Logo */}
      <div className="flex items-center h-14 px-5 border-b border-black/8">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-[#030213] rounded-[10px]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#0a0a0a]">DevPortal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 w-full px-3 h-9 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#eceef2] text-[#030213]"
                  : "text-[#0a0a0a]/70 hover:bg-[#eceef2]/50 hover:text-[#0a0a0a]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-black/8 bg-[#f5f6f8] px-3 pt-3 pb-3 space-y-3">
        {/* Role Simulator */}
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase text-[#717182]">
            Simulate Role
          </label>
          <div className="relative mt-1.5">
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              className="flex items-center justify-between w-full h-9 px-2.5 bg-white border border-black/8 rounded-lg text-[13px] font-medium text-[#0a0a0a]"
            >
              <span>{selectedRole}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {roleOpen && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-white border border-black/8 rounded-lg shadow-lg z-10">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setRoleOpen(false);
                    }}
                    className={`block w-full px-2.5 py-1.5 text-left text-[13px] hover:bg-[#eceef2]/50 first:rounded-t-lg last:rounded-b-lg ${
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
            <User className="w-4 h-4 text-[#717182]" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#0a0a0a]">Demo Admin</p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-[#2b7fff] bg-[#eff6ff] border border-[#bedbff] rounded-full">
              <Shield className="w-2.5 h-2.5" />
              Admin
            </span>
          </div>
        </div>

        {/* Sign Out */}
        <button className="flex items-center gap-2.5 w-full px-2.5 h-8 rounded-lg text-[13px] font-medium text-[#717182] hover:bg-[#eceef2]/50 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
