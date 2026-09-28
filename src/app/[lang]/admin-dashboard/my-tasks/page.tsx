"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { taskService } from "../../../services/taskService";
import { Task } from "@/types/task";
import { CheckCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function StudentTasksPage() {
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks();
      setTasks(res.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    assigned: colors.muted,
    in_progress: colors.accent,
    submitted: colors.secondary,
    completed: colors.success,
    overdue: colors.destructive,
  };

  return (
    <div
      className="px-4 sm:px-6 lg:px-8 py-6"
      style={{ backgroundColor: colors.background, minHeight: "100vh" }}
    >
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: colors.foreground }}
      >
        My Tasks
      </h1>

      {loading ? (
        <div className="text-center py-10" style={{ color: colors.muted }}>
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div
          className="text-center py-10 rounded-lg border"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <DocumentTextIcon
            className="h-12 w-12 mx-auto mb-3"
            style={{ color: colors.muted }}
          />
          <p style={{ color: colors.muted }}>You have no tasks assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="rounded-xl shadow-sm border p-5 flex flex-col justify-between"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.foreground }}
                  >
                    {task.title}
                  </h3>
                  <span
                    className="px-2 py-1 text-xs rounded-full capitalize"
                    style={{
                      backgroundColor:
                        statusColors[task.status] || colors.muted,
                      color: "#fff",
                    }}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>
                <p
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: colors.muted }}
                >
                  {task.description}
                </p>

                <div
                  className="text-xs space-y-1 mb-4"
                  style={{ color: colors.muted }}
                >
                  <p>
                    Priority:{" "}
                    <span
                      className="capitalize font-medium"
                      style={{ color: colors.foreground }}
                    >
                      {task.priority}
                    </span>
                  </p>
                  <p>
                    Deadline:{" "}
                    <span
                      style={{
                        color:
                          task.status === "overdue"
                            ? colors.destructive
                            : colors.foreground,
                      }}
                    >
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTask(task)}
                className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  borderColor:
                    task.status === "submitted"
                      ? colors.border
                      : colors.primary,
                  backgroundColor:
                    task.status === "submitted"
                      ? "transparent"
                      : colors.primary,
                  color:
                    task.status === "submitted" ? colors.foreground : "#ffffff",
                }}
              >
                {task.status === "submitted" ? "View Submission" : "Open Task"}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={fetchTasks}
        />
      )}
    </div>
  );
}

function TaskDetailModal({
  task,
  onClose,
  onUpdate,
}: {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const { colors } = useTheme();
  const [submissionNote, setSubmissionNote] = useState(
    task.submission?.note || "",
  );

  const handleSubmit = async () => {
    try {
      await taskService.submitTask(task._id, { note: submissionNote });
      onUpdate();
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
          className="text-xl font-bold mb-2"
          style={{ color: colors.foreground }}
        >
          {task.title}
        </h3>
        <p className="text-sm mb-4" style={{ color: colors.muted }}>
          {task.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p
              className="text-xs uppercase font-medium"
              style={{ color: colors.muted }}
            >
              Deadline
            </p>
            <p style={{ color: colors.foreground }}>
              {new Date(task.deadline).toLocaleString()}
            </p>
          </div>
          <div>
            <p
              className="text-xs uppercase font-medium"
              style={{ color: colors.muted }}
            >
              Priority
            </p>
            <p className="capitalize" style={{ color: colors.foreground }}>
              {task.priority}
            </p>
          </div>
        </div>

        {/* Admin Feedback Section */}
        {task.adminFeedback && (
          <div
            className="p-4 rounded-lg mb-6 border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <p
              className="text-xs uppercase font-medium mb-2"
              style={{ color: colors.muted }}
            >
              Admin Feedback
            </p>
            <p className="text-sm" style={{ color: colors.foreground }}>
              {task.adminFeedback}
            </p>
          </div>
        )}

        {/* Submission Section */}
        {(task.status === "assigned" ||
          task.status === "in_progress" ||
          task.status === "overdue") && (
          <div className="mt-4">
            <label
              className="block text-sm mb-2 font-medium"
              style={{ color: colors.foreground }}
            >
              Submit Your Work
            </label>
            <textarea
              rows={4}
              placeholder="Add a note or describe your work..."
              className="w-full px-3 py-2 rounded-lg border mb-3"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              }}
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white inline-flex items-center justify-center"
              style={{ backgroundColor: colors.success }}
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" /> Submit Task
            </button>
          </div>
        )}

        {task.status === "submitted" && task.submission && (
          <div
            className="p-4 rounded-lg mt-4 border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <p
              className="text-xs uppercase font-medium mb-2"
              style={{ color: colors.muted }}
            >
              Your Submission
            </p>
            <p className="text-sm" style={{ color: colors.foreground }}>
              {task.submission.note}
            </p>
            <p className="text-xs mt-2" style={{ color: colors.muted }}>
              Submitted at:{" "}
              {new Date(task.submission.submittedAt!).toLocaleString()}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 rounded-lg text-sm font-medium border"
          style={{ borderColor: colors.border, color: colors.foreground }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
