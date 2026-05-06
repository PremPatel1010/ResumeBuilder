import { createFileRoute } from "@tanstack/react-router";
import { BuilderPage } from "@/components/builder/BuilderPage";

export const Route = createFileRoute("/builder/$id")({
  head: () => ({ meta: [{ title: "Edit Resume — Resu.ai" }] }),
  component: BuilderRoute,
});

function BuilderRoute() {
  const { id } = Route.useParams();
  return <BuilderPage resumeId={id} />;
}
