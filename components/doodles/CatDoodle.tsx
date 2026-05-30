"use client";

import { motion } from "framer-motion";
import type { CatEmotion } from "@/lib/cat-emotion";
import type { MotionConfig } from "@/types/motion";

function FaceFeatures({ emotion }: { emotion: CatEmotion }) {
  const blink = {
    animate: { scaleY: [1, 0.12, 1] },
    transition: {
      duration: 0.1,
      repeat: Infinity,
      repeatDelay: 3.4,
      ease: "easeInOut" as const,
    },
  };

  const eyeY = emotion === "sleepy" ? 54 : 52;
  const eyeR = emotion === "surprised" ? 3.5 : emotion === "excited" ? 3 : 2.5;

  const leftEye =
    emotion === "sleepy" ? (
      <path d="M44 54 Q50 56 56 54" stroke="#111" strokeWidth="2" fill="none" />
    ) : emotion === "angry" ? (
      <path d="M44 50 L56 54" stroke="#111" strokeWidth="2.5" fill="none" />
    ) : (
      <motion.g style={{ originX: "50px", originY: `${eyeY}px` }} {...blink}>
        <circle cx="50" cy={eyeY} r={eyeR} fill="#111" />
      </motion.g>
    );

  const rightEye =
    emotion === "sleepy" ? (
      <path d="M64 54 Q70 56 76 54" stroke="#111" strokeWidth="2" fill="none" />
    ) : emotion === "angry" ? (
      <path d="M64 50 L76 54" stroke="#111" strokeWidth="2.5" fill="none" />
    ) : (
      <motion.g
        style={{ originX: "70px", originY: `${eyeY}px` }}
        {...blink}
        transition={{ ...blink.transition, delay: 0.06 }}
      >
        <circle cx="70" cy={eyeY} r={eyeR} fill="#111" />
      </motion.g>
    );

  const mouth = (() => {
    switch (emotion) {
      case "happy":
        return <path d="M54 64 Q60 70 66 64" stroke="#111" strokeWidth="1.8" fill="none" />;
      case "sleepy":
        return <ellipse cx="60" cy="66" rx="4" ry="2" fill="#111" />;
      case "surprised":
        return <circle cx="60" cy="66" r="4" fill="none" stroke="#111" strokeWidth="1.8" />;
      case "confused":
        return <path d="M56 66 Q60 62 64 66" stroke="#111" strokeWidth="1.8" fill="none" />;
      case "excited":
        return <path d="M52 64 Q60 72 68 64" stroke="#111" strokeWidth="2" fill="none" />;
      case "angry":
        return <path d="M54 68 Q60 62 66 68" stroke="#111" strokeWidth="2" fill="none" />;
      default:
        return <path d="M58 62 Q60 66 62 62" stroke="#111" strokeWidth="1.5" fill="none" />;
    }
  })();

  const brows =
    emotion === "angry" ? (
      <>
        <path d="M42 46 L54 48" stroke="#111" strokeWidth="2" fill="none" />
        <path d="M66 48 L78 46" stroke="#111" strokeWidth="2" fill="none" />
      </>
    ) : emotion === "confused" ? (
      <path d="M46 46 L74 44" stroke="#111" strokeWidth="1.5" fill="none" />
    ) : emotion === "surprised" ? (
      <>
        <path d="M44 44 Q50 40 56 44" stroke="#111" strokeWidth="1.5" fill="none" />
        <path d="M64 44 Q70 40 76 44" stroke="#111" strokeWidth="1.5" fill="none" />
      </>
    ) : null;

  return (
    <>
      {brows}
      {leftEye}
      {rightEye}
      {mouth}
    </>
  );
}

export function CatDoodle({
  config,
  emotion = "happy",
}: {
  config: MotionConfig;
  emotion?: CatEmotion;
}) {
  const dur = config.duration;
  const wiggle =
    emotion === "excited"
      ? { rotate: [0, -4, 4, 0] }
      : emotion === "sleepy"
        ? { rotate: [0, -1, 1, 0] }
        : { rotate: [0, -2, 2, 0] };

  return (
    <motion.svg viewBox="0 0 120 100" className="h-28 w-32">
      <motion.g
        animate={wiggle}
        transition={{ duration: dur * 2, repeat: Infinity, delay: config.delay, ease: "easeInOut" }}
      >
        <ellipse cx="60" cy="58" rx="28" ry="22" fill="#E8E4FF" stroke="#111" strokeWidth="2" />
        <path d="M38 42 L32 22 L48 38 Z M82 42 L88 22 L72 38 Z" fill="#E8E4FF" stroke="#111" strokeWidth="2" />
        <FaceFeatures emotion={emotion} />
        <motion.path
          d="M85 65 Q95 70 90 78"
          stroke="#111"
          strokeWidth="2"
          fill="none"
          animate={{ rotate: emotion === "excited" ? [0, 18, 0] : [0, 10, 0] }}
          transition={{ duration: dur * 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "85px", originY: "65px" }}
        />
      </motion.g>
    </motion.svg>
  );
}
