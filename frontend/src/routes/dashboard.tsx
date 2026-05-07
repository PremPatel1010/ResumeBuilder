import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, MoreVertical, Trash2, Eye, FilePen, TrendingUp, Clock, Target } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { resumeService } from "@/services/resumeService";
import { useAuthStore } from "@/store/useAuthStore";
import type { Resume } from "@/store/useResumeStore";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Resu.ai" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}

function DashboardContent() {
  const user = useAuthStore((s) => s.user);
  const [resumes, setResumes] = useState<Resume[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const data = await resumeService.list();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ?? (err as Error)?.message ?? "Could not load resumes";
      setError(message);
      setResumes([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await resumeService.remove(id);
      toast.success("Resume deleted");
      setResumes((prev) => (prev || []).filter((r) => r._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const stats = [
    { label: "Total resumes", value: resumes?.length ?? 0, icon: FileText, tint: "from-primary to-primary-glow" },
    { label: "Profile views", value: "—", icon: Eye, tint: "from-blue-500 to-cyan-400" },
    { label: "Match score", value: "—", icon: Target, tint: "from-fuchsia-500 to-purple-500" },
    { label: "Last edit", value: "—", icon: Clock, tint: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "friend"} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Pick up where you left off, or start something new.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${s.tint} text-white`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" /> Live
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumes */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your resumes</h2>
          <Link to="/builder">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> New resume
            </Button>
          </Link>
        </div>

        {resumes === null ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <EmptyState error={error} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r, i) => (
              <ResumeCard key={r._id || i} resume={r} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ResumeCard({ resume, onDelete }: { resume: Resume; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elegant"
    >
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground">
          <FileText className="h-5 w-5" />
        </div>
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {open && (
            <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-lg border border-border bg-popover shadow-elegant">
              <Link
                to="/preview/$id"
                params={{ id: resume._id || "new" }}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              >
                <Eye className="h-4 w-4" /> Preview
              </Link>
              <Link
                to="/builder/$id"
                params={{ id: resume._id || "new" }}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
              >
                <FilePen className="h-4 w-4" /> Edit
              </Link>
              <button
                onClick={() => resume._id && onDelete(resume._id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className="mt-4 truncate text-base font-semibold">{resume.title || "Untitled"}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {resume.personal?.role || "No role yet"}
      </p>
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-full bg-accent px-2 py-0.5 capitalize text-accent-foreground">
          {resume.template || "modern"}
        </span>
        <span>{resume.experience?.length || 0} roles</span>
      </div>
    </motion.div>
  );
}

function EmptyState({ error }: { error: string | null }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant">
        <FileText className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No resumes yet</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        {error
          ? `We couldn't reach your backend. ${error}`
          : "Create your first resume and let AI do the heavy lifting."}
      </p>
      <Link to="/builder" className="mt-6 inline-block">
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create resume
        </Button>
      </Link>
    </div>
  );
}
