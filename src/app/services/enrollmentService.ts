import axiosInstance from "@/lib/axios";

export interface EnrollmentPayload {
  name: string;
  phone: string;
  courseId: string;
  courseTitle: string;
  amount: string;
}

export const createEnrollment = async (payload: EnrollmentPayload) => {
  const response = await axiosInstance.post("/api/enrollments", payload);
  return response.data;
};
