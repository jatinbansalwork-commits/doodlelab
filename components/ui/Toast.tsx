"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDoodleStore } from "@/store/doodle-store";

export function Toast() {
  const visible = useDoodleStore((s) => s.copyToast);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 left-1/2 z-[80] -translate-x-1/2 rounded-sm border-2 border-[#111] bg-[#F7ED99] px-4 py-2 font-[family-name:var(--font-hand)] text-lg shadow-[2px_3px_0_#111]"
        >
          copied ✨
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
