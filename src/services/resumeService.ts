import api from "./api";

export const resumeService = {
  list: () => api.get("/resume").then((r) => r.data),
  get: (id) => api.get(`/resume/${id}`).then((r) => r.data),
  create: (payload) => api.post("/resume", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/resume/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/resume/${id}`).then((r) => r.data),
};

export const aiService = {
  summary: (payload) => api.post("/ai/summary", payload).then((r) => r.data),
  skills: (payload) => api.post("/ai/skills", payload).then((r) => r.data),
  projects: (payload) => api.post("/ai/projects", payload).then((r) => r.data),
};
