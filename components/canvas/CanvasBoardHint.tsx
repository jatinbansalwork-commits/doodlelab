"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDoodleStore } from "@/store/doodle-store";

const HINTS = [
  "Click an object to interact",
  "Pick something and make it move",
] as const;

export function CanvasBoardHint() {
  const selectedId = useDoodleStore((s) => s.selectedId);
  const boardReady = useDoodleStore((s) => s.boardReady);
  const [dismissed, setDismissed] = useState(false);
  const hint = useMemo(() => HINTS[Math.floor(Math.random() * HINTS.length)]!, []);

  useEffect(() => {
    if (selectedId) setDismissed(true);
  }, [selectedId]);

  useEffect(() => {
    if (!boardReady) {
      setDismissed(false);
      return;
    }
    const t = window.setTimeout(() => setDismissed(true), 14000);
    return () => window.clearTimeout(t);
  }, [boardReady]);

  const visible = boardReady && !dismissed && !selectedId;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute left-1/2 top-4 z-[35] -translate-x-1/2 rounded-full border border-[#111]/15 bg-white/90 px-4 py-1.5 font-[family-name:var(--font-hand)] text-[16px] text-[#111]/75 shadow-sm"
        >
          {hint}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
