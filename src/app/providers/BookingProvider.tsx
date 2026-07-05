"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import Freebooking from "../components/Freebooking/Freebooking";

// --- 1. Context Types ---
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning";
}

interface BookingContextType {
  isOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
  toast: (message: string, type?: "success" | "error" | "warning") => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// --- 2. Custom Hook ---
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

// --- 3. Toast Component ---
const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000); // Auto remove after 4 seconds
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-orange-50 border-orange-200 text-orange-800",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-600" />,
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right-full duration-300 ${styles[toast.type]}`}
    >
      {icons[toast.type]}
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto opacity-60 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- 4. Provider Component ---
export const BookingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const openBooking = () => setIsOpen(true);
  const closeBooking = () => setIsOpen(false);

  const addToast = (
    message: string,
    type: "success" | "error" | "warning" = "success",
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        openBooking,
        closeBooking,
        toast: addToast,
      }}
    >
      {children}

      {/* --- Render Modal Once Here --- */}
      <Freebooking />

      {/* --- Render Toaster --- */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto"
            onClick={() => removeToast(t.id)}
          >
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </BookingContext.Provider>
  );
};
