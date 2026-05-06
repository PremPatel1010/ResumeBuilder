import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { resumeService } from "@/services/resumeService";
import { Resume, emptyResume } from "@/store/useResumeStore";
import { ResumePreview } from "@/components/builder/ResumePreview";

export const Route = createFileRoute("/preview/$id")({
  head: () => ({ meta: [{ title: "Preview — Resu.ai" }] }),
  component: PreviewPage,
});

function PreviewPage() {
  const { id } = Route.useParams();
  return (
    <DashboardLayout>
      <PreviewInner id={id} />
    </DashboardLayout>
  );
}

function PreviewInner({ id }: { id: string }) {
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    resumeService
      .get(id)
      .then((d) => setResume({ ...emptyResume(), ...d }))
      .catch(() => toast.error("Could not load resume"));
  }, [id]);

  if (!resume)
    return (
      <div className="grid h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to="/builder/$id" params={{ id }}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button onClick={() => window.print()} className="gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-3xl">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
