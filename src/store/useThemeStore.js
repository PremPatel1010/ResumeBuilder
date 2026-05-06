import { create } from "zustand";

const apply = (theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const initial = () => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("arb_theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useThemeStore = create((set, get) => ({
  theme: "light",
  hydrate: () => {
    const t = initial();
    apply(t);
    set({ theme: t });
  },
  toggle: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    apply(next);
    if (typeof window !== "undefined") localStorage.setItem("arb_theme", next);
    set({ theme: next });
  },
}));
