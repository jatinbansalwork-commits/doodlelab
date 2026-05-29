"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  pickIdleTrigger,
  pickTeachTrigger,
  type BuddyMood,
} from "@/lib/doodle-buddy/messages";
import { useDoodleStore } from "@/store/doodle-store";

const FLOAT = {
  animate: { y: [-4, 4] },
  transition: {
    duration: 2.6,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  },
};

const MOOD_BOUNCE: Record<BuddyMood, { scale: number[]; rotate: number[] }> = {
  happy: { scale: [1, 1.06, 1], rotate: [0, 0, 0] },
  celebrate: { scale: [1, 1.14, 0.96, 1.08, 1], rotate: [0, -6, 6, -3, 0] },
  teach: { scale: [1, 1.05, 1], rotate: [0, -4, 4, 0] },
  wave: { scale: [1, 1.08, 1], rotate: [0, 8, -6, 0] },
};

function BuddySprite({ mood }: { mood: BuddyMood }) {
  const pop = MOOD_BOUNCE[mood];

  return (
    <motion.div
      key={mood}
      animate={{ scale: pop.scale, rotate: pop.rotate }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative"
      aria-hidden
    >
      <svg width="56" height="64" viewBox="0 0 56 64" fill="none">
        <ellipse cx="28" cy="36" rx="22" ry="24" fill="#F7ED99" stroke="#111" strokeWidth="2" />
        <circle cx="20" cy="32" r="3" fill="#111" />
        <circle cx="36" cy="32" r="3" fill="#111" />
        <path
          d="M20 42 Q28 50 36 42"
          stroke="#111"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 28 Q14 18 22 24"
          stroke="#111"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M48 28 Q42 18 34 24"
          stroke="#111"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="44" cy="14" r="5" fill="#6B5BFF" stroke="#111" strokeWidth="1.5" opacity="0.9" />
      </svg>
    </motion.div>
  );
}

export function DoodleBuddy() {
  const boardReady = useDoodleStore((s) => s.boardReady);
  const isGeneratingBoard = useDoodleStore((s) => s.isGeneratingBoard);
  const items = useDoodleStore((s) => s.items);
  const buddyCue = useDoodleStore((s) => s.buddyCue);
  const buddyReact = useDoodleStore((s) => s.buddyReact);

  const teachTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!boardReady || isGeneratingBoard) return;

    const scheduleTeach = () => {
      const delay = 38000 + Math.random() * 22000;
      teachTimeoutRef.current = window.setTimeout(() => {
        buddyReact(pickTeachTrigger());
        scheduleTeach();
      }, delay);
    };

    scheduleTeach();

    const idleInterval = window.setInterval(() => {
      const stickerHeavy =
        items.filter((i) => i.kind === "sticker").length >= 2;
      buddyReact(pickIdleTrigger(stickerHeavy));
    }, 55000);

    return () => {
      if (teachTimeoutRef.current) clearTimeout(teachTimeoutRef.current);
      clearInterval(idleInterval);
    };
  }, [boardReady, isGeneratingBoard, buddyReact, items]);

  if (!boardReady || isGeneratingBoard) return null;

  const mood = buddyCue?.mood ?? "happy";

  return (
    <div
      className="pointer-events-none absolute bottom-5 left-5 z-[38] select-none"
      aria-live="polite"
      aria-label="Doodle Buddy"
    >
      <motion.div {...FLOAT} className="flex flex-col items-start gap-1">
        <AnimatePresence mode="wait">
          {buddyCue ? (
            <motion.div
              key={buddyCue.seq}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mb-1 max-w-[140px] rounded-2xl border-2 border-[#111] bg-white px-3 py-1.5 shadow-[3px_3px_0_#111]"
              style={{ transform: "rotate(-2deg)" }}
            >
              <p className="font-[family-name:var(--font-hand)] text-[17px] leading-tight text-[#111]">
                {buddyCue.text}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <BuddySprite mood={mood} />
      </motion.div>
    </div>
  );
}
