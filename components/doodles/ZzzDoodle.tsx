"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function ZzzDoodle({ config }: { config: MotionConfig }) {
  return (
    <motion.svg viewBox="0 0 80 50" className="h-12 w-20">
      {["Z", "z", "z"].map((z, i) => (
        <motion.text
          key={i}
          x={8 + i * 22}
          y={28 + i * 6}
          fontSize={22 - i * 4}
          fontFamily="cursive"
          fill="#111"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            delay: config.delay + i * 0.2,
          }}
        >
          {z}
        </motion.text>
      ))}
    </motion.svg>
  );
}
