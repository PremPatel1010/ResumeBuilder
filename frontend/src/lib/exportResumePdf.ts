import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function slugFileBase(name: string, max = 64) {
  const s = name
    .replace(/[^\w\s-]/g, "")
    .trim()
    .slice(0, max);
  return s || "resume";
}

type StyleToken = { el: HTMLElement; prop: string; prev: string };

function setImportant(tokens: StyleToken[], el: HTMLElement, prop: string, value: string) {
  tokens.push({ el, prop, prev: el.style.getPropertyValue(prop) });
  el.style.setProperty(prop, value, "important");
}

function restoreStyles(tokens: StyleToken[]) {
  for (let i = tokens.length - 1; i >= 0; i--) {
    const { el, prop, prev } = tokens[i];
    if (prev) el.style.setProperty(prop, prev);
    else el.style.removeProperty(prop);
  }
}

/** Preorder all elements (HTMLElement + SVG subtree). Skipping SVG is what left oklch in html2canvas’s SVGElementContainer path. */
function preorderSubtree(root: Element): Element[] {
  const out: Element[] = [];
  const walk = (node: Element) => {
    out.push(node);
    for (let i = 0; i < node.children.length; i++) {
      walk(node.children[i] as Element);
    }
  };
  walk(root);
  return out;
}

function stripExternalStylesheetsFromClone(clonedDoc: Document) {
  clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => l.remove());
  clonedDoc.querySelectorAll("style").forEach((s) => s.remove());
}

const SVG_PAINT_ATTRS = [
  "fill",
  "stroke",
  "color",
  "stroke-color",
  "stop-color",
  "flood-color",
  "lighting-color",
];

/** div probe — standard CSS */
function resolveWithDivProbe(property: string, trimmed: string): string | null {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;left:-9999px;visibility:hidden;pointer-events:none;display:block;";
  document.body.appendChild(probe);
  try {
    probe.style.setProperty(property, trimmed);
    const resolved = window.getComputedStyle(probe).getPropertyValue(property).trim();
    if (resolved && !/oklch|lab\(|color-mix|hwb\(/i.test(resolved)) return resolved;
  } catch {
    /* empty */
  } finally {
    probe.remove();
  }
  return null;
}

/** svg &lt;path&gt; probe — fill/stroke and values that inherit into SVG paints */
function resolveWithSvgPathProbe(property: string, trimmed: string): string | null {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.cssText =
    "position:absolute;left:-9999px;visibility:hidden;pointer-events:none;display:block;";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M0 0 L1 1");
  svg.appendChild(path);
  document.body.appendChild(svg);
  try {
    path.style.setProperty(property, trimmed);
    const resolved = window.getComputedStyle(path).getPropertyValue(property).trim();
    if (resolved && resolved !== "none" && !/oklch|lab\(|color-mix|hwb\(/i.test(resolved)) {
      return resolved;
    }
  } catch {
    /* empty */
  } finally {
    svg.remove();
  }
  return null;
}

/** html2canvas cannot parse oklch/lab/color-mix; resolve or substitute. */
function sanitizeComputedCssValue(property: string, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "none" || trimmed === "normal") return trimmed;

  const hasModern = /oklch|lab\(|color-mix|hwb\(/i.test(trimmed);
  const isCurrent = trimmed === "currentColor";

  if (!hasModern && !isCurrent) return trimmed;

  const paintProp =
    /^(fill|stroke|stroke-color|stop-color|flood-color|lighting-color|color)$/i.test(property);
  if (isCurrent && !paintProp) return trimmed;

  const useSvgProbe = paintProp || isCurrent;

  if (useSvgProbe) {
    const fromSvg = resolveWithSvgPathProbe(property, trimmed);
    if (fromSvg) return fromSvg;
  }

  const fromDiv = resolveWithDivProbe(property, trimmed);
  if (fromDiv) return fromDiv;

  if (/color|fill|stroke|border(-top|-right|-bottom|-left)?$/i.test(property)) {
    return "rgb(0, 0, 0)";
  }
  return null;
}

function hasInlineStyle(el: Element): el is HTMLElement | SVGElement {
  return "style" in el && !!(el as HTMLElement | SVGElement).style;
}

function stripSvgPaintAttributes(clone: Element) {
  for (const a of SVG_PAINT_ATTRS) clone.removeAttribute(a);
}

function copyFlattenedComputedStyles(origin: Element, clone: Element) {
  if (!hasInlineStyle(origin) || !hasInlineStyle(clone)) return;

  clone.removeAttribute("class");
  clone.removeAttribute("id");
  stripSvgPaintAttributes(clone);

  const cs = window.getComputedStyle(origin);

  for (let i = 0; i < cs.length; i++) {
    const prop = cs.item(i);
    if (!prop || prop.startsWith("--")) continue;

    const priority = cs.getPropertyPriority(prop);
    const raw = cs.getPropertyValue(prop);
    if (!raw.trim()) continue;

    const safe = sanitizeComputedCssValue(prop, raw);
    if (safe !== null && safe !== "") clone.style.setProperty(prop, safe, priority);
  }
}

/**
 * Mirrors live DOM → cloned DOM (same preorder) so stylesheet links can be removed
 * without losing layout — everything needed is inlined as resolved CSS.
 */
function inlineResolvedStylesAcrossClone(originRoot: HTMLElement, clonedRoot: HTMLElement) {
  const live = preorderSubtree(originRoot);
  const clo = preorderSubtree(clonedRoot);

  if (live.length !== clo.length) {
    console.warn("[exportResumePdf] clone/live node count mismatch; PDF may look wrong.", {
      live: live.length,
      clo: clo.length,
    });
  }

  const n = Math.min(live.length, clo.length);
  for (let j = 0; j < n; j++) {
    copyFlattenedComputedStyles(live[j], clo[j]);
  }
}

function stripEffectsOnClone(_doc: Document, clonedRoot: HTMLElement) {
  void _doc;
  clonedRoot.style.setProperty("box-shadow", "none", "important");
  clonedRoot.style.setProperty("filter", "none", "important");

  clonedRoot.querySelectorAll("*").forEach((node) => {
    if (!hasInlineStyle(node)) return;
    node.style.setProperty("box-shadow", "none", "important");
    node.style.setProperty("filter", "none", "important");
    node.style.setProperty("backdrop-filter", "none", "important");
    node.style.setProperty("-webkit-backdrop-filter", "none", "important");
  });
}

function pickCaptureScale(width: number, height: number, preferred = 2): number {
  const maxPrimary = 4096;
  const maxPixels = maxPrimary ** 2;

  let s = preferred;
  while (s > 1 && width * height * s * s > maxPixels) {
    s -= 0.25;
  }
  if (s < 1) return 1;
  return Math.round(s * 100) / 100;
}

function rasterizeResumeRoot(root: HTMLElement, scale: number): Promise<HTMLCanvasElement> {
  const liveRoot = root;

  return html2canvas(liveRoot, {
    scale,
    useCORS: true,
    allowTaint: false,
    logging: import.meta.env.DEV,
    backgroundColor: "#ffffff",
    removeContainer: true,
    imageTimeout: 20000,
    foreignObjectRendering: false,
    onclone: (clonedDoc, clonedElem) => {
      const clonedRoot = clonedElem as HTMLElement;
      stripEffectsOnClone(clonedDoc, clonedRoot);
      stripExternalStylesheetsFromClone(clonedDoc);
      inlineResolvedStylesAcrossClone(liveRoot, clonedRoot);
    },
  });
}

/**
 * Rasterizes the on-screen resume preview DOM to an A4 PDF (multi-page when needed).
 * `root` should be the element with `[data-resume-export-root]`.
 */
export async function exportResumePreviewToPdf(root: HTMLElement, title?: string): Promise<void> {
  if (typeof document === "undefined" || typeof window === "undefined") {
    throw new Error("PDF export runs in the browser only.");
  }

  if (!root?.isConnected) {
    throw new Error("Resume preview is not mounted yet.");
  }

  await document.fonts?.ready.catch(() => undefined);

  const inner = root.querySelector<HTMLElement>("[data-resume-export-inner]");
  const tokens: StyleToken[] = [];

  setImportant(tokens, root, "overflow", "visible");
  setImportant(tokens, root, "aspect-ratio", "auto");
  setImportant(tokens, root, "height", "auto");
  setImportant(tokens, root, "max-height", "none");
  if (inner) {
    setImportant(tokens, inner, "overflow", "visible");
    setImportant(tokens, inner, "height", "auto");
    setImportant(tokens, inner, "max-height", "none");
  }

  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  let canvas: HTMLCanvasElement | undefined;
  const w = Math.max(1, root.scrollWidth || root.clientWidth || 400);
  const h = Math.max(1, root.scrollHeight || root.clientHeight || 200);
  const preferredScale = pickCaptureScale(w, h);

  const scales = Array.from(new Set([preferredScale, 1.5, 1]))
    .filter((s) => s >= 1)
    .sort((a, b) => b - a);

  let lastCanvasError: unknown;
  try {
    for (const scale of scales) {
      try {
        canvas = await rasterizeResumeRoot(root, scale);
        if (canvas.width >= 8 && canvas.height >= 8) break;
      } catch (e) {
        lastCanvasError = e;
        console.warn("[exportResumePdf] html2canvas retry", scale, e);
      }
    }
  } finally {
    restoreStyles(tokens);
  }

  if (!canvas || canvas.width < 8 || canvas.height < 8) {
    if (lastCanvasError) console.error("[exportResumePdf] html2canvas failed", lastCanvasError);
    throw new Error(
      lastCanvasError instanceof Error ? lastCanvasError.message : "Screenshot failed.",
    );
  }

  let imgData: string;
  try {
    imgData = canvas.toDataURL("image/jpeg", 0.92);
  } catch (e) {
    console.error("[exportResumePdf] toDataURL failed", e);
    throw new Error(
      "Could not read the preview image — try a simpler resume or disable browser tracking protection.",
    );
  }

  if (!imgData || imgData.length < 128) {
    throw new Error("Preview image came back empty.");
  }

  const slug = slugFileBase(title ?? "resume");

  try {
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let y = 0;

    pdf.addImage(imgData, "JPEG", 0, y, imgWidth, imgHeight);

    heightLeft -= pageHeight;
    while (heightLeft > 0.5) {
      y -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, y, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${slug}.pdf`);
  } catch (e) {
    console.error("[exportResumePdf] jsPDF failed", e);
    throw e instanceof Error ? e : new Error("PDF file could not be written.");
  }
}
