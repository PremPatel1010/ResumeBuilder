import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates — Resu.ai" }] }),
  component: TemplatesPage,
});

const TEMPLATES = [
  { id: "modern", name: "Modern", desc: "Clean, contemporary, perfect for tech." },
  { id: "classic", name: "Classic", desc: "Timeless layout for traditional industries." },
  { id: "compact", name: "Compact", desc: "Fit more content on a single page." },
  { id: "elegant", name: "Elegant", desc: "Refined typography for executives." },
  { id: "bold", name: "Bold", desc: "Stand out with confident colors." },
  { id: "minimal", name: "Minimal", desc: "All content, no distractions." },
];

function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="mt-1 text-muted-foreground">Pick a starting point — switch any time.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow hover:shadow-elegant"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-muted to-accent/40 p-6">
                <div className="h-full w-full rounded-lg bg-white p-4 text-slate-900 shadow-sm">
                  <div className="h-3 w-24 rounded bg-slate-800" />
                  <div className="mt-1 h-2 w-16 rounded bg-slate-400" />
                  <div className="mt-4 space-y-1">
                    <div className="h-1.5 rounded bg-slate-300" />
                    <div className="h-1.5 w-5/6 rounded bg-slate-300" />
                    <div className="h-1.5 w-4/6 rounded bg-slate-300" />
                  </div>
                  <div className="mt-4 h-2 w-12 rounded bg-slate-700" />
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 rounded bg-slate-300" />
                    <div className="h-1.5 w-3/4 rounded bg-slate-300" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{t.name}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                    <Check className="h-3 w-3" /> ATS
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <Link to="/builder" className="mt-4 inline-block w-full">
                  <Button className="w-full">Use template</Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
