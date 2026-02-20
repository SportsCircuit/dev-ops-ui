import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

