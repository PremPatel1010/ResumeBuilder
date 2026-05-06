import { createFileRoute } from "@tanstack/react-router";
import { BuilderPage } from "@/components/builder/BuilderPage";

export const Route = createFileRoute("/builder")({
  head: () => ({ meta: [{ title: "Resume Builder — Resu.ai" }] }),
  component: () => <BuilderPage />,
});

