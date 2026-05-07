import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { resumeService } from "@/services/resumeService";
import { Resume, emptyResume } from "@/store/useResumeStore";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { pdfExportMessage } from "@/lib/pdfExportMessage";

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
  const [pdfBusy, setPdfBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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
          <Button
            disabled={pdfBusy}
            className="gap-2"
            onClick={async () => {
              const root = previewRef.current;
              if (!root) {
                toast.error("Preview is not ready");
                return;
              }
              setPdfBusy(true);
              try {
                const { exportResumePreviewToPdf } = await import("@/lib/exportResumePdf");
                await exportResumePreviewToPdf(root, resume.title);
                toast.success("PDF downloaded");
              } catch (err) {
                console.error("[resume preview PDF]", err);
                toast.error(pdfExportMessage(err));
              } finally {
                setPdfBusy(false);
              }
            }}
          >
            {pdfBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}{" "}
            Download PDF
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-3xl">
        <ResumePreview ref={previewRef} resume={resume} />
      </div>
    </div>
  );
}
