import Sidebar from "@/components/Sidebar";
import SettingsPage from "@/components/SettingsPage";

export default function Settings() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <SettingsPage />
    </div>
  );
}
