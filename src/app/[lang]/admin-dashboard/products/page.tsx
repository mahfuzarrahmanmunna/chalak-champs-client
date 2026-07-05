"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Loader2,
  Trash2,
  Edit3,
  Eye,
  Image as ImageIcon,
  Package,
  ArrowRight,
} from "lucide-react";

export default function ProductsListPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await axios.get("/api/products");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: any) => {
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  const parseTitle = (title: any) => {
    if (!title) return { en: "", bn: "" };
    if (typeof title === "object") return title;
    try {
      return JSON.parse(title);
    } catch {
      return { en: String(title), bn: "" };
    }
  };

  const products = data?.data || [];
  const publishedCount = products.filter((p: any) => p.isPublished).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3056D]/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#F3056D]" />
                </div>
                Products
              </h1>
              <p className="text-gray-500 mt-1 ml-[52px]">
                {products.length} total &middot; {publishedCount} published
              </p>
            </div>
            <Link
              href={`/${lang}/dashboard/products/create`}
              className="inline-flex items-center gap-2 bg-[#F3056D] hover:bg-[#F3056D]/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#F3056D]/20 transition-all hover:shadow-xl hover:shadow-[#F3056D]/30"
            >
              <Plus className="w-4 h-4" />
              Create Product
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#F3056D]" />
              <span className="text-sm text-gray-500">Loading products...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-500 font-medium">
                Failed to load products
              </p>
              <button
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["admin-products"],
                  })
                }
                className="text-sm text-[#F3056D] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#F3056D]/5 flex items-center justify-center">
                <Package className="w-8 h-8 text-[#F3056D]/40" />
              </div>
              <div className="text-center">
                <p className="text-gray-900 font-semibold text-lg">
                  No products yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Create your first product to get started.
                </p>
              </div>
              <Link
                href={`/${lang}/dashboard/products/create`}
                className="inline-flex items-center gap-2 bg-[#F3056D] hover:bg-[#F3056D]/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-[#F3056D]/20 transition-all mt-2"
              >
                <Plus className="w-4 h-4" />
                Create Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product: any) => {
                    const title = parseTitle(product.title);
                    return (
                      <tr
                        key={product._id ?? `product-${Math.random()}`}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        {/* Product Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={title?.en || ""}
                                className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate max-w-[260px]">
                                {title?.en || "Untitled"}
                              </p>
                              {title?.bn && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[260px]">
                                  {title.bn}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#214187]/8 text-[#214187] uppercase tracking-wide">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-gray-900">
                              ৳{product.fee}
                            </span>
                            {product.originalFee &&
                              product.originalFee > product.fee && (
                                <span className="text-xs text-gray-400 line-through">
                                  ৳{product.originalFee}
                                </span>
                              )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg ${
                              product.isPublished
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                product.isPublished
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {product.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/${lang}/products/${product._id}`}
                              target="_blank"
                              className="p-2.5 text-gray-500 hover:text-[#214187] hover:bg-[#214187]/5 rounded-lg transition-all"
                              title="View on site"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/${lang}/dashboard/products/${product._id}/edit`}
                              className="p-2.5 text-gray-500 hover:text-[#F3056D] hover:bg-[#F3056D]/5 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(
                                  product._id,
                                  title?.en || "Untitled",
                                )
                              }
                              disabled={deleteMutation.isPending}
                              className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                              title="Delete"
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
