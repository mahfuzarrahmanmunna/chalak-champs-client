import HomeContent from "./HomeContent";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "bn" }];
}

export default function Home({ params }: { params: { lang: string } }) {
  return (
    <main>
      <HomeContent />
    </main>
  );
}
