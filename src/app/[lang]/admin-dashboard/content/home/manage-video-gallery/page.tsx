"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Save,
  Loader2,
  Globe,
  Sparkles,
  RotateCcw,
  UploadCloud,
  X,
  Plus,
  Trash2,
  Youtube,
} from "lucide-react";
import api from "@/lib/api";

// --- TYPES ---
interface VideoItem {
  _tempId: string;
  youtubeId: string;
  rawInput: string;
  thumbnail: string;
  file: File | null;
  preview: string | null;
  isActive: boolean;
}

interface SectionText {
  en: string;
  bn: string;
}

// --- SMART YOUTUBE URL PARSER ---
const extractYoutubeId = (input: string): string => {
  if (!input) return "";
  const trimmed = input.trim();
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regex);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return "";
};

const normalizeThumbnailUrl = (thumbnail: string): string => {
  const trimmed = thumbnail.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export default function ManageVideoGallery() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [sectionTitle, setSectionTitle] = useState<SectionText>({ en: "", bn: "" });
  const [sectionSubtitle, setSectionSubtitle] = useState<SectionText>({ en: "", bn: "" });
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const inputClass =
    "w-full border border-gray-300 p-3 rounded-xl text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-[#F3056D]/20 focus:border-[#F3056D] outline-none transition-shadow bg-white";

  const fileClass =
    "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/video-gallery");
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          setSectionTitle({ en: data.title || "", bn: data.subtitle || "" });
          const mappedVideos = (data.videos || []).map((v: any, index: number) => {
            const thumbnail = normalizeThumbnailUrl(v.thumbnail || "");
            return {
              _tempId: `vid-${Date.now()}-${index}`,
              youtubeId: v.youtubeId,
              rawInput: v.youtubeId,
              thumbnail: v.thumbnail || "",
              file: null,
              preview: thumbnail || null,
              isActive: v.isActive !== false,
            };
          });
          setVideos(mappedVideos);
        }
      } catch (err) {
        console.error("Failed to load video gallery data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<SectionText>>
  ) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (successMsg) setSuccessMsg("");
  };

  const addVideo = () => {
    setVideos((prev) => [
      ...prev,
      {
        _tempId: `new-${Date.now()}`,
        youtubeId: "",
        rawInput: "",
        thumbnail: "",
        file: null,
        preview: null,
        isActive: true,
      },
    ]);
    if (successMsg) setSuccessMsg("");
  };

  // ✅ UPDATED: Calls API to delete from DB and R2, then removes from UI
  const removeVideo = async (tempId: string) => {
    const video = videos.find((v) => v._tempId === tempId);
    if (!video) return;

    // If it has a valid ID, it's in the database. Ask to delete permanently.
    if (video.youtubeId) {
      if (!confirm(`Delete this video permanently from the database?`)) return;
      try {
        await api.delete(`/api/video-gallery/${video.youtubeId}`);
      } catch (err) {
        alert("Failed to delete from server.");
        return;
      }
    }

    // Remove from local state
    setVideos((prev) => prev.filter((v) => v._tempId !== tempId));
    if (successMsg) setSuccessMsg("");
  };

  const handleVideoLinkChange = (tempId: string, value: string) => {
    const extractedId = extractYoutubeId(value);
    setVideos((prev) =>
      prev.map((v) =>
        v._tempId === tempId
          ? { ...v, rawInput: value, youtubeId: extractedId }
          : v
      )
    );
    if (successMsg) setSuccessMsg("");
  };

  const handleThumbnailChange = (tempId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideos((prev) =>
      prev.map((v) =>
        v._tempId === tempId
          ? { ...v, file, preview: URL.createObjectURL(file) }
          : v
      )
    );
    if (successMsg) setSuccessMsg("");
  };

  const removeThumbnail = (tempId: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v._tempId === tempId
          ? { ...v, file: null, preview: null, thumbnail: "" }
          : v
      )
    );
  };

  const toggleActive = (tempId: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v._tempId === tempId ? { ...v, isActive: !v.isActive } : v
      )
    );
  };

  const handleReset = () => {
    setSectionTitle({ en: "", bn: "" });
    setSectionSubtitle({ en: "", bn: "" });
    setVideos([]);
    setSuccessMsg("");
  };

  // ✅ UPDATED: Uses FormData to send actual files to backend for R2 upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    const invalidVideo = videos.find((v) => v.isActive && !v.youtubeId);
    if (invalidVideo) {
      alert(`Invalid YouTube link: "${invalidVideo.rawInput}"`);
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title: sectionTitle.en,
        subtitle: sectionTitle.bn,
        videos: videos.map((v) => ({
          youtubeId: v.youtubeId,
          // If a new file was selected, send a placeholder string.
          // The backend will map this to the corresponding uploaded file.
          thumbnail: v.file ? "__NEW_FILE__" : v.thumbnail, 
          order: 0,
          isActive: v.isActive,
        })),
      };

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));

      // Append only the new files that were selected
      videos.forEach((v) => {
        if (v.file) {
          fd.append("thumbnails", v.file);
        }
      });

      const res = await api.post("/api/video-gallery", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000, // Give it time to upload to R2
      });

      if (res.data.success) {
        setSuccessMsg("Video gallery updated successfully!");
      } else {
        alert("Failed to save video gallery.");
      }
    } catch (error) {
      console.error("Failed to save video gallery", error);
      const message =
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message || error.message
          : "Server error while saving.";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#F3056D] mb-4" />
        <p className="text-lg font-semibold">Loading Video Gallery Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Video Gallery Settings
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FFD700] rounded-full shadow-sm shadow-[#FFD700]/50" />
              Manage homepage YouTube shorts section
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b bg-gray-50/80">
            <h2 className="text-xl font-bold text-[#214187] flex items-center gap-3">
              <div className="p-2 bg-[#F3056D] rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Edit Gallery Content
            </h2>
          </div>

          <div className="p-8">
            {successMsg && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-[#F3056D] pl-4">
                  1. Section Headlines
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-[#214187]" />
                      <span className="text-sm font-bold text-[#214187] uppercase tracking-wider">English</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Main Title <span className="text-[#F3056D]">*</span></label>
                      <input
                        name="en"
                        value={sectionTitle.en}
                        onChange={(e) => handleTextChange(e, setSectionTitle)}
                        required
                        maxLength={150}
                        className={inputClass}
                        placeholder="e.g., Why we are the first choice..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-[#F3056D]" />
                      <span className="text-sm font-bold text-[#F3056D] uppercase tracking-wider">বাংলা</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">প্রধান শিরোনাম <span className="text-[#F3056D]">*</span></label>
                      <input
                        name="bn"
                        value={sectionTitle.bn}
                        onChange={(e) => handleTextChange(e, setSectionTitle)}
                        required
                        maxLength={150}
                        className={inputClass}
                        placeholder="e.g., কেন আমরাই শিক্ষার্থীদের প্রথম পছন্দ..."
                        lang="bn"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-[#F9FAFB] p-6 rounded-2xl border border-gray-100 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#214187]">2. YouTube Shorts List</h3>
                  <button
                    type="button"
                    onClick={addVideo}
                    className="flex items-center gap-2 px-4 py-2 bg-[#214187] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3468] transition shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Video
                  </button>
                </div>

                {videos.length === 0 && (
                  <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <Youtube className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No videos added yet.</p>
                    <p className="text-sm mt-1">Click &quot;Add Video&quot; to get started.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {videos.map((video, index) => (
                    <div
                      key={video._tempId}
                      className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 relative group"
                    >
                      <div className="flex justify-between items-center border-b pb-3">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">{index + 1}</span>
                          Video Entry
                        </h4>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs font-medium text-gray-500">Active</span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={video.isActive}
                                onChange={() => toggleActive(video._tempId)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F3056D]"></div>
                            </div>
                          </label>

                          <button
                            type="button"
                            onClick={() => removeVideo(video._tempId)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          YouTube Video Link <span className="text-[#F3056D]">*</span>
                        </label>
                        <div className="relative">
                          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                          <input
                            value={video.rawInput}
                            onChange={(e) => handleVideoLinkChange(video._tempId, e.target.value)}
                            required
                            placeholder="https://www.youtube.com/watch?v=..."
                            className={`${inputClass} pl-10 ${
                              video.rawInput && !video.youtubeId ? "border-red-400 focus:ring-red-200 focus:border-red-400" : ""
                            }`}
                          />
                        </div>
                        {video.rawInput && !video.youtubeId && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <X className="w-3 h-3" /> Invalid YouTube link format.
                          </p>
                        )}
                        {video.youtubeId && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            ✓ Valid ID extracted: {video.youtubeId}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">
                          Custom Thumbnail
                        </label>
                        <div className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                          {video.preview ? (
                            <>
                              <Image
                                src={video.preview}
                                alt="Thumbnail Preview"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                              <button
                                type="button"
                                onClick={() => removeThumbnail(video._tempId)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow z-10"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div className="text-center text-gray-400 p-4">
                              <UploadCloud className="w-8 h-8 mx-auto mb-1 text-gray-300" />
                              <p className="text-xs font-medium">Upload custom thumb</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleThumbnailChange(video._tempId, e)}
                          className={fileClass}
                        />
                        <p className="text-[10px] text-gray-400">Leave blank to use default YouTube thumbnail.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-8 border-t border-gray-200 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition disabled:opacity-50"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Clear Form
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={saving || videos.length === 0}
                  className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all shadow-lg ${
                    saving || videos.length === 0
                      ? "bg-gray-400 cursor-not-allowed shadow-none"
                      : "bg-[#F3056D] hover:bg-[#d9045c] shadow-[#F3056D]/30 hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? "Saving to Cloud..." : "Save Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}