"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOADING_STATUS_MESSAGES } from "@/lib/loading-status-messages";
import { useDoodleStore } from "@/store/doodle-store";

export function BoardGenerating() {
  const isGeneratingBoard = useDoodleStore((s) => s.isGeneratingBoard);
  const selectedConcept = useDoodleStore((s) => s.selectedConcept);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!isGeneratingBoard) {
      setStatusIndex(0);
      return;
    }
    const interval = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % LOADING_STATUS_MESSAGES.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [isGeneratingBoard]);

  if (!isGeneratingBoard) return null;

  const status = LOADING_STATUS_MESSAGES[statusIndex]!;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[60] flex items-center justify-center bg-[#FAFAF7]/92 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-6 max-w-md rounded-[28px] border-2 border-[#111] bg-white px-10 py-10 text-center shadow-[6px_8px_0_#111]"
        style={{ transform: "rotate(-1deg)" }}
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-5 text-[48px]"
          aria-hidden
        >
          ✨
        </motion.div>
        <p className="font-[family-name:var(--font-hand)] text-[28px] leading-snug text-[#111]">
          Generating your doodle world…
        </p>
        <div className="mt-3 min-h-[28px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="font-[family-name:var(--font-hand)] text-[18px] text-[#111]/80"
            >
              {status}
            </motion.p>
          </AnimatePresence>
        </div>
        {selectedConcept ? (
          <p className="mt-1 font-[family-name:var(--font-hand)] text-[16px] text-[#111]/60">
            Building {selectedConcept.title}
          </p>
        ) : null}
        <div className="mt-6 flex justify-center gap-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-accent"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.55,
                repeat: Infinity,
                delay: i * 0.12,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
