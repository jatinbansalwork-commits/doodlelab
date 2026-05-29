"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, X } from "lucide-react";
import { useCallback } from "react";
import { cn } from "@/lib/cn";
import { playSuccess } from "@/lib/sounds/doodle-sounds";
import { useDoodleStore } from "@/store/doodle-store";
import type { ExportFormat } from "@/types/doodle-app";

/** Only formats that export real, usable output (GIF is not implemented). */
const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: "svg", label: "SVG" },
  { id: "react", label: "React Component" },
  { id: "framer", label: "Framer Motion" },
];

export function ExportModal() {
  const open = useDoodleStore((s) => s.exportOpen);
  const setExportOpen = useDoodleStore((s) => s.setExportOpen);
  const storedFormat = useDoodleStore((s) => s.exportFormat);
  const setExportFormat = useDoodleStore((s) => s.setExportFormat);
  const format = FORMATS.some((f) => f.id === storedFormat) ? storedFormat : "react";
  const items = useDoodleStore((s) => s.items);
  const selectedConcept = useDoodleStore((s) => s.selectedConcept);
  const triggerStageMoment = useDoodleStore((s) => s.triggerStageMoment);
  const bumpVisualPulse = useDoodleStore((s) => s.bumpVisualPulse);
  const buddyReact = useDoodleStore((s) => s.buddyReact);

  const code = useDoodleStore((s) => s.getExportContent());

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    playSuccess();
    triggerStageMoment("export");
    bumpVisualPulse(
      items.map((i) => i.id),
      "export",
    );
    buddyReact("export");
  }, [code, items, triggerStageMoment, bumpVisualPulse, buddyReact]);

  const download = useCallback(() => {
    const ext = format === "svg" ? "svg" : "tsx";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `motionlab-scene.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    playSuccess();
    triggerStageMoment("export");
    bumpVisualPulse(
      items.map((i) => i.id),
      "export",
    );
    buddyReact("export");
  }, [code, format, items, triggerStageMoment, bumpVisualPulse, buddyReact]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-[60] bg-[#111]/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExportOpen(false)}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[70] w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[24px] border-2 border-[#111] bg-[#FAFAF7] p-5 shadow-[5px_6px_0_#111]"
            initial={{ opacity: 0, scale: 0.94, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-hand)] text-2xl">Export</h2>
              <button type="button" onClick={() => setExportOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setExportFormat(f.id)}
                  className={cn(
                    "rounded-full px-3 py-1 font-[family-name:var(--font-hand)] text-sm",
                    format === f.id ? "bg-accent text-white" : "bg-[#F3F1EA]",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <pre className="max-h-48 overflow-auto rounded-xl bg-[#F3F1EA] p-3 font-mono text-[10px] leading-relaxed">
              <code>{code.slice(0, 4000)}{code.length > 4000 ? "…" : ""}</code>
            </pre>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void copy()}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-2.5 text-sm font-medium text-white"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              <button
                type="button"
                onClick={download}
                className="flex-1 rounded-full border-2 border-[#111] py-2.5 font-[family-name:var(--font-hand)] text-base"
              >
                Download
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
