"use client";

import { playHover } from "@/lib/sounds/doodle-sounds";
import { useDoodleStore } from "@/store/doodle-store";

export function BoardTopBar({
  showActions,
}: {
  showActions: boolean;
}) {
  const backToPrompt = useDoodleStore((s) => s.backToPrompt);
  const setExportOpen = useDoodleStore((s) => s.setExportOpen);
  const selectedConcept = useDoodleStore((s) => s.selectedConcept);
  const remixBoard = useDoodleStore((s) => s.remixBoard);
  const soundMuted = useDoodleStore((s) => s.soundMuted);
  const toggleSoundMuted = useDoodleStore((s) => s.toggleSoundMuted);

  if (!selectedConcept) return null;

  return (
    <header className="pointer-events-auto fixed left-0 right-0 top-0 z-40 border-b border-[#111]/8 bg-[#FAFAF7]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
        <button
          type="button"
          onClick={backToPrompt}
          className="flex min-w-0 items-center gap-2 text-left hover:opacity-80"
        >
          <span
            className="shrink-0 font-[family-name:var(--font-hand)] text-[32px] leading-none text-[#111] sm:text-[36px]"
            aria-hidden
          >
            ←
          </span>
          <span className="min-w-0 truncate font-[family-name:var(--font-hand)] text-[22px] leading-tight text-[#111] sm:text-[26px]">
            {selectedConcept.title}
          </span>
          <span
            className="shrink-0 rounded-full bg-[#F7ED99] px-2.5 py-0.5 font-[family-name:var(--font-hand)] text-[15px] font-semibold text-[#111]"
            style={{ transform: "rotate(-1deg)" }}
          >
            {selectedConcept.badge}
          </span>
        </button>

        {showActions ? (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleSoundMuted}
              className="rounded-full border-2 border-[#111] bg-white px-3 py-2 font-[family-name:var(--font-hand)] shadow-[2px_2px_0_#111] hover:bg-[#F3F1EA] active:scale-95"
              aria-pressed={soundMuted}
              title={soundMuted ? "Unmute sounds" : "Mute sounds"}
            >
              <span className="text-[21px] leading-none" aria-hidden>
                {soundMuted ? "🔇" : "🔊"}
              </span>
            </button>
            <button
              type="button"
              onClick={remixBoard}
              onMouseEnter={() => playHover()}
              className="hidden items-center gap-2 rounded-full border-2 border-[#111] bg-accent px-4 py-2 font-[family-name:var(--font-hand)] text-[17px] font-semibold text-white shadow-[3px_3px_0_#111] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:inline-flex sm:px-5 sm:text-[18px]"
            >
              <span className="text-[22px] leading-none" aria-hidden>
                ✨
              </span>
              Remix
            </button>
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              onMouseEnter={() => playHover()}
              className="rounded-full border-2 border-[#111] bg-white px-4 py-2 font-[family-name:var(--font-hand)] text-[17px] shadow-[2px_3px_0_#111] hover:bg-[#FAFAF7] active:scale-[0.98] sm:px-5 sm:text-[18px]"
            >
              Export
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
