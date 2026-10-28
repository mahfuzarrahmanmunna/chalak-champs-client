"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface Teacher {
  profileId: string | null;
  userId: string;
  hasProfile: boolean;
  displayName: string;
  professionalTitle: string;
  slug: string;
  profilePhotoUrl: string;
  subjects: string[];
  verificationStatus: string;
  approvalStatus: string;
  isPublished: boolean;
  isActive: boolean;
  user: { firstName: string; lastName: string; email: string; role: string };
  updatedAt: string;
}

export default function AdminTeachersPage() {
  const { colors, theme } = useTheme();
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const isDark = theme === "dark";

  // Get lang from URL params — needed because the admin routes live under [lang]
  const routeParams = useParams();
  const lang = (routeParams?.lang as string) || "bn";

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [actionMsg, setActionMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const fetchTeachers = useCallback(async () => {
    try {
      const query = new URLSearchParams({ page: String(page), limit: "10", search });
      if (approvalFilter !== "all") query.append("approvalStatus", approvalFilter);
      if (publishedFilter !== "all") query.append("isPublished", publishedFilter);

      const { data } = await api.get(`/api/admin/teachers?${query}`);
      setTeachers(data.teachers || []);
      setTotalPages(data.pagination?.totalPages || 0);
    } catch (e: any) {
      setActionMsg({ type: "err", text: e?.response?.data?.message || "Failed to load teachers" });
    } finally {
      setLoading(false);
    }
  }, [page, search, approvalFilter, publishedFilter]);

  useEffect(() => {
    if (currentUser) fetchTeachers();
  }, [currentUser, fetchTeachers]);

  // ── status actions ──────────────────────────────────────────
  const patchStatus = async (profileId: string, patch: Record<string, unknown>, label: string) => {
    setSaving(profileId);
    setActionMsg(null);
    try {
      await api.patch(`/api/admin/teachers/${profileId}/status`, patch);
      setActionMsg({ type: "ok", text: `${label} applied` });
      fetchTeachers();
    } catch (e: any) {
      setActionMsg({ type: "err", text: e?.response?.data?.message || `${label} failed` });
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (profileId: string, displayName: string) => {
    if (!confirm(`Permanently delete the teacher profile for ${displayName}? The user account is NOT deleted.`)) return;
    try {
      await api.delete(`/api/admin/teachers/${profileId}`);
      setTeachers((prev) => prev.filter((t) => t.profileId !== profileId));
      setActionMsg({ type: "ok", text: "Teacher profile deleted (user account kept)" });
    } catch (e: any) {
      setActionMsg({ type: "err", text: e?.response?.data?.message || "Delete failed" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" style={{ backgroundColor: colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }} />
      </div>
    );
  }

  const inputCls = "px-3 py-2 rounded-lg border text-sm w-full";
  const inputStyle = { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.foreground }}>
              {String(t.teachers || "Teachers")}
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.muted }}>
              All users with role <code>teacher</code> or <code>instructor</code> are listed here.
              Add teacher details for each, then approve &amp; publish to make them visible publicly.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href={`/${lang}/admin-dashboard/users`}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: colors.primary }}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Assign Teacher Role (Users)
            </Link>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mb-4 p-3 rounded-lg border" style={{
          backgroundColor: actionMsg.type === "ok" ? colors.success + "20" : colors.destructive + "20",
          borderColor: actionMsg.type === "ok" ? colors.success : colors.destructive,
          color: actionMsg.type === "ok" ? colors.success : colors.destructive,
        }}>
          {actionMsg.text}
        </div>
      )}

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5" style={{ color: colors.muted }} />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, title or slug"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              className="block w-full pl-10 pr-3 py-2 rounded-lg border"
              style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}
            />
          </div>
          <select
            value={approvalFilter}
            onChange={(e) => { setPage(1); setApprovalFilter(e.target.value); }}
            className={inputCls}
            style={inputStyle}
          >
            <option value="all">All Approval Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={publishedFilter}
            onChange={(e) => { setPage(1); setPublishedFilter(e.target.value); }}
            className={inputCls}
            style={inputStyle}
          >
            <option value="all">All Publication</option>
            <option value="true">Published</option>
            <option value="false">Unpublished / No profile</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="overflow-hidden rounded-lg shadow-lg" style={{ backgroundColor: colors.card }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: colors.border }}>
              <thead>
                <tr>
                  {["Teacher", "Subjects", "Verification", "Approval", "Published", "Active", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: colors.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: colors.border }}>
                {teachers.map((tr) => (
                  <tr key={tr.userId} style={{ backgroundColor: isDark ? "#334155" : "#f3f4f6" }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {tr.profilePhotoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={tr.profilePhotoUrl} alt={tr.displayName}
                            className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: tr.hasProfile ? colors.primary : colors.muted }}>
                            <span className="text-sm font-medium text-white">
                              {tr.displayName?.charAt(0) || tr.user.firstName?.charAt(0) || "T"}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium" style={{ color: colors.foreground }}>
                            {tr.displayName}
                          </div>
                          <div className="text-xs" style={{ color: colors.muted }}>
                            {tr.user.email}
                            {tr.slug ? ` · /${tr.slug}` : " · no profile yet"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: colors.foreground }}>
                      {tr.hasProfile && tr.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {tr.subjects.slice(0, 3).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-full text-xs"
                              style={{ backgroundColor: colors.accent + "30", color: colors.foreground }}>
                              {s}
                            </span>
                          ))}
                          {tr.subjects.length > 3 && (
                            <span className="text-xs" style={{ color: colors.muted }}>
                              +{tr.subjects.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs italic" style={{ color: colors.muted }}>— no profile —</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {tr.hasProfile ? (
                        <StatusPill colors={colors} status={tr.verificationStatus} />
                      ) : (
                        <span className="text-xs" style={{ color: colors.muted }}>—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {tr.hasProfile ? (
                        <StatusPill colors={colors} status={tr.approvalStatus} />
                      ) : (
                        <span className="text-xs" style={{ color: colors.muted }}>—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {tr.hasProfile ? (
                        tr.isPublished ? (
                          <CheckCircleIcon className="h-5 w-5" style={{ color: colors.success }} />
                        ) : (
                          <XCircleIcon className="h-5 w-5" style={{ color: colors.muted }} />
                        )
                      ) : (
                        <span className="text-xs" style={{ color: colors.muted }}>—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {tr.hasProfile ? (
                        tr.isActive ? (
                          <CheckCircleIcon className="h-5 w-5" style={{ color: colors.success }} />
                        ) : (
                          <XCircleIcon className="h-5 w-5" style={{ color: colors.destructive }} />
                        )
                      ) : (
                        <span className="text-xs" style={{ color: colors.muted }}>—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* Add or Manage button — depends on whether profile exists */}
                        {tr.hasProfile ? (
                          <>
                            {tr.slug && (
                              <Link href={`/${tr.slug}`} target="_blank" title="View public page"
                                className="p-2 rounded hover:opacity-80" style={{ color: colors.muted }}>
                                <EyeIcon className="h-5 w-5" />
                              </Link>
                            )}
                            {/* ✅ Edit link — includes /${lang}/ prefix */}
                            <Link
                              href={`/${lang}/admin-dashboard/users/teachers/edit?profileId=${tr.profileId}&userName=${encodeURIComponent(tr.displayName)}`}
                              title="Edit profile"
                              className="p-2 rounded hover:opacity-80"
                              style={{ color: colors.primary }}
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            {tr.approvalStatus !== "approved" && (
                              <button
                                disabled={saving === tr.profileId}
                                onClick={() => patchStatus(tr.profileId!, { approvalStatus: "approved" }, "Approved")}
                                className="px-2 py-1 rounded text-xs text-white disabled:opacity-50"
                                style={{ backgroundColor: colors.success }}>
                                Approve
                              </button>
                            )}
                            {tr.approvalStatus === "approved" && !tr.isPublished && (
                              <button
                                disabled={saving === tr.profileId}
                                onClick={() => patchStatus(tr.profileId!, { isPublished: true }, "Published")}
                                className="px-2 py-1 rounded text-xs text-white disabled:opacity-50"
                                style={{ backgroundColor: colors.primary }}>
                                Publish
                              </button>
                            )}
                            {tr.isPublished && (
                              <button
                                disabled={saving === tr.profileId}
                                onClick={() => patchStatus(tr.profileId!, { isPublished: false }, "Unpublished")}
                                className="px-2 py-1 rounded text-xs disabled:opacity-50"
                                style={{ backgroundColor: colors.border, color: colors.foreground }}>
                                Unpublish
                              </button>
                            )}
                            {tr.isActive ? (
                              <button
                                disabled={saving === tr.profileId}
                                onClick={() => patchStatus(tr.profileId!, { isActive: false }, "Deactivated")}
                                className="px-2 py-1 rounded text-xs disabled:opacity-50"
                                style={{ backgroundColor: colors.border, color: colors.foreground }}>
                                Deactivate
                              </button>
                            ) : (
                              <button
                                disabled={saving === tr.profileId}
                                onClick={() => patchStatus(tr.profileId!, { isActive: true }, "Activated")}
                                className="px-2 py-1 rounded text-xs text-white disabled:opacity-50"
                                style={{ backgroundColor: colors.success }}>
                                Activate
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(tr.profileId!, tr.displayName)}
                              title="Delete profile (user account stays)"
                              className="p-2 rounded hover:opacity-80" style={{ color: colors.destructive }}>
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          /* ✅ New link — includes /${lang}/ prefix */
                          <Link
                            href={`/${lang}/admin-dashboard/users/teachers/new?userId=${tr.userId}&userName=${encodeURIComponent(`${tr.user.firstName} ${tr.user.lastName}`.trim())}`}
                            title="Create teacher profile"
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                            style={{ backgroundColor: colors.primary }}>
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            Add Teacher Details
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm" style={{ color: colors.muted }}>
                      No users with role <code>teacher</code> or <code>instructor</code> found. Go to{" "}
                      <Link href={`/${lang}/admin-dashboard/users`} className="underline" style={{ color: colors.primary }}>
                        Users
                      </Link>{" "}
                      and assign one of those roles to a user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 sm:px-6 lg:px-8 mt-6 flex items-center justify-between">
        <div className="text-sm" style={{ color: colors.muted }}>Page {page} of {totalPages || 1}</div>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
            style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}>
            Previous
          </button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="px-3 py-1 rounded-lg text-sm disabled:opacity-50"
            style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ colors, status }: { colors: any; status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    pending: { bg: "#f59e0b", fg: "#fff" },
    approved: { bg: colors.success, fg: "#fff" },
    verified: { bg: colors.success, fg: "#fff" },
    rejected: { bg: colors.destructive, fg: "#fff" },
    none: { bg: colors.border, fg: colors.foreground },
  };
  const s = map[status] || { bg: colors.border, fg: colors.foreground };
  return (
    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize"
      style={{ backgroundColor: s.bg, color: s.fg }}>
      {status}
    </span>
  );
}