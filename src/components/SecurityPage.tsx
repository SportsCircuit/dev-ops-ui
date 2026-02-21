import { useState } from "react";
import { Shield } from "lucide-react";
import { Environment } from "@/types";
import Header from "@/components/Header";

export default function SecurityPage() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "All"
  >("Prod");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        title="security"
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
      />

      <main id="main-content" className="flex-1 overflow-y-auto bg-[#f8fafc] px-3 sm:px-5 py-5">
        <div className="space-y-5">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
              Security
            </h2>
            <p className="text-sm text-[#717182]">
              Security policies, audit logs, and access control.
            </p>
          </div>

          <div className="bg-white border border-black/8 rounded-lg shadow-sm">
            <div className="flex flex-col items-center justify-center py-20 text-[#717182]">
              <Shield className="w-12 h-12 mb-3 text-[#717182]/40" aria-hidden="true" />
              <p className="text-sm font-medium">Security Dashboard Coming Soon</p>
              <p className="text-xs mt-1">
                This section will include audit logs, access policies, and security scanning results.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
