"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { X, Upload, Play, Image as ImageIcon, Loader2 } from "lucide-react";

interface ModuleFormData {
  title: string;
  titleBn: string;
  description: string;
  videoUrl: string;
  isPublished: boolean;
  thumbnail: FileList; // For file input
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  module: any; // Pass module if editing
}

export default function ModuleFormModal({
  isOpen,
  onClose,
  courseId,
  module,
}: Props) {
  const queryClient = useQueryClient();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ModuleFormData>({
    defaultValues: module || {
      title: "",
      titleBn: "",
      description: "",
      videoUrl: "",
      isPublished: false,
    },
  });

  // Watch thumbnail file for preview
  const thumbnailFile = watch("thumbnail");

  useEffect(() => {
    if (thumbnailFile && thumbnailFile[0]) {
      setThumbnailPreview(URL.createObjectURL(thumbnailFile[0]));
    } else if (module?.thumbnail) {
      setThumbnailPreview(module.thumbnail);
    } else {
      setThumbnailPreview("");
    }
  }, [thumbnailFile, module]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      // Text fields
      Object.keys(data).forEach((key) => {
        if (key === "thumbnail") {
          if (data[key] instanceof FileList && data[key][0]) {
            formData.append("thumbnail", data[key][0]);
          }
          return;
        }
        if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
          formData.append(key, String(data[key]));
        }
      });

      const url = module
        ? `/api/courses/modules/${module._id}`
        : `/api/courses/${courseId}/modules`;
      const method = module ? "put" : "post";

      return axios[method](url, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseStructure", courseId],
      });
      onClose();
      reset();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-[#F3056D] text-white">
          <h3 className="text-xl font-bold">
            {module ? "Edit Module" : "New Module"}
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-pink-600 rounded-full p-1 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="p-6 space-y-4"
        >
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Thumbnail Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <span className="sr-only">Choose photo</span>
                <input
                  type="file"
                  {...register("thumbnail")}
                  accept="image/*"
                  className="hidden"
                />
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-8 w-8 text-[#F3056D]" />
                    <div className="text-xs text-gray-600">
                      Click to upload image
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                Title (EN)
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full p-2 border rounded-lg"
                placeholder="Module 1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                শিরোনাম (BN)
              </label>
              <input
                {...register("titleBn")}
                className="w-full p-2 border rounded-lg"
                placeholder="মডিউল ১"
                lang="bn"
              />
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-2">
              <Play className="w-3 h-3" /> Intro Video URL (Optional)
            </label>
            <input
              {...register("videoUrl")}
              className="w-full p-2 border rounded-lg"
              placeholder="https://vimeo.com/..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded-lg h-20 resize-none"
              placeholder="Brief overview..."
            />
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="pub"
              {...register("isPublished")}
              className="w-4 h-4 text-[#F3056D] rounded"
            />
            <label htmlFor="pub" className="text-sm font-medium text-gray-700">
              Publish Immediately
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2 bg-[#214187] text-white font-bold rounded-lg hover:bg-[#1a336b] transition flex items-center gap-2"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Module"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
