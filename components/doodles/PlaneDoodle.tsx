"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function PlaneDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;
  const drift = 20 + config.distance * 0.3;
  return (
    <motion.svg viewBox="0 0 140 80" className="h-24 w-40">
      <motion.g
        animate={{ x: [-drift, drift, -drift], y: [0, -8, 0] }}
        transition={{ duration: dur * 2, repeat: Infinity, ease: "easeInOut", delay: config.delay }}
      >
        <path
          d="M20 45 L70 35 L120 45 L70 50 Z"
          fill="#FAFAF7"
          stroke="#111"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M55 35 L70 15 L85 35" fill="#6B5BFF" stroke="#111" strokeWidth="1.5" />
      </motion.g>
    </motion.svg>
  );
}
