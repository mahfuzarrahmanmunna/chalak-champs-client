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

const FREE_BOOKING_PATH = "/api/freebookingprops";

// 1. Create Booking
export const createBooking = async (bookingData: BookingData) => {
  const response = await axiosInstance.post(FREE_BOOKING_PATH, bookingData);
  return response.data;
};

// 2. Get All Bookings
export const getAllBookings = async () => {
  const response = await axiosInstance.get(FREE_BOOKING_PATH);
  return response.data;
};

// 3. Delete Booking
export const deleteBooking = async (id: string) => {
  const response = await axiosInstance.delete(`${FREE_BOOKING_PATH}/${id}`);
  return response.data;
};
