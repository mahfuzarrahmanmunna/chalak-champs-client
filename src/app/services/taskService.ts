import api from "@/lib/api";
import { Task } from "@/types/task";

export const taskService = {
  getTasks: async (params?: any) => {
    const res = await api.get("/tasks", { params });
    return res.data;
  },
  getTaskStats: async () => {
    const res = await api.get("/tasks/stats");
    return res.data;
  },
  createTask: async (data: any) => {
    const res = await api.post("/tasks", data);
    return res.data;
  },
  updateTask: async (id: string, data: any) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },
  deleteTask: async (id: string) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
  submitTask: async (id: string, data: any) => {
    const res = await api.post(`/tasks/${id}/submit`, data);
    return res.data;
  },
  reviewTask: async (id: string, data: any) => {
    const res = await api.post(`/tasks/${id}/review`, data);
    return res.data;
  },
  getUsers: async () => {
    const res = await api.get("/auth/users");
    return res.data;
  },
};
