// src/app/admin-dashboard/manual-payments/page.tsx

"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  User,
  CreditCard,
  Hash,
  AlertCircle,
  RefreshCw,
  FileText,
  DollarSign,
  Inbox,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper to fix missing https:// in image URLs
const formatImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export default function AdminManualPaymentsPage() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  // --- Data Fetching (React Query) ---
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["manualPayments", filter],
    queryFn: async () => {
      if (!currentUser) return [];
      const idToken = await currentUser.getIdToken();
      const res = await fetch(`${BACKEND_URL}/api/manual-payment?status=${filter}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch payments");
      return json.data || [];
    },
    enabled: !!currentUser,
  });

  // --- Mutations (React Query) ---
  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "approve" | "reject" }) => {
      if (!currentUser) throw new Error("Not authenticated");
      const idToken = await currentUser.getIdToken();
      const res = await fetch(`${BACKEND_URL}/api/manual-payment/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || `Failed to ${action} payment`);
      return json;
    },
    onSuccess: () => {
      // Invalidate query to trigger automatic refetch
      queryClient.invalidateQueries({ queryKey: ["manualPayments"] });
    },
    onError: (err: any) => {
      alert(err.message || "Action failed");
    },
  });

  const getStatusColor = (status: string) => {
    if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#214187] rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Manual Payments
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-14">
              Review, verify, and approve manual payment submissions.
            </p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white p-2 rounded-xl border border-gray-200 w-fit shadow-sm ml-14 lg:ml-0">
            {(["pending", "approved", "rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  filter === tab ? "bg-[#214187] text-white shadow-md shadow-[#214187]/20" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {isError ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-10 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-3">
              Failed to Load Payments
            </h3>
            <p className="text-red-600 text-sm mb-6 max-w-lg mx-auto">
              {error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="bg-gray-50 h-12 border-t border-gray-100" />
              </div>
            ))}
          </div>
        ) : data?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-600 mb-1">No {filter} payments</h3>
            <p className="text-sm text-gray-400">
              There are currently no payment requests in this category.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((payment: any) => {
              const course = payment.course || {};
              const user = payment.user || {};
              const isMutating = actionMutation.isPending && actionMutation.variables?.id === payment._id;

              return (
                <div
                  key={payment._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
                    
                    {/* Course Info */}
                    <div className="md:border-r border-gray-100 md:pr-6">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Course Info
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0 border border-gray-200">
                          {course.thumbnail ? (
                            <Image
                              src={formatImageUrl(course.thumbnail)}
                              alt="Course"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
                            {course.title?.en || "Unknown Course"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Amount:{" "}
                            <span className="font-bold text-[#F3056D]">
                              ৳{payment.amount?.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="md:border-r border-gray-100 md:pr-6">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Student Info
                      </h4>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium truncate">{payment.userName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a
                            href={`tel:${payment.userPhone}`}
                            className="text-[#214187] hover:underline font-medium"
                          >
                            {payment.userPhone}
                          </a>
                        </div>
                        {user.email && (
                          <div className="flex items-center gap-2 text-gray-500 text-xs truncate">
                            <span>{user.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transaction Info */}
                    <div>
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Transaction Details
                      </h4>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 capitalize">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{payment.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="font-mono font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-200 text-xs">
                            {payment.transactionId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusColor(payment.status)}`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  {payment.status === "pending" && (
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end gap-3">
                      <button
                        onClick={() =>
                          actionMutation.mutate({ id: payment._id, action: "reject" })
                        }
                        disabled={isMutating}
                        className="px-4 py-2 text-red-600 border border-red-200 bg-white rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMutating && actionMutation.variables?.action === "reject" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          actionMutation.mutate({ id: payment._id, action: "approve" })
                        }
                        disabled={isMutating}
                        className="px-4 py-2 text-white bg-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMutating && actionMutation.variables?.action === "approve" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Verify & Approve
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}