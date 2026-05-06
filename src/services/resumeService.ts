import api from "./api";
import type { Resume } from "@/store/useResumeStore";

export const resumeService = {
  list: () => api.get<Resume[]>("/resume").then((r) => r.data),
  get: (id: string) => api.get<Resume>(`/resume/${id}`).then((r) => r.data),
  create: (payload: Partial<Resume>) => api.post<Resume>("/resume", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Resume>) =>
    api.put<Resume>(`/resume/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete<{ success: boolean }>(`/resume/${id}`).then((r) => r.data),
};

export const aiService = {
  summary: (payload: { role?: string; experience?: string; keywords?: string[] }) =>
    api.post<{ text: string }>("/ai/summary", payload).then((r) => r.data),
  skills: (payload: { role?: string; experience?: string }) =>
    api.post<{ skills: string[] }>("/ai/skills", payload).then((r) => r.data),
  projects: (payload: { name?: string; tech?: string; description?: string }) =>
    api.post<{ text: string }>("/ai/projects", payload).then((r) => r.data),
};
