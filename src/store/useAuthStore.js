import { create } from "zustand";

const readUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("arb_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const readToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem("arb_token");

export const useAuthStore = create((set) => ({
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
