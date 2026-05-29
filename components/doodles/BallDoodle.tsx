"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function BallDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;
  const bounce = 30 + config.distance * 0.5;

  return (
    <motion.svg viewBox="0 0 120 160" className="h-44 w-36">
      <path d="M10 140 Q60 145 110 140" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
      <motion.g
        animate={{ y: [0, -bounce, 0] }}
        transition={{
          duration: dur,
          repeat: Infinity,
          ease: [0.34, 1.4, 0.64, 1],
          delay: config.delay,
        }}
      >
        <circle cx="60" cy="70" r="28" fill="#6B5BFF" stroke="#111" strokeWidth="2" />
        <path d="M45 60 Q60 50 75 62" stroke="#fff" strokeWidth="2" fill="none" opacity={0.5} />
      </motion.g>
      <motion.text
        x="75"
        y="50"
        className="text-lg"
        animate={{ opacity: [0, 1, 0], y: [0, -20] }}
        transition={{ duration: dur, repeat: Infinity }}
      >
        boing!
      </motion.text>
    </motion.svg>
  );
}
