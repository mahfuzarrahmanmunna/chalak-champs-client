import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const isBangla = params.lang === "bn";

  return {
    title: isBangla
      ? "গোপনীয়তা নীতি | চালাক চ্যাম্পস"
      : "Privacy Policy | Chalak Champs",
    description: isBangla
      ? "চালাক চ্যাম্পস কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করে তা জানুন।"
      : "Learn how Chalak Champs collects, uses, protects and manages information across its learning platform.",
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
