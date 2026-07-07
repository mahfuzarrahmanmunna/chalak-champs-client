// src/app/[lang]/coursedetails/[slug]/page.tsx

import CoursesDetails from "../CoursesDetails";
import coursesDataBangla from "@/app/data/translations/singlecourse-bangla.json";
import coursesDataEnglish from "@/app/data/translations/singlecourse-english.json";

const courseSlugs = Array.from(
  new Set(
    [
      ...(Array.isArray(coursesDataBangla.courses)
        ? coursesDataBangla.courses
        : []),
      ...(Array.isArray(coursesDataEnglish.courses)
        ? coursesDataEnglish.courses
        : []),
    ]
      .map((course) => course?.slug)
      .filter((slug): slug is string => Boolean(slug)),
  ),
);

export function generateStaticParams() {
  return ["en", "bn"].flatMap((lang) =>
    courseSlugs.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const courseData = lang === "bn" ? coursesDataBangla : coursesDataEnglish;
  const course = Array.isArray(courseData.courses)
    ? courseData.courses.find((c: { slug?: string }) => c.slug === slug)
    : null;

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

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  return <CoursesDetails slug={slug} />;
}
