"use client";

import { motion } from "framer-motion";
import { useDoodleStore } from "@/store/doodle-store";

const SUGGESTIONS = [
  "A dog going to work",
  "A sleepy cat coding",
  "A startup rocket launch",
  "A designer fighting deadlines",
];

export function PromptScreen() {
  const prompt = useDoodleStore((s) => s.prompt);
  const setPrompt = useDoodleStore((s) => s.setPrompt);
  const doodleIt = useDoodleStore((s) => s.doodleIt);
  const isGenerating = useDoodleStore((s) => s.isGenerating);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <motion.div
        className="flex w-full max-w-[720px] flex-col items-center text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="font-[family-name:var(--font-hand)] text-[72px] leading-[0.95] text-[#111] sm:text-[88px]">
          DoodleLab
        </h1>

        <p className="mt-4 font-[family-name:var(--font-hand)] text-[22px] leading-snug text-[#111]/80 sm:text-[24px]">
          Turn ideas into playful animated doodles.
        </p>

        <div className="mt-12 w-full max-w-[680px]">
          <label htmlFor="doodle-prompt" className="sr-only">
            Describe your doodle idea
          </label>
          <textarea
            id="doodle-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void doodleIt();
              }
            }}
            placeholder="A sleepy cat coding…"
            rows={2}
            autoFocus
            className="w-full resize-none rounded-2xl border-2 border-transparent bg-[#111]/[0.03] px-6 py-7 text-center font-[family-name:var(--font-hand)] text-[48px] leading-[1.12] text-[#111] placeholder:text-[#111]/40 transition-[border-color,box-shadow,background-color] focus:border-[#6B5BFF]/35 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6B5BFF]/12 sm:text-[56px] sm:py-8"
          />
        </div>

        <div className="mt-6 flex max-w-[680px] flex-wrap items-center justify-center gap-2.5">
          {SUGGESTIONS.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => setPrompt(text)}
              className="rounded-full border border-[#111]/10 bg-[#111]/[0.04] px-4 py-2 font-[family-name:var(--font-hand)] text-[18px] text-[#111]/70 transition-colors hover:border-[#6B5BFF]/25 hover:bg-[#6B5BFF]/8 hover:text-[#111] sm:text-[20px]"
            >
              {text}
            </button>
          ))}
        </div>

        <motion.button
          type="button"
          disabled={!prompt.trim() || isGenerating}
          onClick={() => void doodleIt()}
          className="mt-8 rounded-full border-2 border-[#111] bg-accent px-11 py-3.5 font-[family-name:var(--font-hand)] text-[20px] text-white shadow-[3px_4px_0_#111] transition-opacity disabled:opacity-40 sm:text-[22px]"
          whileHover={{ y: -1 }}
          whileTap={{ y: 1, boxShadow: "2px 2px 0 #111" }}
        >
          {isGenerating ? "imagining…" : "✨ Doodle It"}
        </motion.button>
      </motion.div>
    </div>
  );
}
