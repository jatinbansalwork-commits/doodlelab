"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDoodleStore } from "@/store/doodle-store";
import type { StageMicroAction } from "@/lib/micro-interactions";

const LABELS: Record<StageMicroAction, string> = {
  remix: "✨",
  export: "📤",
};

export function StageMicroFx() {
  const stageMoment = useDoodleStore((s) => s.stageMoment);

  return (
    <AnimatePresence mode="wait">
      {stageMoment ? (
        <motion.div
          key={stageMoment.seq}
          className="pointer-events-none absolute inset-0 z-40 overflow-hidden rounded-[32px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {stageMoment.action === "remix" ? (
            <>
              <motion.div
                className="absolute inset-0 bg-[#F7ED99]/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-2 rounded-[28px] border-2 border-accent/50"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: [0.96, 1.02, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            </>
          ) : null}
          {stageMoment.action === "export" ? (
            <motion.div
              className="absolute inset-0 rounded-[32px]"
              style={{
                boxShadow: "inset 0 0 0 3px rgba(107,91,255,0.45)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.4, 0] }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          ) : null}
          <motion.span
            className="absolute right-4 top-4 font-[family-name:var(--font-hand)] text-[28px]"
            initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
            animate={{ scale: [0.5, 1.25, 1], opacity: [0, 1, 0], rotate: [-12, 8, 0] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            aria-hidden
          >
            {LABELS[stageMoment.action]}
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
