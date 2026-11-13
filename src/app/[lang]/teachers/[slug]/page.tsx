import { Metadata } from "next";
import TeacherDetailClient from "./TeacherDetailClient";
import { fetchStatic } from "@/lib/staticApi";

// Server-rendered on every request so data is always live.
export const dynamic = "force-dynamic";

async function getTeacherForSEO(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${apiUrl}/api/teachers/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.teacher || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const teacher = await getTeacherForSEO(slug);

  if (!teacher) {
    return {
      title: "Teacher Not Found",
      description: "The requested teacher profile was not found.",
    };
  }

  const title = `${teacher.displayName} — ${teacher.professionalTitle || "Teacher"}`;
  const description = teacher.shortIntro || "";

  return {
    title,
    description: description.substring(0, 160),
    openGraph: {
      title,
      description: description.substring(0, 160),
      type: "profile",
      images: teacher.profilePhotoUrl ? [teacher.profilePhotoUrl] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return <TeacherDetailClient lang={lang} slug={slug} />;
}