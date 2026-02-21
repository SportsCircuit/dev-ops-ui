import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Shared layout shell with responsive sidebar.
 * - On sm+ (≥640px): sidebar is always visible as a fixed column.
 * - On <640px: sidebar is hidden; a hamburger triggers an overlay drawer.
 */
export default function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openSidebar = useCallback(() => setMobileOpen(true), []);
  const closeSidebar = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop sidebar — always visible on sm+ */}
      <div className="hidden sm:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay — only on <sm */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] sm:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 sm:hidden animate-slide-in">
            <Sidebar onClose={closeSidebar} />
          </div>
        </>
      )}

      {/* Main content area — receives the hamburger callback */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile hamburger bar — visible only on <sm */}
        <div className="flex items-center h-12 px-4 border-b border-black/8 sm:hidden">
          <button
            onClick={openSidebar}
            aria-label="Open navigation menu"
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#eceef2]/50 transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#0a0a0a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="ml-2 text-sm font-semibold text-[#0a0a0a]">
            DevPortal
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
