"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/lib/axios"; // Using your axios instance
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface User {
  _id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

function UsersPageContent() {
  const { theme, colors } = useTheme();
  const { t } = useLanguage();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // Initial load is true
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Modals State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [savingUser, setSavingUser] = useState(false);

  // Filters State
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterEmailVerified, setFilterEmailVerified] = useState<string>("all");
  const [filterPhoneVerified, setFilterPhoneVerified] = useState<string>("all");

  const isDark = theme === "dark";
  const { currentUser, loading: authLoading } = useAuth();

  const fetchUsers = async () => {
    if (!currentUser) return;

    try {
      // ✅ FIXED: Removed setLoading(true) to fix ESLint set-state-in-effect error.
      // The UI will gracefully keep showing the old data while fetching new data.
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
      });

      if (filterRole !== "all") params.append("role", filterRole);
      if (filterEmailVerified !== "all")
        params.append("isEmailVerified", filterEmailVerified);
      if (filterPhoneVerified !== "all")
        params.append("isPhoneVerified", filterPhoneVerified);

      const response = await api.get(`/api/admin/users?${params}`);

      if (response.data.users) {
        setUsers(response.data.users);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
        } else {
          setTotalPages(Math.ceil((response.data.count || 0) / 10));
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // Set to false once data is fetched or error occurs
    }
  };

  useEffect(() => {
    if (!authLoading && currentUser) {
      const loadUsers = async () => {
        await fetchUsers();
      };

      void loadUsers();
    }
  }, [
    authLoading,
    currentUser,
    currentPage,
    searchTerm,
    filterRole,
    filterEmailVerified,
    filterPhoneVerified,
  ]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    try {
      await api.delete("/api/admin/users/bulk", {
        data: { userIds: selectedUsers },
      });
      setUsers(users.filter((user) => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error bulk deleting users:", error);
    }
  };

  // --- Edit Handlers ---
  const openEditModal = (user: User) => {
    setEditFormData(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      setSavingUser(true);
      const res = await api.put(`/api/admin/users/${editFormData._id}`, {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        phoneNumber: editFormData.phoneNumber,
        role: editFormData.role,
      });

      setUsers(
        users.map((u) => (u._id === editFormData._id ? res.data.user : u)),
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSavingUser(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div
        className="flex justify-center items-center h-64"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.foreground }}
            >
              {String(t.users || "Users")}
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.muted }}>
              Manage your platform&apos;s users, roles, and permissions here.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex sm:items-center space-x-3">
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white transition-colors mr-2"
                style={{ backgroundColor: colors.destructive }}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Selected ({selectedUsers.length})
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: colors.primary }}
            >
              <UserPlusIcon className="mr-2 h-4 w-4" />
              {String(t.addUser || "Add User")}
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon
                className="h-5 w-5"
                style={{ color: colors.muted }}
              />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              placeholder={String(t.searchUsers || "Search users")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.foreground,
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="instructor">Instructor</option>
          </select>

          <select
            value={filterEmailVerified}
            onChange={(e) => setFilterEmailVerified(e.target.value)}
            className="px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.foreground,
            }}
          >
            <option value="all">All Email Status</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>

          <select
            value={filterPhoneVerified}
            onChange={(e) => setFilterPhoneVerified(e.target.value)}
            className="px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.foreground,
            }}
          >
            <option value="all">All Phone Status</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        <div
          className="overflow-hidden rounded-lg shadow-lg"
          style={{ backgroundColor: colors.card }}
        >
          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y"
              style={{ borderColor: colors.border }}
            >
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded"
                      style={{ accentColor: colors.primary }}
                      checked={
                        selectedUsers.length === users.length &&
                        users.length > 0
                      }
                      onChange={() =>
                        setSelectedUsers(
                          selectedUsers.length === users.length
                            ? []
                            : users.map((u) => u._id),
                        )
                      }
                    />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    Email
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    Role
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: colors.border }}
              >
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-opacity-50"
                    style={{ backgroundColor: isDark ? "#334155" : "#f3f4f6" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded"
                        style={{ accentColor: colors.primary }}
                        checked={selectedUsers.includes(user._id)}
                        onChange={() =>
                          setSelectedUsers((prev) =>
                            prev.includes(user._id)
                              ? prev.filter((id) => id !== user._id)
                              : [...prev, user._id],
                          )
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <span className="text-sm font-medium text-white">
                            {user.firstName?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <div
                            className="text-sm font-medium"
                            style={{ color: colors.foreground }}
                          >
                            {user.firstName} {user.lastName}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: colors.muted }}
                          >
                            {user.phoneNumber || "No phone"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.foreground }}
                    >
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white capitalize"
                        style={{
                          backgroundColor:
                            user.role === "admin"
                              ? colors.secondary
                              : colors.accent,
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span
                          className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{
                            backgroundColor: user.isEmailVerified
                              ? colors.success
                              : colors.destructive,
                          }}
                        >
                          {user.isEmailVerified ? (
                            <>
                              <CheckIcon className="h-3 w-3 mr-1" /> Email
                            </>
                          ) : (
                            <>
                              <XMarkIcon className="h-3 w-3 mr-1" /> Email
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(user)}
                        className="mr-3 p-2 transition-colors"
                        style={{ color: colors.primary }}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user._id);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 transition-colors"
                        style={{ color: colors.destructive }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: colors.muted }}>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              }}
            >
              {String(t.previous || "Previous")}
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              }}
            >
              {String(t.next || "Next")}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-lg p-6 max-w-md w-full"
            style={{ backgroundColor: colors.card }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: colors.foreground }}
            >
              Confirm Delete
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.muted }}>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.border,
                  color: colors.foreground,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => userToDelete && handleDeleteUser(userToDelete)}
                className="px-4 py-2 rounded-lg text-sm text-white"
                style={{ backgroundColor: colors.destructive }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal (Role & Info Change) */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="rounded-lg p-6 max-w-lg w-full"
            style={{ backgroundColor: colors.card }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon
                  className="h-6 w-6"
                  style={{ color: colors.primary }}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: colors.foreground }}
                >
                  Edit User
                </h3>
              </div>
              <button onClick={() => setShowEditModal(false)}>
                <XMarkIcon
                  className="h-6 w-6"
                  style={{ color: colors.muted }}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm mb-1"
                    style={{ color: colors.muted }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                    }}
                    value={editFormData.firstName || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-1"
                    style={{ color: colors.muted }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                    }}
                    value={editFormData.lastName || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: colors.muted }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  value={editFormData.email || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: colors.muted }}
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  value={editFormData.phoneNumber || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: colors.muted }}
                >
                  Role
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border capitalize"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  value={editFormData.role || "student"}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, role: e.target.value })
                  }
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div
              className="flex justify-end space-x-3 mt-6 pt-4 border-t"
              style={{ borderColor: colors.border }}
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: colors.border,
                  color: colors.foreground,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={savingUser}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: colors.primary }}
              >
                {savingUser ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPageContent;
