"use client";

import { motion } from "framer-motion";

export function SketchStar({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: [0, 8, -8, 0] }}
      transition={{ delay, duration: 0.6, rotate: { repeat: Infinity, duration: 4 } }}
    >
      <path
        d="M12 2 L14 9 L21 10 L15 15 L17 22 L12 18 L7 22 L9 15 L3 10 L10 9 Z"
        fill="#FFF59D"
        stroke="#111"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export function SketchArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" className={className} fill="none">
      <path
        d="M4 14 C12 6, 20 18, 44 10"
        stroke="#6B5BFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <path d="M38 8 L44 10 L40 16" stroke="#6B5BFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StickyLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`inline-block rotate-[-2deg] bg-[#FFF59D] px-3 py-1.5 font-[family-name:var(--font-hand)] text-sm text-[#111] shadow-[2px_3px_0_#11111118] ${className ?? ""}`}
      style={{ clipPath: "polygon(0 0, 100% 2%, 98% 100%, 2% 98%)" }}
    >
      {children}
    </div>
  );
}
