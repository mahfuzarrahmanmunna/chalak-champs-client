// src/app/[lang]/coursedetails/[slug]/page.tsx

import CoursesDetails from "../CoursesDetails";

// Auto-generate params from your courses data
export function generateStaticParams() {
  const languages = ["en", "bn"];

  return languages.flatMap((lang) =>
    (coursesData.courses || []).map((course: { slug: string }) => ({
      lang,
      slug: course.slug,
    })),
  );
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const course = coursesData.courses?.find(
    (c: { slug: string }) => c.slug === params.slug,
  );

  return {
    title: course?.hero?.title || "Course Details",
    description: course?.hero?.subtitle || "Course Details",
    openGraph: {
      title: course?.hero?.title || "Course Details",
      description: course?.hero?.subtitle || "",
      images: course?.mediaAssets?.[0]?.src
        ? [{ url: course.mediaAssets[0].src }]
        : [],
    },
  };
}

export default function Page({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  return <CoursesDetails slug={params.slug} />;
}
