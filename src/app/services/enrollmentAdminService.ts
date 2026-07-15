const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

const API_BASE = rawApiBaseUrl.replace(/\/+$/, "");
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

export async function getAllEnrollments() {
  const res = await fetch(`${API_URL}/enrollments`, {
    // Add cache: 'no-store' if you want real-time data without Next.js caching
  });
  if (!res.ok) throw new Error("Failed to fetch enrollments");
  return res.json();
}

export async function deleteEnrollment(id: string) {
  const res = await fetch(`${API_URL}/enrollments/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
