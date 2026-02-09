// src/app/admin-dashboard/users/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import api from "@/lib/api";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
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

export default function UsersPage() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/admin/users?page=${currentPage}&limit=10&search=${searchTerm}`,
      );

      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm(
        String(
          t.confirmDeleteUser || "Are you sure you want to delete this user?",
        ),
      )
    ) {
      try {
        await api.delete(`/api/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--color-foreground)" }}
          >
            {String(t.users || "Users")}
          </h1>
          <p
            className="mt-2 text-sm text-gray-700"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            {String(
              t.manageUsersDescription || "Manage your platform's users here.",
            )}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
          >
            <UserPlusIcon className="mr-2 h-4 w-4" />
            {String(t.addUser || "Add User")}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={String(t.searchUsers || "Search users")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-card)",
              color: "var(--color-foreground)",
            }}
          />
        </div>
      </div>

      {/* Users table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div
              className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
              style={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <table className="min-w-full divide-y divide-gray-300">
                <thead style={{ borderColor: "var(--color-border)" }}>
                  <tr>
                    <th scope="col" className="relative px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedUsers.length === users.length}
                        onChange={handleSelectAllUsers}
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {String(t.name || "Name")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {String(t.email || "Email")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {String(t.role || "Role")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {String(t.status || "Status")}
                    </th>
                    <th
                      scope="col"
                      className="relative px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {String(t.actions || "Actions")}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-gray-200"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="relative px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center mr-4"
                            style={{ backgroundColor: "var(--color-primary)" }}
                          >
                            <span
                              className="text-sm font-medium"
                              style={{ color: "var(--color-background)" }}
                            >
                              {user.firstName?.charAt(0) ||
                                user.email?.charAt(0) ||
                                "U"}
                            </span>
                          </div>
                          <div>
                            <div
                              className="text-sm font-medium"
                              style={{ color: "var(--color-foreground)" }}
                            >
                              {user.firstName} {user.lastName}
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: "var(--color-muted-foreground)" }}
                            >
                              {user.phoneNumber || "No phone number"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm"
                          style={{ color: "var(--color-foreground)" }}
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
                                ? "var(--color-primary)"
                                : "var(--color-accent)",
                            color: "var(--color-foreground)",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isEmailVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                            style={{
                              backgroundColor: user.isEmailVerified
                                ? "var(--color-success, #10b981)"
                                : "var(--color-destructive, #ef4444)",
                              color: "white",
                            }}
                          >
                            {user.isEmailVerified ? "Email" : "Email"}
                          </span>
                          {user.phoneNumber && (
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isPhoneVerified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                              style={{
                                backgroundColor: user.isPhoneVerified
                                  ? "var(--color-success, #10b981)"
                                  : "var(--color-destructive, #ef4444)",
                                color: "white",
                              }}
                            >
                              {user.isPhoneVerified ? "Phone" : "Phone"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          style={{ color: "var(--color-primary)" }}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900"
                          style={{ color: "var(--color-destructive)" }}
                          onClick={() => handleDeleteUser(user._id)}
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
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div
          className="text-sm text-gray-700"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Showing{" "}
          <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(currentPage * 10, users.length)}
          </span>{" "}
          of <span className="font-medium">{users.length}</span> results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-foreground)",
            }}
          >
            {String(t.previous || "Previous")}
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-foreground)",
            }}
          >
            {String(t.next || "Next")}
          </button>
        </div>
      </div>
    </div>
  );
}
