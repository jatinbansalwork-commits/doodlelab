"use client";

import { ANIM_STYLE_LABEL } from "@/lib/item-motion";
import { playDoodleSound } from "@/lib/sounds/doodle-sounds";
import { useDoodleStore } from "@/store/doodle-store";

export function ContextToolbar() {
  const selectedId = useDoodleStore((s) => s.selectedId);
  const items = useDoodleStore((s) => s.items);
  const setEditPanelOpen = useDoodleStore((s) => s.setEditPanelOpen);
  const animateSelection = useDoodleStore((s) => s.animateSelection);
  const openPanel = useDoodleStore((s) => s.openPanel);
  const deleteItem = useDoodleStore((s) => s.deleteItem);

  const selected = items.find((i) => i.id === selectedId);
  if (!selected) return null;

  const isObject = selected.kind === "object";
  const styleHint =
    isObject && selected.playStyle
      ? ANIM_STYLE_LABEL[selected.playStyle]
      : null;

  return (
    <div className="pointer-events-auto fixed bottom-28 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-1 sm:bottom-8">
      <p className="font-[family-name:var(--font-hand)] text-[14px] text-[#111]/60">
        Object actions
      </p>
      <div
        className="flex gap-1 rounded-full border-2 border-[#111] bg-white px-2 py-2 shadow-[4px_5px_0_#111]"
        style={{ transform: "rotate(-0.5deg)" }}
      >
        {isObject ? (
          <button
            type="button"
            onMouseEnter={() => playDoodleSound("hover")}
            onClick={() => setEditPanelOpen(true)}
            className="rounded-full px-4 py-2 font-[family-name:var(--font-hand)] text-[18px] hover:bg-[#F7ED99]/50 active:scale-95"
          >
            ✏️ Edit
          </button>
        ) : null}
        <button
          type="button"
          onMouseEnter={() => playDoodleSound("hover")}
          onClick={() => animateSelection()}
          className="rounded-full px-4 py-2 font-[family-name:var(--font-hand)] text-[18px] hover:bg-[#F7ED99]/50 active:scale-95"
          title={styleHint ? `Current: ${styleHint}` : "Cycle animation style"}
        >
          ⚡ Animate
        </button>
        {isObject ? (
          <button
            type="button"
            onMouseEnter={() => playDoodleSound("hover")}
            onClick={() => openPanel("replace")}
            className="rounded-full px-4 py-2 font-[family-name:var(--font-hand)] text-[18px] hover:bg-[#F7ED99]/50 active:scale-95"
          >
            🎭 Replace
          </button>
        ) : null}
        <button
          type="button"
          onMouseEnter={() => playDoodleSound("hover")}
          onClick={() => deleteItem(selected.id)}
          className="rounded-full px-4 py-2 font-[family-name:var(--font-hand)] text-[18px] hover:bg-[#FFAB91]/40 active:scale-95"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
