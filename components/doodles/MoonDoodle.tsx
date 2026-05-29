"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function MoonDoodle({ config }: { config: MotionConfig }) {
  return (
    <motion.svg viewBox="0 0 80 80" className="h-20 w-20">
      <motion.circle
        cx="40"
        cy="40"
        r="28"
        fill="#FFF59D"
        stroke="#111"
        strokeWidth="2"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: config.duration * 2, repeat: Infinity, delay: config.delay }}
      />
      <circle cx="52" cy="32" r="24" fill="#FAFAF7" />
    </motion.svg>
  );
}
