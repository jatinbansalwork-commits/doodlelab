"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function MonitorDoodle({ config }: { config: MotionConfig }) {
  return (
    <motion.svg viewBox="0 0 100 90" className="h-24 w-28">
      <rect x="8" y="8" width="84" height="52" rx="3" fill="#FAFAF7" stroke="#111" strokeWidth="2" />
      <rect x="14" y="14" width="72" height="40" fill="#B8D4FF" stroke="#111" strokeWidth="1" />
      <path d="M40 60 L60 60 L65 78 L35 78 Z" fill="#E8DCC8" stroke="#111" strokeWidth="2" />
      <motion.rect
        x="20"
        y="22"
        width="24"
        height="4"
        fill="#6B5BFF"
        animate={{ width: [24, 50, 24] }}
        transition={{ duration: config.duration * 2, repeat: Infinity }}
      />
    </motion.svg>
  );
}
