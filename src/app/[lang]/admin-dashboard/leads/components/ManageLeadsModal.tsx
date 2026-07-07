"use client";

import React, { useEffect, useState } from "react";
import { Phone, Calendar, Trash2, Download, Filter } from "lucide-react";
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
import {
  deleteBooking,
  getAllBookings,
} from "@/app/services/freeBookingService";
import PhoneActionModal from "./PhoneActionModal";

// Define Lead Type matching your DB
interface Lead {
  _id: string;
  studentName: string;
  guardianName: string;
  phone: string;
  fullPhone: string;
  countryCode: string;
  studentClass: string;
  course: string;
  createdAt: string;
}

type FilterType = "all" | "today" | "week" | "month" | "year";

const ManageLeadsModal = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter State
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Phone Modal State
  const [phoneModal, setPhoneModal] = useState({
    isOpen: false,
    number: "",
  });

  // Fetch Leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      if (data.success) {
        setLeads(data.bookings);
      } else {
        setError("Failed to load leads.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching leads.");
    } finally {
      setLoading(false);
    }
  };

  // Apply Filter Logic
  useEffect(() => {
    const now = new Date();
    let filtered = leads;

    if (activeFilter === "today") {
      filtered = leads.filter((lead) =>
        isWithinInterval(new Date(lead.createdAt), {
          start: startOfDay(now),
          end: endOfDay(now),
        }),
      );
    } else if (activeFilter === "week") {
      filtered = leads.filter((lead) =>
        isWithinInterval(new Date(lead.createdAt), {
          start: startOfWeek(now),
          end: endOfWeek(now),
        }),
      );
    } else if (activeFilter === "month") {
      filtered = leads.filter((lead) =>
        isWithinInterval(new Date(lead.createdAt), {
          start: startOfMonth(now),
          end: endOfMonth(now),
        }),
      );
    } else if (activeFilter === "year") {
      filtered = leads.filter((lead) =>
        isWithinInterval(new Date(lead.createdAt), {
          start: startOfYear(now),
          end: endOfYear(now),
        }),
      );
    }

    setFilteredLeads(filtered);
  }, [leads, activeFilter]);

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await deleteBooking(id);
      if (res.success) fetchLeads();
    } catch (err) {
      alert("Failed to delete lead.");
    }
  };

  // Handle PDF Download
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Free Booking Leads Report", 14, 22);

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
      head: [["Student Name", "Guardian", "Phone", "Class", "Course", "Date"]],
      body: filteredLeads.map((lead) => [
        lead.studentName,
        lead.guardianName,
        lead.fullPhone,
        lead.studentClass,
        lead.course,
        format(new Date(lead.createdAt), "yyyy-MM-dd"),
      ]),
      startY: 44,
      theme: "grid",
      headStyles: { fillColor: [243, 6, 110] },
    });

    doc.save(`free-leads-report-${activeFilter}.pdf`);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Free Booking Leads
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Total Leads:{" "}
                <span className="font-semibold text-gray-700">
                  {leads.length}
                </span>{" "}
                | Showing:{" "}
                <span className="font-semibold text-[#F3066E]">
                  {filteredLeads.length}
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchLeads}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Filter size={16} /> Refresh
              </button>
              <button
                onClick={downloadPDF}
                disabled={filteredLeads.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#00477C] text-white text-sm font-medium rounded-lg hover:bg-[#003359] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {[
              { key: "all", label: "All Leads" },
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
                    ? "bg-[#F3066E] text-white shadow-md"
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
              Loading leads...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">
              {error}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p>No leads found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse bg-white">
                <thead className="bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b">Student Name</th>
                    <th className="p-4 border-b">Guardian</th>
                    <th className="p-4 border-b">Phone</th>
                    <th className="p-4 border-b">Class</th>
                    <th className="p-4 border-b">Course</th>
                    <th className="p-4 border-b">Date</th>
                    <th className="p-4 border-b text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {lead.studentName}
                      </td>
                      <td className="p-4 text-gray-600">{lead.guardianName}</td>
                      <td className="p-4">
                        {/* Changed to button to trigger modal */}
                        <button
                          onClick={() =>
                            setPhoneModal({
                              isOpen: true,
                              number: lead.fullPhone,
                            })
                          }
                          className="text-blue-600 hover:underline font-medium flex items-center gap-1 w-max"
                        >
                          <Phone size={14} /> {lead.fullPhone}
                        </button>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100 font-semibold">
                          {lead.studentClass}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{lead.course}</td>
                      <td className="p-4 text-gray-500">
                        {format(new Date(lead.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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
        onClose={() => setPhoneModal({ isOpen: false, number: "" })}
      />
    </div>
  );
};

export default ManageLeadsModal;
