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
  export const Cpu: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Globe: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const LogOut: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const Settings2: LucideIcon;
  export const Shield: LucideIcon;
  export const User: LucideIcon;
  export const Zap: LucideIcon;
}
