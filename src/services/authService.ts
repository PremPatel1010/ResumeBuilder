import api from "./api";
import type { AuthUser } from "@/store/useAuthStore";

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authService = {
  register: (payload: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),
  login: (payload: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", payload).then((r) => r.data),
  me: () => api.get<AuthUser>("/auth/me").then((r) => r.data),
};
