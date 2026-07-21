import CoursesDetails from "./copmonents/CoursesDetails";

export const metadata = {
  title: "Course Details - Chalak Champs",
  description: "Join our amazing courses for kids.",
};

// ✅ BULLETPROOF VERSION FOR STATIC EXPORT
export async function generateStaticParams() {
  // 1. Try to fetch from API
  let dynamicSlugs: string[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apichalakchamps.vercel.app";
    const res = await fetch(`${apiUrl}/api/courses`, {
      signal: AbortSignal.timeout(3000), // 3s timeout to prevent build hanging
    });
    if (res.ok) {
      const data = await res.json();
      const courses = data?.data || [];
      const slugs = courses.map((c: any) => c.slug).filter(Boolean);
      dynamicSlugs = [...new Set(slugs)];
    }
  } catch (e) {
    console.log("⚠️ API offline during build, using fallback slugs");
  }

  // 2. Fallback: If API failed, use hardcoded slugs so the build doesn't crash
  const slugsToUse = dynamicSlugs.length > 0 
    ? dynamicSlugs 
    : ["sample-course-1", "sample-course-2"]; // Replace with a couple of real slugs from your DB if needed

  // 3. Return paths for both languages
  const params = [];
  for (const lang of ["en", "bn"]) {
    for (const slug of slugsToUse) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  return <CoursesDetails slug={slug} />;
}