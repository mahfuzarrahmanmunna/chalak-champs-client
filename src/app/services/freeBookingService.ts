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

// 1. Create Booking
export const createBooking = async (bookingData: BookingData) => {
  const response = await axiosInstance.post("/freebookingprops", bookingData);
  return response.data;
};

// 2. Get All Bookings
export const getAllBookings = async () => {
  const response = await axiosInstance.get("/freebookingprops");
  return response.data;
};

// 3. Delete Booking
export const deleteBooking = async (id: string) => {
  const response = await axiosInstance.delete(`/freebookingprops/${id}`);
  return response.data;
};
