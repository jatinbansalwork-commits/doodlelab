"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function LaptopDoodle({ config }: { config: MotionConfig }) {
  return (
    <motion.svg viewBox="0 0 120 80" className="h-20 w-28">
      <rect x="15" y="12" width="90" height="48" rx="4" fill="#FAFAF7" stroke="#111" strokeWidth="2" />
      <rect x="22" y="18" width="76" height="36" fill="#E8E4FF" stroke="#111" strokeWidth="1.5" />
      <path d="M8 60 L112 60 L120 72 L0 72 Z" fill="#E8DCC8" stroke="#111" strokeWidth="2" />
      <motion.circle
        cx="60"
        cy="36"
        r="3"
        fill="#6B5BFF"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: config.duration * 1.5, repeat: Infinity, delay: config.delay }}
      />
    </motion.svg>
  );
}
