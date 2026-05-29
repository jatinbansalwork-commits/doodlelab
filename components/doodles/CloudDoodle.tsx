"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function CloudDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;
  const drift = 12 + config.distance * 0.4;

  return (
    <motion.svg viewBox="0 0 220 100" className="h-36 w-72">
      <motion.g
        animate={{ x: [-drift, drift, -drift], y: [0, -6, 0] }}
        transition={{ duration: dur * 2, repeat: Infinity, ease: "easeInOut", delay: config.delay }}
      >
        <path
          d="M50 55 Q40 35 60 30 Q70 15 95 25 Q115 10 135 28 Q165 20 170 45 Q195 50 185 65 Q195 80 165 75 L55 78 Q35 78 50 55 Z"
          fill="#fff"
          stroke="#111"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <motion.circle
          cx="120"
          cy="40"
          r="4"
          fill="#6B5BFF"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.g>
      <motion.path
        d="M20 70 Q30 75 25 85"
        stroke="#111"
        strokeWidth="1"
        strokeDasharray="3 4"
        fill="none"
        animate={{ pathLength: [0, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
    </motion.svg>
  );
}
