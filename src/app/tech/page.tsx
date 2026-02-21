import Sidebar from "@/components/Sidebar";
import TechPage from "@/components/TechPage";

export default function Tech() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <TechPage />
    </div>
  );
}
