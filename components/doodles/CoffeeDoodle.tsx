"use client";

import { motion } from "framer-motion";
import { AMBIENT } from "@/lib/ambient-motion";
import type { MotionConfig } from "@/types/motion";

export function CoffeeDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;
  return (
    <motion.svg viewBox="0 0 80 100" className="h-24 w-20">
      <motion.g
        style={{ originX: "44px", originY: "65px" }}
        {...AMBIENT.wobble}
      >
        <path
          d="M22 45 L22 75 Q22 85 40 85 L48 85 Q66 85 66 75 L66 45 Z"
          fill="#FAFAF7"
          stroke="#111"
          strokeWidth="2"
        />
        <path d="M66 52 Q78 52 78 62 Q78 70 66 68" fill="none" stroke="#111" strokeWidth="2" />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${32 + i * 10} 38 Q${35 + i * 10} 20 ${38 + i * 10} 38`}
          stroke="#111"
          strokeWidth="1.5"
          fill="none"
          {...AMBIENT.steam(dur, config.delay, i)}
        />
      ))}
    </motion.svg>
  );
}
