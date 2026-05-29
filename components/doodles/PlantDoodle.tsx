"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function PlantDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;

  return (
    <motion.svg viewBox="0 0 140 160" className="h-48 w-40">
      <path
        d="M45 140 Q50 100 55 140 Q60 95 65 140"
        fill="#E8DCC8"
        stroke="#111"
        strokeWidth="2"
      />
      <motion.path
        d="M60 140 L60 90"
        stroke="#111"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: dur, delay: config.delay }}
      />
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: dur, delay: config.delay + 0.2, type: "spring" }}
        style={{ originX: "60px", originY: "90px" }}
      >
        <ellipse cx="45" cy="75" rx="18" ry="12" fill="#A8E6A1" stroke="#111" strokeWidth="1.5" transform="rotate(-25 45 75)" />
        <ellipse cx="75" cy="70" rx="18" ry="12" fill="#A8E6A1" stroke="#111" strokeWidth="1.5" transform="rotate(25 75 70)" />
        <ellipse cx="60" cy="55" rx="14" ry="18" fill="#7DCE82" stroke="#111" strokeWidth="1.5" />
      </motion.g>
      <motion.circle
        cx="90"
        cy="40"
        r="6"
        fill="#FFF59D"
        stroke="#111"
        strokeWidth="1"
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
        transition={{ delay: config.delay + dur * 0.8, duration: 0.4 }}
      />
    </motion.svg>
  );
}
