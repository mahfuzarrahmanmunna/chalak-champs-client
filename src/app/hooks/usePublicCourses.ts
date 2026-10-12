"use client";

import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";

export interface PublicCourse {
  _id: string;
  slug?: string;
  title: { en?: string; bn?: string };
  thumbnail?: string;
  category?: string;
  instructorName?: string;
  price?: number;
  originalPrice?: number;
  content?: {
    quickInfo?: {
      items?: {
        en?: string[];
        bn?: string[];
      };
    };
  };
}

export function usePublicCourses() {
  return useQuery({
    queryKey: ["public-courses"],
    queryFn: async () => {
      const response = await publicApi.get<{ data: PublicCourse[] }>(
        "/api/courses",
        { params: { published: true } },
      );
      if (!Array.isArray(response.data.data)) {
        throw new Error("Unexpected response from the public courses API");
      }
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
