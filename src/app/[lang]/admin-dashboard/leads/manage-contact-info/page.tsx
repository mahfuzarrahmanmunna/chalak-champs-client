// src/app/[lang]/dashboard/admin/contacts/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Phone,
  Calendar,
  Trash2,
  Download,
  Filter,
  Mail,
  MessageCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns";
import { useAuth } from "@/app/hooks/useAuth";
import PhoneActionModal from "../components/PhoneActionModal";

// Define Contact Type matching your DB
interface ContactInquiry {
  _id: string;
  studentName: string;
  guardianName: string;
  countryCode: string;
  phone: string; // Full phone string e.g. "+880 12345"
  classLevel: string;
  message?: string;
  contactMethod: "call" | "whatsapp";
  isResolved: boolean;
  createdAt: string;
}

type FilterType = "all" | "today" | "week" | "month" | "year";

const AdminContactsPage = () => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactInquiry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter State
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Phone Modal State
  const [phoneModal, setPhoneModal] = useState({
    isOpen: false,
    number: "",
    name: "",
  });

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://apichalakchamps.vercel.app";

  // Fetch Contacts
  const fetchContacts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load contacts.");

      const data = await res.json();
      setContacts(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching contacts.");
    } finally {
      setLoading(false);
    }
  };

  // Apply Filter Logic
  useEffect(() => {
    const now = new Date();
    let filtered = contacts;

    if (activeFilter === "today") {
      filtered = contacts.filter((c) =>
        isWithinInterval(new Date(c.createdAt), {
          start: startOfDay(now),
          end: endOfDay(now),
        }),
      );
    } else if (activeFilter === "week") {
      filtered = contacts.filter((c) =>
        isWithinInterval(new Date(c.createdAt), {
          start: startOfWeek(now),
          end: endOfWeek(now),
        }),
      );
    } else if (activeFilter === "month") {
      filtered = contacts.filter((c) =>
        isWithinInterval(new Date(c.createdAt), {
          start: startOfMonth(now),
          end: endOfMonth(now),
        }),
      );
    } else if (activeFilter === "year") {
      filtered = contacts.filter((c) =>
        isWithinInterval(new Date(c.createdAt), {
          start: startOfYear(now),
          end: endOfYear(now),
        }),
      );
    }

    setFilteredContacts(filtered);
  }, [contacts, activeFilter]);

  // Handle Toggle Resolved
  const toggleResolved = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setContacts((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, isResolved: !currentStatus } : c,
      ),
    );

    // Optional: Add backend call here if you have a PATCH/PUT endpoint
    // try {
    //   await fetch(`${BACKEND_URL}/api/contact/${id}`, { method: 'PATCH', ... })
    // } catch (err) {
    //   // Revert on failure
    // }
  };

  // Handle PDF Download
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Contact Inquiries Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    const filterName =
      activeFilter === "all"
        ? "All Records"
        : activeFilter === "today"
          ? "Today"
          : activeFilter === "week"
            ? "This Week"
            : activeFilter === "month"
              ? "This Month"
              : "This Year";

    doc.text(`Filter: ${filterName}`, 14, 30);
    doc.text(`Generated: ${format(new Date(), "PPpp")}`, 14, 36);

    autoTable(doc, {
      head: [["Student Name", "Guardian", "Phone", "Class", "Method", "Date"]],
      body: filteredContacts.map((c) => [
        c.studentName,
        c.guardianName,
        c.phone,
        c.classLevel,
        c.contactMethod.toUpperCase(),
        format(new Date(c.createdAt), "yyyy-MM-dd"),
      ]),
      startY: 44,
      theme: "grid",
      headStyles: { fillColor: [0, 71, 124] }, // #00477C
    });

    doc.save(`contacts-report-${activeFilter}.pdf`);
  };

  useEffect(() => {
    if (currentUser) fetchContacts();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Contact Inquiries
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Total Inquiries:{" "}
                <span className="font-semibold text-gray-700">
                  {contacts.length}
                </span>{" "}
                | Showing:{" "}
                <span className="font-semibold text-[#00477C]">
                  {filteredContacts.length}
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchContacts}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Filter size={16} /> Refresh
              </button>
              <button
                onClick={downloadPDF}
                disabled={filteredContacts.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#00477C] text-white text-sm font-medium rounded-lg hover:bg-[#003359] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {[
              { key: "all", label: "All Inquiries" },
              { key: "today", label: "Today" },
              { key: "week", label: "This Week" },
              { key: "month", label: "This Month" },
              { key: "year", label: "This Year" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveFilter(item.key as FilterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === item.key
                    ? "bg-[#00477C] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-20 text-gray-500">
              Loading inquiries...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">
              {error}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p>No inquiries found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse bg-white">
                <thead className="bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b">Student</th>
                    <th className="p-4 border-b">Guardian</th>
                    <th className="p-4 border-b">Phone</th>
                    <th className="p-4 border-b">Class</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b">Date</th>
                    <th className="p-4 border-b text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {contact.studentName}
                      </td>
                      <td className="p-4 text-gray-600">
                        {contact.guardianName}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            setPhoneModal({
                              isOpen: true,
                              number: contact.phone,
                              name: contact.studentName,
                            })
                          }
                          className="text-blue-600 hover:underline font-medium flex items-center gap-1 w-max"
                        >
                          <Phone size={14} /> {contact.phone}
                        </button>
                      </td>
                      <td className="p-4 text-gray-600">
                        {contact.classLevel}
                      </td>
                      <td className="p-4">
                        {contact.isResolved ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-100 w-max">
                            <CheckCircle2 size={12} /> Resolved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 w-max">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500">
                        {format(new Date(contact.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() =>
                            toggleResolved(contact._id, contact.isResolved)
                          }
                          className={`p-2 rounded-full transition-colors ${
                            contact.isResolved
                              ? "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                              : "text-green-500 hover:bg-green-50"
                          }`}
                          title={
                            contact.isResolved
                              ? "Mark as Pending"
                              : "Mark as Resolved"
                          }
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Phone Action Modal */}
      <PhoneActionModal
        isOpen={phoneModal.isOpen}
        phone={phoneModal.number}
        studentName={phoneModal.name}
        onClose={() => setPhoneModal({ isOpen: false, number: "", name: "" })}
      />
    </div>
  );
};

export default AdminContactsPage;
