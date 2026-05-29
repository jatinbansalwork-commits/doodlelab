"use client";

import { motion } from "framer-motion";
import type { MotionConfig } from "@/types/motion";

export function DogDoodle({ config }: { config: MotionConfig }) {
  const dur = config.duration;
  const amp = 8 + (config.distance / 30) * 12;

  return (
    <motion.svg
      viewBox="0 0 200 120"
      className="h-40 w-64 sm:h-48 sm:w-80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.g
        animate={{ x: [0, amp, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: config.delay }}
      >
        <ellipse cx="70" cy="85" rx="38" ry="22" fill="#E8E4FF" stroke="#111" strokeWidth="2" />
        <path
          d="M95 70 Q110 45 130 55 L145 48 Q155 65 140 75 L135 90 Q120 95 105 88 Z"
          fill="#FAFAF7"
          stroke="#111"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="128" cy="58" r="3" fill="#111" />
        <path d="M142 62 Q148 68 140 72" stroke="#111" strokeWidth="1.5" fill="none" />
        <motion.path
          d="M55 78 L40 70 M55 82 L38 88"
          stroke="#111"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: dur * 0.5, repeat: Infinity }}
          style={{ originX: "55px", originY: "80px" }}
        />
        <motion.path
          d="M85 88 L75 100 M90 90 L82 105"
          stroke="#111"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ rotate: [0, -15, 15, 0] }}
          transition={{ duration: dur * 0.5, repeat: Infinity, delay: 0.1 }}
          style={{ originX: "88px", originY: "90px" }}
        />
        <path d="M148 72 L165 68 L160 78 Z" fill="#6B5BFF" stroke="#111" strokeWidth="1.5" />
      </motion.g>
      <motion.text
        x="10"
        y="20"
        className="font-[family-name:var(--font-hand)] text-[11px] fill-[#6B5BFF]"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        wag wag ~
      </motion.text>
    </motion.svg>
  );
}
