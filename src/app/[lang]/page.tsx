import HomeContent from "./HomeContent";

// REQUIRED: Tell Next.js to generate pages for /en and /bn at build time
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;

  return (
    <main className="min-h-screen">
      <HomeContent />
    </main>
  );
}
