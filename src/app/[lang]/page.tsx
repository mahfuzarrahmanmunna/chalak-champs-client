import HomeContent from "./HomeContent";

// REQUIRED: Tell Next.js to generate pages for /en and /bn at build time
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }];
}

export default function Home({ params }: { params: { lang: string } }) {
  return (
    <main className="min-h-screen">
      <HomeContent />
    </main>
  );
}
