import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  hydrate: () => void;
  toggle: () => void;
}

const apply = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

const initial = (): Theme => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("arb_theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  hydrate: () => {
    const t = initial();
    apply(t);
    set({ theme: t });
  },
  toggle: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    apply(next);
    if (typeof window !== "undefined") localStorage.setItem("arb_theme", next);
    set({ theme: next });
  },
}));
