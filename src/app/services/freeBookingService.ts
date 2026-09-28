// src/app/services/freeBookingService.ts
import axiosInstance from "@/lib/axios";

// Define exact data interface
interface BookingData {
  studentName: string;
  guardianName: string;
  phone: string;
  countryCode: string;
  fullPhone: string;
  studentClass: string;
  course: string;
}

interface VerifyOtpData {
  phone: string;
  countryCode: string;
  otp: string;
}

const FREE_BOOKING_PATH = "/api/freebookingprops";

// 1. Create Booking (backend should also trigger OTP send)
export const createBooking = async (bookingData: BookingData) => {
  const response = await axiosInstance.post(FREE_BOOKING_PATH, bookingData);
  return response.data;
};

// 2. Verify OTP
export const verifyOtp = async (data: VerifyOtpData) => {
  const response = await axiosInstance.post(
    `${FREE_BOOKING_PATH}/verify-otp`,
    data,
  );
  return response.data;
};

// 3. Resend OTP
export const resendOtp = async (data: {
  phone: string;
  countryCode: string;
}) => {
  const response = await axiosInstance.post(
    `${FREE_BOOKING_PATH}/resend-otp`,
    data,
  );
  return response.data;
};

// 4. Get All Bookings
export const getAllBookings = async () => {
  const response = await axiosInstance.get(FREE_BOOKING_PATH);
  return response.data;
};

// 5. Delete Booking
export const deleteBooking = async (id: string) => {
  const response = await axiosInstance.delete(`${FREE_BOOKING_PATH}/${id}`);
  return response.data;
};