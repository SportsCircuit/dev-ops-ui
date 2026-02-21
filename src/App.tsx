import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppShell from "@/components/AppShell";
import Dashboard from "@/components/Dashboard";
import TechPage from "@/components/TechPage";
import SecurityPage from "@/components/SecurityPage";
import SettingsPage from "@/components/SettingsPage";
import SignInPage from "@/components/SignInPage";

export default function App() {
  const { currentUser } = useAuth();

  /* ── Not signed in — only sign-in route accessible ── */
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    );
  }

  /* ── Signed in — full app with role-based routing ── */
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tech" element={<TechPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route
          path="/settings"
          element={
            currentUser.role === "Admin" ? (
              <SettingsPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/sign-in" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
