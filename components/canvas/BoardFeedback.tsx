"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useDoodleStore } from "@/store/doodle-store";

export function BoardFeedback() {
  const message = useDoodleStore((s) => s.boardFeedback);

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="pointer-events-none fixed left-1/2 top-[72px] z-50 -translate-x-1/2"
        >
          <p
            className="rounded-full border-2 border-[#111] bg-[#F7ED99] px-5 py-2 font-[family-name:var(--font-hand)] text-[18px] text-[#111] shadow-[3px_4px_0_#111]"
            style={{ transform: "rotate(-1deg)" }}
          >
            {message}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
