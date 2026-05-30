"use client";

import { motion } from "framer-motion";
import { AMBIENT } from "@/lib/ambient-motion";
import type { FillerType } from "@/types/canvas";

const STROKE = { stroke: "#111", strokeWidth: 2, fill: "none" as const };

function StarShape() {
  return (
    <path
      d="M16 4 L19 12 L28 12 L21 17 L24 26 L16 21 L8 26 L11 17 L4 12 L13 12 Z"
      fill="#F7ED99"
      stroke="#111"
      strokeWidth="1.8"
    />
  );
}

function HeartShape() {
  return (
    <path
      d="M16 24 C16 24 4 16 4 10 C4 6 7 4 10 4 C13 4 16 7 16 7 C16 7 19 4 22 4 C25 4 28 6 28 10 C28 16 16 24 16 24 Z"
      fill="#FFAB91"
      stroke="#111"
      strokeWidth="1.8"
    />
  );
}

function SparkleShape() {
  return (
    <>
      <line x1="16" y1="2" x2="16" y2="30" {...STROKE} />
      <line x1="2" y1="16" x2="30" y2="16" {...STROKE} />
      <line x1="6" y1="6" x2="26" y2="26" {...STROKE} strokeWidth="1.5" />
      <line x1="26" y1="6" x2="6" y2="26" {...STROKE} strokeWidth="1.5" />
    </>
  );
}

function SwirlShape() {
  return (
    <path
      d="M8 20 C8 8 24 8 24 16 C24 22 14 22 14 16 C14 12 20 12 20 14"
      {...STROKE}
      strokeWidth="2"
    />
  );
}

function DotShape() {
  return <circle cx="16" cy="16" r="5" fill="#111" />;
}

function ArrowShape() {
  return (
    <>
      <line x1="6" y1="22" x2="24" y2="10" {...STROKE} />
      <path d="M18 8 L26 10 L24 18" {...STROKE} strokeLinejoin="round" />
    </>
  );
}

function TinyCloudShape() {
  return (
    <>
      <ellipse cx="14" cy="18" rx="10" ry="7" fill="#E8F4FF" stroke="#111" strokeWidth="1.8" />
      <ellipse cx="22" cy="16" rx="8" ry="6" fill="#E8F4FF" stroke="#111" strokeWidth="1.8" />
    </>
  );
}

const SHAPES: Record<FillerType, React.FC> = {
  star: StarShape,
  heart: HeartShape,
  sparkle: SparkleShape,
  swirl: SwirlShape,
  dot: DotShape,
  arrow: ArrowShape,
  cloud: TinyCloudShape,
};

export function FillerDoodle({ type }: { type: FillerType }) {
  const Shape = SHAPES[type];
  const float =
    type === "star" || type === "sparkle"
      ? {
          animate: { y: [-2, 2] },
          transition: {
            duration: 2.4 + Math.random() * 0.8,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut" as const,
          },
        }
      : type === "heart"
        ? {
            animate: { scale: 1.06 },
            transition: {
              duration: 2.2,
              repeat: Infinity,
              repeatType: "reverse" as const,
              ease: "easeInOut" as const,
            },
          }
        : {
            animate: { rotate: [-3, 3] },
            transition: AMBIENT.wobble.transition,
          };

  return (
    <motion.svg viewBox="0 0 32 32" className="h-7 w-7" {...float}>
      <Shape />
    </motion.svg>
  );
}
