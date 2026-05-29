"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function SparkleDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;

  return (
    <motion.svg viewBox="0 0 200 140" className="h-40 w-72">
      {[
        { x: 40, y: 50, s: 1 },
        { x: 100, y: 30, s: 1.2 },
        { x: 160, y: 55, s: 0.9 },
        { x: 80, y: 90, s: 1.1 },
        { x: 140, y: 100, s: 0.8 },
      ].map((star, i) => (
        <motion.path
          key={i}
          d={`M${star.x} ${star.y - 8 * star.s} l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z`}
          fill="#FFF59D"
          stroke="#111"
          strokeWidth="1"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{
            duration: dur * 0.6,
            delay: config.delay + i * 0.12,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        />
      ))}
      <motion.path
        d="M60 110 Q100 95 140 108"
        stroke="#6B5BFF"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: dur, repeat: Infinity, repeatDelay: 0.5 }}
      />
      <motion.text
        x="55"
        y="125"
        className="font-[family-name:var(--font-hand)] text-sm fill-[#111]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: config.delay + 0.3 }}
      >
        welcome aboard ✦
      </motion.text>
    </motion.svg>
  );
}
