import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Database, RefreshCw } from "lucide-react";
import { Environment, PortalUser, UserRole } from "@/types";
import { fetchUsers, createUser, updateUser, deleteUser, seedDatabase } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import AddUserModal, { NewUserData } from "@/components/AddUserModal";
import Modal from "@/components/ui/Modal";
import ViewToggle, { type ViewMode } from "@/components/ui/ViewToggle";

const roleStyles: Record<UserRole, { bg: string; text: string }> = {
  Admin: { bg: "bg-[#d4183d]", text: "text-white" },
  DevOps: { bg: "bg-[#eceef2]", text: "text-[#030213]" },
  Dev: { bg: "bg-[#eceef2]", text: "text-[#030213]" },
  QA: { bg: "bg-[#eceef2]", text: "text-[#030213]" },
  Viewer: { bg: "bg-[#eceef2]", text: "text-[#030213]" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-indigo-100 text-indigo-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-sky-100 text-sky-600",
];

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "All"
  >("Prod");
  const [usersList, setUsersList] = useState<PortalUser[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PortalUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortalUser | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [userViewMode, setUserViewMode] = useState<ViewMode>("list");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsersList(data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to load users.";
      console.error("Failed to load users:", msg, error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddUser = async (data: NewUserData) => {
    try {
      const created = await createUser({
        name: data.name,
        role: data.role,
        access: data.access,
      });
      setUsersList((prev) => [created, ...prev]);
      showFeedback("success", `User "${data.name}" created.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to create user.";
      console.error("Failed to create user:", msg, error);
      showFeedback("error", msg);
    }
  };

  const handleEditUser = async (data: NewUserData) => {
    if (!editingUser) return;
    try {
      const updated = await updateUser(editingUser.id, {
        name: data.name,
        role: data.role,
        access: data.access,
      });
      setUsersList((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
      setEditingUser(null);
      showFeedback("success", `User "${data.name}" updated.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update user.";
      console.error("Failed to update user:", msg, error);
      showFeedback("error", msg);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      setUsersList((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      showFeedback("success", `User "${deleteTarget.name}" deleted.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete user.";
      console.error("Failed to delete user:", msg, error);
      showFeedback("error", msg);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      const result = await seedDatabase();
      showFeedback("success", result.message || "Database seeded successfully.");
      await loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to seed database.";
      console.error("Failed to seed database:", msg, error);
      showFeedback("error", msg);
    } finally {
      setSeeding(false);
    }
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteUser = async (id: string) => {
    const user = usersList.find((u) => u.id === id);
    if (user) setDeleteTarget(user);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <Header
        title="settings"
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
      />

      {/* Page content */}
      <main id="main-content" className="flex-1 overflow-y-auto bg-[#f8fafc] px-3 sm:px-5 py-5" aria-busy={loading}>
        <div className="space-y-5">
          {/* Page title */}
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-[#0a0a0a] tracking-tight">
              Settings
            </h2>
            <p className="text-sm text-[#717182]">
              Manage system configuration and user access.
            </p>
          </div>

          {/* User Management card */}
          <div className="bg-white border border-black/8 rounded-lg shadow-sm">
            {/* Card header */}
            <div className="flex items-center justify-between px-3 sm:px-5 pt-5 pb-4 gap-3">
              <div>
                <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
                  User Management
                </h3>
                <p className="text-xs text-[#717182] mt-0.5">
                  Manage users, their roles, and environment access.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ViewToggle mode={userViewMode} onChange={setUserViewMode} />
                {isAdmin && (
                  <button
                    onClick={() => setAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                    aria-label="Add new user"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Add User</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                )}
              </div>
            </div>

            {/* Table / Card content */}
            <div className="px-3 sm:px-5 pb-5">
              {loading ? (
                <div className="flex items-center justify-center py-10 text-[#717182]" role="status" aria-live="polite">
                  <p className="text-sm">Loading users...</p>
                </div>
              ) : userViewMode === "list" ? (
              <div className="overflow-x-auto border border-black/8 rounded-lg" tabIndex={0} role="region" aria-label="User management data">
              <table className="w-full min-w-[500px]">
                <caption className="sr-only">Portal users and their roles</caption>
                <thead>
                  <tr className="border-b border-black/8">
                    <th scope="col" className="text-left px-2 py-2 text-xs font-medium text-[#717182]">
                      User
                    </th>
                    <th scope="col" className="text-left px-2 py-2 text-xs font-medium text-[#717182]">
                      Role
                    </th>
                    <th scope="col" className="text-left px-2 py-2 text-xs font-medium text-[#717182]">
                      Access
                    </th>
                    {isAdmin && (
                      <th scope="col" className="text-right px-2 py-2 text-xs font-medium text-[#717182]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user, idx) => {
                    const style = roleStyles[user.role];
                    const colorClass =
                      avatarColors[idx % avatarColors.length];
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-black/8 last:border-b-0 hover:bg-[#f8fafc] transition-colors"
                      >
                        {/* User */}
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${colorClass}`}
                              aria-hidden="true"
                            >
                              {getInitials(user.name)}
                            </div>
                            <span className="text-[13px] font-medium text-[#0a0a0a]">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        {/* Role badge */}
                        <td className="px-2 py-2.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        {/* Access badges */}
                        <td className="px-2 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {user.access.map((env) => (
                              <span
                                key={env}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium text-[#0a0a0a] border border-black/8"
                              >
                                {env}
                              </span>
                            ))}
                          </div>
                        </td>
                        {/* Actions */}
                        {isAdmin && (
                          <td className="px-2 py-2.5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-[#717182] hover:text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                                aria-label={`Edit ${user.name}`}
                              >
                                <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-[#d4183d] hover:text-[#c10007] hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                                aria-label={`Delete ${user.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
              ) : (
              /* Card view */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {usersList.map((user, idx) => {
                  const style = roleStyles[user.role];
                  const colorClass = avatarColors[idx % avatarColors.length];
                  return (
                    <article
                      key={user.id}
                      className="bg-white border border-black/8 rounded-lg shadow-sm p-4 flex flex-col gap-3"
                      aria-label={`${user.name} user card`}
                    >
                      {/* Avatar + name */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${colorClass}`}
                          aria-hidden="true"
                        >
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[13px] font-semibold text-[#0a0a0a] truncate">{user.name}</h4>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${style.bg} ${style.text}`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>

                      {/* Access badges */}
                      <div className="flex flex-wrap gap-1">
                        {user.access.map((env) => (
                          <span
                            key={env}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-[#0a0a0a] border border-black/8"
                          >
                            {env}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 mt-auto pt-2 border-t border-black/6">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="inline-flex items-center gap-1 px-2 h-7 rounded-md text-xs text-[#717182] hover:text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                            aria-label={`Edit ${user.name}`}
                          >
                            <Pencil className="w-3 h-3" aria-hidden="true" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="inline-flex items-center gap-1 px-2 h-7 rounded-md text-xs text-[#d4183d] hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                            aria-label={`Delete ${user.name}`}
                          >
                            <Trash2 className="w-3 h-3" aria-hidden="true" /> Delete
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
              )}
            </div>
          </div>

          {/* Database Seed Section */}
          <div className="bg-white border border-black/8 rounded-lg shadow-sm">
            <div className="flex items-center justify-between px-3 sm:px-5 py-5 gap-3">
              <div>
                <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
                  Database Management
                </h3>
                <p className="text-xs text-[#717182] mt-0.5">
                  Seed the database with sample data for development and testing.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={loadData}
                  className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg border border-black/8 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
                  aria-label="Refresh users"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={handleSeedDatabase}
                    disabled={seeding}
                    className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 disabled:opacity-50"
                    aria-label="Seed database"
                  >
                    <Database className="w-4 h-4" aria-hidden="true" />
                    {seeding ? "Seeding..." : "Seed Database"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback.message}
        </div>
      )}

      {/* Add User Modal */}
      <AddUserModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddUser}
      />

      {/* Edit User Modal */}
      <AddUserModal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleEditUser}
        initialData={editingUser ? { name: editingUser.name, role: editingUser.role, access: editingUser.access } : undefined}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      >
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-3.5 h-9 rounded-lg border border-black/8 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteUser}
            className="px-3.5 h-9 rounded-lg bg-[#d4183d] text-[13px] font-medium text-white hover:bg-[#c10007] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
