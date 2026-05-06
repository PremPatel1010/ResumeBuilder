import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggle, hydrate } = useThemeStore();
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
