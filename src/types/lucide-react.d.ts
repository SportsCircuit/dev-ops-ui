declare module "lucide-react" {
  import { ComponentType, SVGProps } from "react";

  interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }

  type LucideIcon = ComponentType<LucideProps>;

  export const ChevronDown: LucideIcon;
  export const Copy: LucideIcon;
  export const Cpu: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Globe: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const LogOut: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Plus: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const Settings2: LucideIcon;
  export const Shield: LucideIcon;
  export const User: LucideIcon;
  export const X: LucideIcon;
  export const Zap: LucideIcon;
  export const Database: LucideIcon;
  export const HardDrive: LucideIcon;
  export const Box: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Cloud: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const GitFork: LucideIcon;
  export const GitBranch: LucideIcon;
  export const Code2: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const XCircle: LucideIcon;
  export const Pencil: LucideIcon;
  export const Trash2: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Check: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
}
