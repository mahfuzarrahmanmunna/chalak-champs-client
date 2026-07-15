const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

const API_BASE = rawApiBaseUrl.replace(/\/+$|\/$/, "");
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

interface EnrollmentPayload {
  name: string;
  phone: string;
  email?: string;
  courseId: string;
  courseTitle: string;
  amount: string;
}

interface EnrollmentResponse {
  success: boolean;
  message: string;
}

export async function createEnrollment(
  payload: EnrollmentPayload,
): Promise<EnrollmentResponse> {
  const res = await fetch(`${API_URL}/enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data;
}
