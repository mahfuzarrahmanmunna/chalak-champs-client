import { Metadata } from "next";
import CoursesDetails from "./copmonents/CoursesDetails";
import { fetchStatic } from "@/lib/staticApi";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

// Server-rendered on every request so data is always live.
export const dynamic = "force-dynamic";

async function getCourseDataForSEO(slug: string) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000";

  try {
    const res = await fetch(`${apiUrl}/api/courses/slug/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  const course = await getCourseDataForSEO(slug);

  const isBangla = lang === "bn";

  if (!course) {
    return {
      title: isBangla ? "কোর্স পাওয়া যায়নি" : "Course Not Found",
      description: isBangla
        ? "এই কোর্সটি পাওয়া যায়নি।"
        : "The requested course was not found.",
    };
  }

  const title =
    (isBangla
      ? course?.content?.hero?.title?.bn
      : course?.content?.hero?.title?.en) ||
    course?.title ||
    "Course";

  const rawDescription =
    (isBangla
      ? course?.content?.overview?.content?.bn
      : course?.content?.overview?.content?.en) ||
    course?.description ||
    "";

  const description = String(rawDescription || "");

  return {
    title,
    description: description.substring(0, 160),
    openGraph: {
      title,
      description: description.substring(0, 160),
      type: "website",
      images: course?.thumbnail ? [course.thumbnail] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // Fetched live on every request.
  const initialResponse = await fetchStatic<any>(
    `/api/courses/slug/${encodeURIComponent(slug)}`,
  );

  return <CoursesDetails slug={slug} initialResponse={initialResponse} />;
}
