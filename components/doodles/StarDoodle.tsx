"use client";

import { motion } from "framer-motion";
import { AMBIENT } from "@/lib/ambient-motion";
import type { MotionConfig } from "@/types/motion";

export function StarDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;
  const twinkle = AMBIENT.twinkle(dur, config.delay);
  return (
    <motion.svg viewBox="0 0 100 100" className="h-28 w-28">
      <motion.path
        d="M50 8 L58 38 L90 38 L64 56 L74 88 L50 68 L26 88 L36 56 L10 38 L42 38 Z"
        fill="#FFF59D"
        stroke="#111"
        strokeWidth="2"
        animate={twinkle.animate}
        transition={twinkle.transition}
        style={{ originX: "50px", originY: "50px" }}
      />
    </motion.svg>
  );
}
