"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Environment, PortalUser, UserRole } from "@/types";
import { fetchUsers, createUser, deleteUser } from "@/lib/api";
import Header from "@/components/Header";
import AddUserModal, { NewUserData } from "@/components/AddUserModal";

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
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    Environment | "All"
  >("Prod");
  const [usersList, setUsersList] = useState<PortalUser[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsersList(data);
    } catch (error) {
      console.error("Failed to load users:", error);
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
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsersList((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
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
      <main className="flex-1 overflow-y-auto bg-[#f8fafc] px-5 py-5">
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
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div>
                <h3 className="text-base font-semibold text-[#0a0a0a] tracking-tight">
                  User Management
                </h3>
                <p className="text-xs text-[#717182] mt-0.5">
                  Manage users, their roles, and environment access.
                </p>
              </div>
              <button
                onClick={() => setAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-[#030213] text-[13px] font-medium text-white hover:bg-[#030213]/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>

            {/* Table */}
            <div className="px-5 pb-5">
              {loading ? (
                <div className="flex items-center justify-center py-10 text-[#717182]">
                  <p className="text-sm">Loading users...</p>
                </div>
              ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/8">
                    <th className="text-left px-2 py-2 text-xs font-medium text-[#717182]">
                      User
                    </th>
                    <th className="text-left px-2 py-2 text-xs font-medium text-[#717182]">
                      Role
                    </th>
                    <th className="text-left px-2 py-2 text-xs font-medium text-[#717182]">
                      Access
                    </th>
                    <th className="text-right px-2 py-2 text-xs font-medium text-[#717182]">
                      Actions
                    </th>
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
                        <td className="px-2 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-md text-[#717182] hover:text-[#0a0a0a] hover:bg-[#eceef2]/50 transition-colors"
                              title="Edit user"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-md text-[#d4183d] hover:text-[#c10007] hover:bg-red-50 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      <AddUserModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
}
