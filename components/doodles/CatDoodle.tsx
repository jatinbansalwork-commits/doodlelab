"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function CatDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;
  return (
    <motion.svg viewBox="0 0 120 100" className="h-28 w-32">
      <motion.g
        animate={{ rotate: [0, -3, 3, 0] }}
        transition={{ duration: dur * 1.5, repeat: Infinity, delay: config.delay }}
      >
        <ellipse cx="60" cy="58" rx="28" ry="22" fill="#E8E4FF" stroke="#111" strokeWidth="2" />
        <path d="M38 42 L32 22 L48 38 Z M82 42 L88 22 L72 38 Z" fill="#E8E4FF" stroke="#111" strokeWidth="2" />
        <circle cx="50" cy="52" r="2.5" fill="#111" />
        <circle cx="70" cy="52" r="2.5" fill="#111" />
        <path d="M58 62 Q60 66 62 62" stroke="#111" strokeWidth="1.5" fill="none" />
        <motion.path
          d="M85 65 Q95 70 90 78"
          stroke="#111"
          strokeWidth="2"
          fill="none"
          animate={{ rotate: [0, 15, 0] }}
          transition={{ duration: dur * 0.6, repeat: Infinity }}
          style={{ originX: "85px", originY: "65px" }}
        />
      </motion.g>
    </motion.svg>
  );
}
