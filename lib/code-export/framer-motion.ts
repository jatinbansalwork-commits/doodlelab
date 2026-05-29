import type { MotionConfig } from "@/types/motion";
import { MOTION_TYPE_LABELS } from "@/lib/constants";

export function generateFramerMotionCode(config: MotionConfig): string {
  const label = MOTION_TYPE_LABELS[config.type] ?? config.type;

  return `"use client";

import { motion } from "framer-motion";

/** ${label} — DoodleLab AI */
export const motionLabVariants = {
  hidden: { opacity: 0, y: ${config.type === "slideUp" ? config.distance : config.type === "slideDown" ? -config.distance : 0} },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ${config.duration},
      delay: ${config.delay},
      ease: ${config.easing === "spring" ? '[0.34, 1.56, 0.64, 1]' : `"${config.easing}"`},${config.stagger ? "\n      staggerChildren: 0.15," : ""}
    },
  },
};

export function MotionLabBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={motionLabVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
`;
}
