"use client";

import React, { useEffect, useState } from "react";
import { Phone, Calendar, Trash2, Download, Filter, Mail } from "lucide-react";
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
  getAllEnrollments,
  deleteEnrollment,
  updateEnrollmentStatus,
} from "@/app/services/enrollmentAdminService";
import PhoneActionModal from "../components/PhoneActionModal";

// Updated Interface to include status
interface Enrollment {
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

type FilterType = "all" | "today" | "week" | "month" | "year";

const CourseDetailsLeads = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const [phoneModal, setPhoneModal] = useState({
    isOpen: false,
    number: "",
  });

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const data = await getAllEnrollments();
      if (data.success) {
        setEnrollments(data.enrollments);
      } else {
        setError("Failed to load enrollments.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching enrollments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    let filtered = enrollments;

    if (activeFilter === "today") {
      filtered = enrollments.filter((enrollment) =>
        isWithinInterval(new Date(enrollment.createdAt), {
          start: startOfDay(now),
          end: endOfDay(now),
        }),
      );
    } else if (activeFilter === "week") {
      filtered = enrollments.filter((enrollment) =>
        isWithinInterval(new Date(enrollment.createdAt), {
          start: startOfWeek(now),
          end: endOfWeek(now),
        }),
      );
    } else if (activeFilter === "month") {
      filtered = enrollments.filter((enrollment) =>
        isWithinInterval(new Date(enrollment.createdAt), {
          start: startOfMonth(now),
          end: endOfMonth(now),
        }),
      );
    } else if (activeFilter === "year") {
      filtered = enrollments.filter((enrollment) =>
        isWithinInterval(new Date(enrollment.createdAt), {
          start: startOfYear(now),
          end: endOfYear(now),
        }),
      );
    }

    setFilteredEnrollments(filtered);
  }, [enrollments, activeFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enrollment record?")) return;
    try {
      const res = await deleteEnrollment(id);
      if (res.success) fetchEnrollments();
    } catch (err) {
      alert("Failed to delete enrollment.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await updateEnrollmentStatus(id, newStatus);
      if (res.success) {
        fetchEnrollments();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Course Enrollment Report", 14, 22);

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
      head: [["Name", "Phone", "Email", "Course", "Amount", "Status", "Date"]],
      body: filteredEnrollments.map((enrollment) => [
        enrollment.name,
        enrollment.phone,
        enrollment.email || "N/A",
        enrollment.courseTitle,
        enrollment.amount,
        enrollment.status.toUpperCase(),
        format(new Date(enrollment.createdAt), "yyyy-MM-dd"),
      ]),
      startY: 44,
      theme: "grid",
      headStyles: { fillColor: [0, 71, 124] },
    });

    doc.save(`enrollments-report-${activeFilter}.pdf`);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Course Enrollments</h1>
              <p className="text-sm text-gray-500 mt-1">
                Total Enrollments:{" "}
                <span className="font-semibold text-gray-700">{enrollments.length}</span> | 
                Showing: <span className="font-semibold text-[#00477C]">{filteredEnrollments.length}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchEnrollments}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Filter size={16} /> Refresh
              </button>
              <button
                onClick={downloadPDF}
                disabled={filteredEnrollments.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#00477C] text-white text-sm font-medium rounded-lg hover:bg-[#003359] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {[
              { key: "all", label: "All Enrollments" },
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
            <div className="flex justify-center py-20 text-gray-500">Loading enrollments...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">{error}</div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p>No enrollments found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse bg-white">
                <thead className="bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b">Name</th>
                    <th className="p-4 border-b">Phone</th>
                    <th className="p-4 border-b">Email</th>
                    <th className="p-4 border-b">Course</th>
                    <th className="p-4 border-b">Amount</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b">Date</th>
                    <th className="p-4 border-b text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{enrollment.name}</td>
                      <td className="p-4">
                        <button
                          onClick={() => setPhoneModal({ isOpen: true, number: enrollment.phone })}
                          className="text-blue-600 hover:underline font-medium flex items-center gap-1 w-max"
                        >
                          <Phone size={14} /> {enrollment.phone}
                        </button>
                      </td>
                      <td className="p-4 text-gray-600">
                        {enrollment.email ? (
                          <a
                            href={`mailto:${enrollment.email}`}
                            className="flex items-center gap-1 text-gray-600 hover:text-[#00477C] w-max"
                          >
                            <Mail size={14} className="opacity-50" /> {enrollment.email}
                          </a>
                        ) : (
                          <span className="text-gray-300 italic text-xs">Not provided</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600 max-w-[200px] truncate">{enrollment.courseTitle}</td>
                      <td className="p-4">
                        <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md border border-green-100 font-bold">
                          ৳ {enrollment.amount}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={enrollment.status}
                          onChange={(e) => handleStatusChange(enrollment._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-md border font-bold uppercase outline-none cursor-pointer ${
                            enrollment.status === "active"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : enrollment.status === "expired"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                                : "bg-red-50 text-red-700 border-red-100"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="expired">Expired</option>
                          <option value="revoked">Revoked</option>
                        </select>
                      </td>
                      <td className="p-4 text-gray-500">
                        {format(new Date(enrollment.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(enrollment._id)}
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

export default CourseDetailsLeads;