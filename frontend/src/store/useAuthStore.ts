import { create } from "zustand";

export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  hydrate: () => void;
  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const readUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("arb_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};
const readToken = (): string | null =>
  typeof window === "undefined" ? null : localStorage.getItem("arb_token");

export const useAuthStore = create<AuthState>((set) => ({
  user: readUser(),
  token: readToken(),
  hydrated: false,
  hydrate: () => set({ user: readUser(), token: readToken(), hydrated: true }),
  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("arb_user", JSON.stringify(user));
      localStorage.setItem("arb_token", token);
    }
    set({ user, token });
  },
  setUser: (user) => {
    if (typeof window !== "undefined" && user)
      localStorage.setItem("arb_user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("arb_token");
      localStorage.removeItem("arb_user");
    }
    set({ user: null, token: null });
  },
}));
