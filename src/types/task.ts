export interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  priority: "low" | "medium" | "high" | "urgent";
  status: "assigned" | "in_progress" | "submitted" | "completed" | "overdue";
  deadline: string;
  attachments?: string[];
  submission?: {
    note?: string;
    files?: string[];
    submittedAt?: string;
  };
  adminFeedback?: string;
  completedAt?: string;
  createdAt: string;
}

export interface TaskStats {
  total: number;
  assigned: number;
  in_progress: number;
  submitted: number;
  completed: number;
  overdue: number;
}
