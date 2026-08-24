"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { Task, TaskStats } from "@/types/task";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import { taskService } from "@/app/services/taskService";

export default function AdminTasksPage() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [searchTerm, filterStatus]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params: any = { search: searchTerm };
      if (filterStatus !== "all") params.status = filterStatus;
      const res = await taskService.getTasks(params);
      setTasks(res.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await taskService.getTaskStats();
      setStats(res.stats);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.deleteTask(id);
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="px-4 sm:px-6 lg:px-8 py-6"
      style={{ backgroundColor: colors.background, minHeight: "100vh" }}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total", value: stats?.total || 0, color: colors.primary },
          {
            label: "Assigned",
            value: stats?.assigned || 0,
            color: colors.muted,
          },
          {
            label: "In Progress",
            value: stats?.in_progress || 0,
            color: colors.accent,
          },
          {
            label: "Submitted",
            value: stats?.submitted || 0,
            color: colors.secondary,
          },
          {
            label: "Completed",
            value: stats?.completed || 0,
            color: colors.success,
          },
          {
            label: "Overdue",
            value: stats?.overdue || 0,
            color: colors.destructive,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 shadow-sm border"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <p
              className="text-xs font-medium uppercase"
              style={{ color: colors.muted }}
            >
              {stat.label}
            </p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Header & Filters */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.foreground }}>
          Task Management
        </h1>
        <button
          onClick={() => {
            setSelectedTask(null);
            setShowTaskModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: colors.primary }}
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Assign New Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5"
              style={{ color: colors.muted }}
            />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            className="block w-full pl-10 pr-3 py-2 rounded-lg border"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.foreground,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.foreground,
          }}
        >
          <option value="all">All Status</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Tasks Table */}
      <div
        className="overflow-hidden rounded-lg shadow-lg border"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y"
            style={{ borderColor: colors.border }}
          >
            <thead>
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: colors.muted }}
                >
                  Title
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: colors.muted }}
                >
                  Assigned To
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: colors.muted }}
                >
                  Priority
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: colors.muted }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: colors.muted }}
                >
                  Deadline
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase"
                  style={{ color: colors.muted }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: colors.border }}>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4"
                    style={{ color: colors.muted }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-4"
                    style={{ color: colors.muted }}
                  >
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-opacity-50"
                    style={{ backgroundColor: colors.background }}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      style={{ color: colors.foreground }}
                    >
                      {task.title}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.foreground }}
                    >
                      {task.assignedTo?.firstName} {task.assignedTo?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor:
                            task.priority === "urgent"
                              ? colors.destructive
                              : colors.secondary,
                          color: "#fff",
                        }}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm capitalize"
                      style={{ color: colors.foreground }}
                    >
                      {task.status.replace("_", " ")}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: colors.foreground }}
                    >
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskModal(true);
                        }}
                        className="p-2"
                        style={{ color: colors.primary }}
                      >
                        {task.status === "submitted" ? (
                          <EyeIcon className="h-5 w-5" />
                        ) : (
                          <PencilIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 ml-2"
                        style={{ color: colors.destructive }}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowTaskModal(false)}
          onSave={fetchTasks}
        />
      )}
    </div>
  );
}

// Task Modal Component (Create/Edit/Review)
function TaskModal({
  task,
  onClose,
  onSave,
}: {
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedTo: task?.assignedTo?._id || "",
    priority: task?.priority || "medium",
    deadline: task?.deadline
      ? new Date(task.deadline).toISOString().split("T")[0]
      : "",
    status: task?.status || "assigned",
  });
  const [reviewFeedback, setReviewFeedback] = useState(
    task?.adminFeedback || "",
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await taskService.getUsers();
        if (res.success)
          setUsers(res.users.filter((u: any) => u.role === "student"));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (task) {
        await taskService.updateTask(task._id, formData);
      } else {
        await taskService.createTask(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReview = async (action: "complete" | "reject") => {
    try {
      await taskService.reviewTask(task!._id, {
        action,
        adminFeedback: reviewFeedback,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.card }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: colors.foreground }}
        >
          {task ? "Edit/Review Task" : "Assign New Task"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: colors.muted }}
            >
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: colors.muted }}
            >
              Description
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: colors.muted }}
              >
                Assign To
              </label>
              <select
                required
                disabled={!!task} // Don't allow changing student on edit to prevent confusion, use reassign logic if needed
                className="w-full px-3 py-2 rounded-lg border disabled:opacity-50"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
              >
                <option value="">Select Student</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: colors.muted }}
              >
                Priority
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm mb-1"
                style={{ color: colors.muted }}
              >
                Deadline
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
            </div>
            {task && (
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: colors.muted }}
                >
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          {/* Review Section */}
          {task?.status === "submitted" && task?.submission && (
            <div
              className="mt-6 p-4 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            >
              <h4
                className="font-medium mb-2"
                style={{ color: colors.foreground }}
              >
                Student Submission
              </h4>
              <p className="text-sm mb-2" style={{ color: colors.muted }}>
                {task.submission.note || "No note provided."}
              </p>
              <p className="text-xs mb-4" style={{ color: colors.muted }}>
                Submitted:{" "}
                {new Date(task.submission.submittedAt!).toLocaleString()}
              </p>

              <textarea
                placeholder="Add admin feedback..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border mb-3"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.foreground,
                }}
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleReview("complete")}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white inline-flex items-center justify-center"
                  style={{ backgroundColor: colors.success }}
                >
                  <CheckCircleIcon className="h-5 w-5 mr-1" /> Approve &
                  Complete
                </button>
                <button
                  type="button"
                  onClick={() => handleReview("reject")}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white inline-flex items-center justify-center"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <ArrowUturnLeftIcon className="h-5 w-5 mr-1" /> Send Back
                </button>
              </div>
            </div>
          )}

          <div
            className="flex justify-end space-x-3 pt-4 border-t"
            style={{ borderColor: colors.border }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: colors.border, color: colors.foreground }}
            >
              Cancel
            </button>
            {task?.status !== "submitted" && (
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: colors.primary }}
              >
                Save Task
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
