import { Metadata } from "next";
import TeachersClient from "./TeachersClient";

// Server-rendered on every request so data is always live.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isBangla = lang === "bn";

  return {
    title: isBangla ? "আমাদের শিক্ষকগণ" : "Our Teachers",
    description: isBangla
      ? "বাংলাদেশের সেরা শিক্ষকদের সাথে পরিচিত হোন। ইংরেজি, গণিত, বিজ্ঞান, আর্ট এবং আরও অনেক বিষয়ে অভিজ্ঞ শিক্ষকদের প্রোফাইল দেখুন।"
      : "Meet Bangladesh's best teachers. Browse profiles of expert educators in English, Math, Science, Art, and more.",
    openGraph: {
      title: isBangla ? "আমাদের শিক্ষকগণ" : "Our Teachers",
      description: isBangla
        ? "বাংলাদেশের সেরা শিক্ষকদের সাথে পরিচিত হোন।"
        : "Meet Bangladesh's best teachers.",
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <TeachersClient lang={lang} />;
}