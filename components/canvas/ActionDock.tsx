"use client";

import { playDoodleSound } from "@/lib/sounds/doodle-sounds";
import { useDoodleStore } from "@/store/doodle-store";

const DOCK_ACTIONS = [
  { id: "remix", icon: "✨", label: "Remix Scene" },
  { id: "character", icon: "➕", label: "Add Character" },
  { id: "sticker", icon: "🎭", label: "Add Sticker" },
  { id: "surprise", icon: "🎲", label: "Surprise Me" },
] as const;

export function ActionDock() {
  const remixBoard = useDoodleStore((s) => s.remixBoard);
  const openPanel = useDoodleStore((s) => s.openPanel);
  const surpriseBoard = useDoodleStore((s) => s.surpriseBoard);

  const run = (id: (typeof DOCK_ACTIONS)[number]["id"]) => {
    switch (id) {
      case "remix":
        remixBoard();
        break;
      case "character":
        openPanel("character");
        break;
      case "sticker":
        openPanel("sticker");
        break;
      case "surprise":
        surpriseBoard();
        break;
    }
  };

  return (
    <div className="pointer-events-auto fixed bottom-8 left-6 z-50 flex flex-col items-start gap-2 sm:left-8">
      <p className="font-[family-name:var(--font-hand)] text-[15px] text-[#111]/65">
        Scene actions
      </p>
      <div
        className="flex flex-col gap-1 rounded-[22px] border-2 border-[#111] bg-white p-2 shadow-[4px_5px_0_#111]"
        style={{ transform: "rotate(-1deg)" }}
      >
        {DOCK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            onMouseEnter={() => playDoodleSound("hover")}
            onClick={() => run(action.id)}
            className={`flex min-w-[200px] items-center gap-3 rounded-xl px-3 py-2.5 text-left font-[family-name:var(--font-hand)] text-[18px] text-[#111] transition-colors hover:bg-[#F3F1EA] active:scale-[0.98] ${
              action.id === "remix" ? "bg-[#F7ED99]/60 font-semibold" : ""
            }`}
          >
            <span className="text-[20px]" aria-hidden>
              {action.icon}
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
