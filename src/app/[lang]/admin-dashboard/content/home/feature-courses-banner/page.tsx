// app/[lang]/admin-dashboard/content/home/feature-courses-banner/page.tsx

"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  createFeatureCoursesBanner,
  listFeatureCoursesBanners,
  updateFeatureCoursesBanner,
  deleteFeatureCoursesBanner,
  type FeatureCoursesBannerData,
} from "@/app/services/featureCoursesBannerService";

type FormMode = "idle" | "create" | "edit";

interface FormState {
  lang: "en" | "bn";
  imageFile: File | null;
  link: string;
  altText: string;
  active: boolean;
}

const EMPTY_FORM: FormState = {
  lang: "en",
  imageFile: null,
  link: "",
  altText: "",
  active: true,
};

// ---------- Component ----------

const FeatureCoursesBannerAdmin = () => {
  // --- List state ---
  const [banners, setBanners] = useState<FeatureCoursesBannerData[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // --- Form state ---
  const [mode, setMode] = useState<FormMode>("idle");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- Preview state ---
  const [imagePreview, setImagePreview] = useState<string>("");
  const previewUrlRef = useRef<string>("");

  // --- Delete confirmation ---
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- Toast ---
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ========== HELPERS: Object URL cleanup ==========
  const setSafePreview = (url: string) => {
    if (previewUrlRef.current && previewUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = url;
    setImagePreview(url);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current && previewUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // ========== LOAD LIST ==========
  const loadList = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const data = await listFeatureCoursesBanners();
      setBanners(data);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ========== FORM HELPERS ==========

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setSafePreview("");
    setEditingId(null);
    setMode("create");
    setFormError(null);
  };

  const openEdit = (banner: FeatureCoursesBannerData) => {
    setForm({
      lang: banner.lang,
      imageFile: null, // Don't fetch the file back, just show preview
      link: banner.link,
      altText: banner.altText,
      active: banner.active,
    });
    setSafePreview(banner.image); // Show existing R2 URL
    setEditingId(banner._id);
    setMode("edit");
    setFormError(null);
  };

  const cancelForm = () => {
    setMode("idle");
    setFormError(null);
    setSafePreview("");
  };

  // ========== IMAGE UPLOAD ==========

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select an image file.");
      return;
    }

    // Store the actual File object
    setForm((prev) => ({ ...prev, imageFile: file }));

    // Generate local blob preview
    const objectUrl = URL.createObjectURL(file);
    setSafePreview(objectUrl);

    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  // ========== SUBMIT ==========

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      // Require file on create, optional on edit
      if (mode === "create" && !form.imageFile) {
        setFormError("Banner image is required.");
        setFormLoading(false);
        return;
      }

      if (mode === "create") {
        await createFeatureCoursesBanner({
          lang: form.lang,
          imageFile: form.imageFile!,
          link: form.link,
          altText: form.altText,
          active: form.active,
        });
        showToast("Banner created successfully!");
      } else if (mode === "edit" && editingId) {
        await updateFeatureCoursesBanner(editingId, {
          lang: form.lang,
          imageFile: form.imageFile || undefined,
          link: form.link,
          altText: form.altText,
          active: form.active,
        });
        showToast("Banner updated successfully!");
      }

      cancelForm();
      loadList();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setFormLoading(false);
    }
  };

  // ========== DELETE ==========

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteFeatureCoursesBanner(deleteTarget);
      showToast("Banner deleted.");
      setDeleteTarget(null);
      loadList();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Banner?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. The image will also be removed from
              R2 storage.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Feature Courses Banner
            </h1>
            <p className="text-gray-500 mt-1">
              Manage the discount/promo banner shown on the homepage.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
          >
            + Add Banner
          </button>
        </div>

        {/* ============ FORM (Create / Edit) ============ */}
        {mode !== "idle" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {mode === "create" ? "Create New Banner" : "Edit Banner"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.lang}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      lang: e.target.value as "en" | "bn",
                    }))
                  }
                  className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা (Bangla)</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Banner Image <span className="text-red-500">*</span>
                  {mode === "edit" && (
                    <span className="text-gray-400 font-normal ml-2">
                      (Leave empty to keep current image)
                    </span>
                  )}
                </label>

                {/* Preview */}
                {imagePreview && (
                  <div className="mb-3 relative w-full max-w-2xl aspect-[5/2] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized={imagePreview.startsWith("data:")}
                    />
                  </div>
                )}

                {/* File Input */}
                <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition text-sm text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {form.imageFile ? form.imageFile.name : "Choose Image File"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Destination Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="/en/coursedetails"
                  value={form.link}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Alt Text
                </label>
                <input
                  type="text"
                  placeholder="Describe the image for accessibility"
                  value={form.altText}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      altText: e.target.value,
                    }))
                  }
                  className="w-full max-w-lg border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, active: !prev.active }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.active ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">
                  {form.active
                    ? "Active — will show on frontend"
                    : "Inactive — hidden from frontend"}
                </span>
              </div>

              {/* Form Error */}
              {formError && (
                <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                  {formError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={
                    formLoading ||
                    !form.link ||
                    (mode === "create" && !form.imageFile)
                  }
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading
                    ? "Uploading..."
                    : mode === "create"
                      ? "Create Banner"
                      : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============ LIST ============ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Lang</div>
            <div className="col-span-4">Preview</div>
            <div className="col-span-3">Link</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* List Body */}
          {listLoading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : listError ? (
            <div className="p-12 text-center text-red-500">{listError}</div>
          ) : banners.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No banners yet. Click &quot;+ Add Banner&quot; to create one.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition"
                >
                  {/* Lang badge */}
                  <div className="col-span-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        banner.lang === "bn"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {banner.lang.toUpperCase()}
                    </span>
                  </div>

                  {/* Image preview */}
                  <div className="col-span-4">
                    <div className="relative w-full aspect-[5/2] rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <Image
                        src={banner.image}
                        alt={banner.altText}
                        fill
                        className="object-contain"
                        unoptimized={banner.image.startsWith("data:")}
                      />
                    </div>
                  </div>

                  {/* Link */}
                  <div className="col-span-3">
                    <p
                      className="text-sm text-gray-700 truncate"
                      title={banner.link}
                    >
                      {banner.link}
                    </p>
                    <p
                      className="text-xs text-gray-400 mt-0.5 truncate"
                      title={banner.altText}
                    >
                      {banner.altText || "No alt text"}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        banner.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {banner.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex gap-2 justify-end">
                    <button
                      onClick={() => openEdit(banner)}
                      className="px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(banner._id)}
                      className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Minimal toast animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(-10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
          `,
        }}
      />
    </div>
  );
};

export default FeatureCoursesBannerAdmin;
