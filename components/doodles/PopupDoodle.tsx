"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function PopupDoodle({ config }: { config: MotionConfig }) {
  return (
    <motion.svg viewBox="0 0 100 70" className="h-16 w-24">
      <motion.g
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: config.duration, repeat: Infinity, delay: config.delay }}
      >
        <rect x="4" y="4" width="92" height="52" rx="6" fill="#FFAB91" stroke="#111" strokeWidth="2" />
        <text x="50" y="28" textAnchor="middle" fontSize="10" fontFamily="cursive" fill="#111">
          error!
        </text>
        <text x="50" y="44" textAnchor="middle" fontSize="8" fontFamily="cursive" fill="#111">
          oops
        </text>
      </motion.g>
    </motion.svg>
  );
}
