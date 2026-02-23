"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext"; // Using your global theme hook
import { useLanguage } from "@/app/context/LanguageContext";
import api from "@/lib/api";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckIcon,
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

// This component is now a "client" of the global theme provider
function UsersPageContent() {
  // Consume theme, toggleTheme, and colors from your global context
  const { theme, toggleTheme, colors } = useTheme();
  const { t } = useLanguage();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterEmailVerified, setFilterEmailVerified] = useState<string>("all");
  const [filterPhoneVerified, setFilterPhoneVerified] = useState<string>("all");

  // The 'isDark' check is no longer needed as the 'colors' object
  // is already correctly populated by your theme provider.
  const isDark = theme === "dark";

  useEffect(() => {
    fetchUsers();
  }, [
    currentPage,
    searchTerm,
    filterRole,
    filterEmailVerified,
    filterPhoneVerified,
  ]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
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

      // *** FIX: Corrected the endpoint path ***
      // The baseURL in api.ts already includes '/api', so we only need '/auth/users'
      const response = await api.get(`/auth/users?${params}`);

      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // *** FIX: Corrected the endpoint path ***
      await api.delete(`/auth/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    try {
      // *** FIX: Corrected the endpoint path ***
      await api.delete("/auth/users/bulk", {
        data: { userIds: selectedUsers },
      });
      setUsers(users.filter((user) => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error bulk deleting users:", error);
    }
  };

  if (loading) {
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
              {String(
                t.manageUsersDescription ||
                  "Manage your platform's users here.",
              )}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex sm:items-center space-x-3">
            <button
              onClick={toggleTheme} // Using the global toggleTheme function
              className="p-2 rounded-lg border transition-colors"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
                color: colors.foreground,
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: "#ffffff",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
          {/* Search */}
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon
                className="h-5 w-5"
                style={{ color: colors.muted }}
              />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 rounded-lg leading-5 transition-colors"
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

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.foreground,
            }}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>

          {/* Email Verification Filter */}
          <select
            value={filterEmailVerified}
            onChange={(e) => setFilterEmailVerified(e.target.value)}
            className="px-3 py-2 rounded-lg transition-colors"
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

          {/* Phone Verification Filter */}
          <select
            value={filterPhoneVerified}
            onChange={(e) => setFilterPhoneVerified(e.target.value)}
            className="px-3 py-2 rounded-lg transition-colors"
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
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ accentColor: colors.primary }}
                      checked={selectedUsers.length === users.length}
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
                    {String(t.name || "Name")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    {String(t.email || "Email")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    {String(t.role || "Role")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    {String(t.status || "Status")}
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.muted }}
                  >
                    {String(t.actions || "Actions")}
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
                    className="transition-colors hover:bg-opacity-50"
                    style={{
                      backgroundColor: isDark ? "#334155" : "#f3f4f6",
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
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
                          className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <span className="text-sm font-medium text-white">
                            {user.firstName?.charAt(0) ||
                              user.email?.charAt(0) ||
                              "U"}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm"
                        style={{ color: colors.foreground }}
                      >
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        style={{
                          backgroundColor:
                            user.role === "admin"
                              ? colors.secondary
                              : colors.accent,
                          color: "#ffffff",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span
                          className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: user.isEmailVerified
                              ? colors.success
                              : colors.destructive,
                            color: "#ffffff",
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
                        {user.phoneNumber && (
                          <span
                            className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full"
                            style={{
                              backgroundColor: user.isPhoneVerified
                                ? colors.success
                                : colors.destructive,
                              color: "#ffffff",
                            }}
                          >
                            {user.isPhoneVerified ? (
                              <>
                                <CheckIcon className="h-3 w-3 mr-1" /> Phone
                              </>
                            ) : (
                              <>
                                <XMarkIcon className="h-3 w-3 mr-1" /> Phone
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        className="mr-3 transition-colors"
                        style={{ color: colors.primary }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.7")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="transition-colors"
                        style={{ color: colors.destructive }}
                        onClick={() => {
                          setUserToDelete(user._id);
                          setShowDeleteModal(true);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.7")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
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
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, users.length)} of {users.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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
              className="px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 max-w-md w-full mx-4"
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
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: colors.border,
                  color: colors.foreground,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => userToDelete && handleDeleteUser(userToDelete)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: colors.destructive }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// The component is now simpler and just exports the content,
// relying on the root layout to provide the necessary contexts.
export default UsersPageContent;
