import {
  LayoutDashboard,
  Cpu,
  Shield,
  Settings,
  LogOut,
  Zap,
  User,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const allNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", adminOnly: false },
  { label: "Tech", icon: Cpu, href: "/tech", adminOnly: false },
  { label: "Security", icon: Shield, href: "/security", adminOnly: false },
  { label: "Settings", icon: Settings, href: "/settings", adminOnly: true },
];

interface SidebarProps {
  /** Called when the mobile close button is pressed */
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { currentUser, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

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
              to={item.href}
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
        {/* User Info */}
        {currentUser && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#eceef2] shrink-0">
              <User className="w-4 h-4 text-[#717182]" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[#0a0a0a] truncate">
                {currentUser.name}
              </p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-[#2b7fff] bg-[#eff6ff] border border-[#bedbff] rounded-full">
                <Shield className="w-2.5 h-2.5" aria-hidden="true" />
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={() => {
            signOut();
            navigate("/sign-in", { replace: true });
          }}
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
