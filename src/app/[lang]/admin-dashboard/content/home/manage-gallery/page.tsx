"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Save, Loader2, Trash2 } from "lucide-react";
import { normalizeImageUrl } from "@/lib/normalizeImageUrl";

const inputClass = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F3056D]/10 file:text-[#F3056D] hover:file:bg-[#F3056D]/20 cursor-pointer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://apichalakchamps.vercel.app";
const normalizedApiBaseUrl = API_BASE_URL.replace(/\/+$/, "");
const GALLERY_API_URL = /\/api$/i.test(normalizedApiBaseUrl)
  ? `${normalizedApiBaseUrl}/gallery`
  : `${normalizedApiBaseUrl}/api/gallery`;

export default function ManageGallery() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [rowOne, setRowOne] = useState<{ url: string; alt: string }[]>([]);
  const [rowTwo, setRowTwo] = useState<{ url: string; alt: string }[]>([]);

  const [newRowOneFiles, setNewRowOneFiles] = useState<File[]>([]);
  const [newRowTwoFiles, setNewRowTwoFiles] = useState<File[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(GALLERY_API_URL);
        if (!res.ok) {
          throw new Error(`Gallery request failed (${res.status})`);
        }

        const data = await res.json();
        if (data.success) {
          setRowOne(
            (data.data.rowOneImages || []).map((image: { url: string; alt: string }) => ({
              ...image,
              url: normalizeImageUrl(image.url),
            })),
          );
          setRowTwo(
            (data.data.rowTwoImages || []).map((image: { url: string; alt: string }) => ({
              ...image,
              url: normalizeImageUrl(image.url),
            })),
          );
        } else {
          throw new Error(data.message || "Invalid gallery response");
        }
      } catch (err) {
        console.error("Failed to load gallery", err);
        setErrorMsg(
          err instanceof Error ? err.message : "Failed to load gallery images.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, row: 1 | 2) => {
    const files = Array.from(e.target.files || []);
    if (row === 1) setNewRowOneFiles((prev) => [...prev, ...files]);
    else setNewRowTwoFiles((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (index: number, row: 1 | 2) => {
    if (row === 1) setRowOne((prev) => prev.filter((_, i) => i !== index));
    else setRowTwo((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number, row: 1 | 2) => {
    if (row === 1) setNewRowOneFiles((prev) => prev.filter((_, i) => i !== index));
    else setNewRowTwoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("existingRowOne", JSON.stringify(rowOne));
      formData.append("existingRowTwo", JSON.stringify(rowTwo));

      newRowOneFiles.forEach((file) => formData.append("rowOneImages", file));
      newRowTwoFiles.forEach((file) => formData.append("rowTwoImages", file));

      const res = await fetch(GALLERY_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || `Gallery save failed (${res.status})`,
        );
      }

      const data = await res.json();
      if (!data.success || !data.data) {
        throw new Error(data.message || "The server did not save the gallery.");
      }
      setSuccessMsg("Gallery updated successfully!");
      setRowOne(
        (data.data.rowOneImages || []).map((image: { url: string; alt: string }) => ({
          ...image,
          url: normalizeImageUrl(image.url),
        })),
      );
      setRowTwo(
        (data.data.rowTwoImages || []).map((image: { url: string; alt: string }) => ({
          ...image,
          url: normalizeImageUrl(image.url),
        })),
      );
      setNewRowOneFiles([]);
      setNewRowTwoFiles([]);
    } catch (error) {
      console.error("Failed to save gallery", error);
      setErrorMsg(
        error instanceof Error ? error.message : "Server error while saving.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#F3056D]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Gallery Settings</h1>
      
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12 bg-white p-8 rounded-2xl shadow-sm">
        
        {/* Row 1 Editor */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#214187]">Row 1 (Left to Right)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rowOne.map((img, index) => (
              <div key={index} className="relative h-32 rounded-xl overflow-hidden border">
                <Image src={normalizeImageUrl(img.url)} alt={img.alt} fill className="object-cover" />
                <button type="button" onClick={() => removeExistingImage(index, 1)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {newRowOneFiles.map((file, index) => (
              <div key={`new1-${index}`} className="relative h-32 rounded-xl overflow-hidden border">
                <Image src={URL.createObjectURL(file)} alt="New" fill className="object-cover" />
                <button type="button" onClick={() => removeNewFile(index, 1)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={(e) => handleFileSelect(e, 1)} className={inputClass} />
        </div>

        {/* Row 2 Editor */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#214187]">Row 2 (Right to Left)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rowTwo.map((img, index) => (
              <div key={index} className="relative h-32 rounded-xl overflow-hidden border">
                <Image src={normalizeImageUrl(img.url)} alt={img.alt} fill className="object-cover" />
                <button type="button" onClick={() => removeExistingImage(index, 2)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {newRowTwoFiles.map((file, index) => (
              <div key={`new2-${index}`} className="relative h-32 rounded-xl overflow-hidden border">
                <Image src={URL.createObjectURL(file)} alt="New" fill className="object-cover" />
                <button type="button" onClick={() => removeNewFile(index, 2)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={(e) => handleFileSelect(e, 2)} className={inputClass} />
        </div>

        <button type="submit" disabled={saving} className="w-full px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white bg-[#F3056D] hover:bg-[#d9045c] transition disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Uploading..." : "Save Gallery"}
        </button>
      </form>
    </div>
  );
}