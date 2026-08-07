import { Metadata } from "next";
import CoursesDetails from "./copmonents/CoursesDetails";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

// Force this page to be rendered dynamically
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch course data for SEO
async function getCourseDataForSEO(slug: string) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://apichalakchamps.vercel.app";

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

// Dynamic SEO Metadata
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

  const description =
    (isBangla
      ? course?.content?.overview?.content?.bn
      : course?.content?.overview?.content?.en) ||
    course?.description ||
    "";

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

// Page Component
export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <CoursesDetails slug={slug} />;
}
