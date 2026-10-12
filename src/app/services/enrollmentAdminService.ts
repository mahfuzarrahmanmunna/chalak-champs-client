import api from "@/lib/api"; // Ensure this points to your Axios instance

export interface AdminEnrollment {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  courseId: string;
  courseTitle: string;
  amount: string;
  status: "active" | "expired" | "revoked";
  createdAt: string;
}

export const getAllEnrollments = async () => {
  const res = await api.get("/api/enrollments/all");
  return res.data;
};

export const deleteEnrollment = async (id: string) => {
  const res = await api.delete(`/api/enrollments/${id}`);
  return res.data;
};

export const updateEnrollmentStatus = async (id: string, status: string) => {
  const res = await api.patch(`/api/enrollments/${id}/status`, { status });
  return res.data;
};