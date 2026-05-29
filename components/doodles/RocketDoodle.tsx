"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function RocketDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;

  return (
    <motion.svg viewBox="0 0 200 200" className="h-52 w-52">
      <motion.g
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: [-20, -80], opacity: 1 }}
        transition={{
          duration: dur * 1.2,
          repeat: Infinity,
          repeatDelay: 0.8,
          delay: config.delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <path
          d="M100 30 L115 90 L100 85 L85 90 Z"
          fill="#FAFAF7"
          stroke="#111"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="55" r="8" fill="#B8D4FF" stroke="#111" strokeWidth="1.5" />
        <path d="M85 90 L70 110 L85 100 Z" fill="#6B5BFF" stroke="#111" strokeWidth="1.5" />
        <path d="M115 90 L130 110 L115 100 Z" fill="#6B5BFF" stroke="#111" strokeWidth="1.5" />
        <motion.path
          d="M92 95 Q100 130 108 95"
          fill="#FFAB91"
          stroke="#111"
          strokeWidth="1.5"
          animate={{ scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.6] }}
          transition={{ duration: dur * 0.4, repeat: Infinity }}
          style={{ originX: "100px", originY: "95px" }}
        />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={80 + i * 20}
          cy={160}
          r={3}
          fill="#111"
          opacity={0.2}
          animate={{ y: [0, 20], opacity: [0.3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </motion.svg>
  );
}
