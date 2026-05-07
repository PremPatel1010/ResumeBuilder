/** Friendly message for toast + console.full error still logged by caller */
export function pdfExportMessage(err: unknown): string {
  if (typeof err !== "object" || err === null) return "Could not create PDF.";
  const e = err as { message?: unknown; name?: unknown };
  if (typeof e.message === "string" && e.message.trim()) return e.message.trim();
  if (e.name === "SecurityError")
    return "PDF export blocked (browser security): try another browser or disable strict extensions.";
  return "Could not create PDF.";
}
