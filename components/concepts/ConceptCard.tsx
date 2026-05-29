"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedConceptPreview } from "@/components/concepts/AnimatedConceptPreview";
import type { DoodleConcept } from "@/types/doodle-app";

export function ConceptCard({
  concept,
  index,
  isPicked,
  onPick,
  onOpen,
}: {
  concept: DoodleConcept;
  index: number;
  isPicked: boolean;
  onPick: () => void;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const speedMultiplier = hovered ? 1.35 : 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, scale: isPicked ? 1.01 : hovered ? 1.005 : 1 }}
      transition={{ delay: index * 0.06, duration: 0.22 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex w-[400px] shrink-0 flex-col overflow-hidden rounded-[28px] bg-white"
      style={{
        minHeight: 600,
        border: isPicked
          ? "3px solid #6B5BFF"
          : hovered
            ? "2px solid rgba(17,17,17,0.22)"
            : "2px solid rgba(17,17,17,0.14)",
        boxShadow: "4px 6px 0 rgba(17,17,17,0.09)",
      }}
    >
      <button
        type="button"
        onClick={onPick}
        className="flex min-h-0 flex-1 flex-col text-left"
      >
        <div className="px-5 pb-4 pt-5">
          <div className="min-h-[340px]">
            <AnimatedConceptPreview
              blueprint={concept.preview}
              mood={concept.mood}
              heroType={concept.heroType}
              config={concept.config}
              speed={concept.speed}
              intensity={concept.intensity}
              speedMultiplier={speedMultiplier}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 pb-5">
          <span
            className="inline-flex w-fit rounded-full bg-[#F7ED99] px-3.5 py-1.5 font-[family-name:var(--font-hand)] text-[16px] font-semibold text-[#111]"
            style={{ transform: "rotate(-2deg)" }}
          >
            {concept.badge}
          </span>

          <h3 className="font-[family-name:var(--font-hand)] text-[24px] leading-[1.15] text-[#111]">
            {concept.title}
          </h3>

          <div className="flex flex-wrap gap-x-5 gap-y-1 font-[family-name:var(--font-hand)] text-[16px] leading-snug text-[#111]">
            <span>
              {concept.stats.doodles} doodle{concept.stats.doodles === 1 ? "" : "s"}
            </span>
            {concept.stats.stickers > 0 ? (
              <span>
                {concept.stats.stickers} sticker{concept.stats.stickers === 1 ? "" : "s"}
              </span>
            ) : null}
            <span>
              {concept.stats.animations} animation{concept.stats.animations === 1 ? "" : "s"}
            </span>
          </div>

          <p className="font-[family-name:var(--font-hand)] text-[17px] leading-relaxed text-[#111]">
            {concept.description}
          </p>
        </div>
      </button>

      <div className="mt-auto min-h-[72px] border-t border-[#111]/10 px-6 pb-6 pt-5">
        {isPicked ? (
          <button
            type="button"
            onClick={() => void onOpen()}
            className="w-full rounded-2xl border-2 border-[#111] bg-accent px-4 py-3.5 font-[family-name:var(--font-hand)] text-[18px] font-semibold text-white shadow-[4px_4px_0_#111] transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Open Board →
          </button>
        ) : (
          <p className="text-center font-[family-name:var(--font-hand)] text-[17px] text-[#111]/0 transition-colors group-hover:text-[#111]/55">
            Click card to choose
          </p>
        )}
      </div>
    </motion.article>
  );
}
