import { redirect } from 'next/navigation';
// export const dynamic = "force-dynamic";
type SearchParams = Record<string, string | string[] | undefined>;

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(await searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (value !== undefined) {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  redirect(`/bn${queryString ? `?${queryString}` : ""}`);
}
