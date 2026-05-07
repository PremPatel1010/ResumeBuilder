import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg gradient-primary text-primary-foreground shadow-elegant">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="text-base">
        Resu<span className="gradient-text">.ai</span>
      </span>
    </Link>
  );
}
