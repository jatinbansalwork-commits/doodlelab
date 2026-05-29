"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function CatDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;
  const blink = {
    animate: { scaleY: [1, 0.12, 1] },
    transition: {
      duration: 0.1,
      repeat: Infinity,
      repeatDelay: 3.4,
      ease: "easeInOut" as const,
    },
  };

  return (
    <motion.svg viewBox="0 0 120 100" className="h-28 w-32">
      <motion.g
        animate={{ rotate: [0, -2, 2, 0] }}
        transition={{ duration: dur * 2, repeat: Infinity, delay: config.delay, ease: "easeInOut" }}
      >
        <ellipse cx="60" cy="58" rx="28" ry="22" fill="#E8E4FF" stroke="#111" strokeWidth="2" />
        <path d="M38 42 L32 22 L48 38 Z M82 42 L88 22 L72 38 Z" fill="#E8E4FF" stroke="#111" strokeWidth="2" />
        <motion.g style={{ originX: "50px", originY: "52px" }} {...blink}>
          <circle cx="50" cy="52" r="2.5" fill="#111" />
        </motion.g>
        <motion.g
          style={{ originX: "70px", originY: "52px" }}
          {...blink}
          transition={{ ...blink.transition, delay: config.delay + 0.06 }}
        >
          <circle cx="70" cy="52" r="2.5" fill="#111" />
        </motion.g>
        <path d="M58 62 Q60 66 62 62" stroke="#111" strokeWidth="1.5" fill="none" />
        <motion.path
          d="M85 65 Q95 70 90 78"
          stroke="#111"
          strokeWidth="2"
          fill="none"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: dur * 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "85px", originY: "65px" }}
        />
      </motion.g>
    </motion.svg>
  );
}
