"use client";

import { useState } from "react";
import { CHARACTER_PICKER, getReplaceOptions } from "@/lib/replace-options";
import { STICKER_LABELS } from "@/lib/board-actions";
import type { CanvasObjectType, StickerLabel } from "@/types/canvas";
import { useDoodleStore } from "@/store/doodle-store";
import { pickRandom, CHARACTER_TYPES } from "@/lib/board-actions";
import { playAddCharacter, playHover } from "@/lib/sounds/doodle-sounds";

export function BoardPanels() {
  const activePanel = useDoodleStore((s) => s.activePanel);
  const closePanel = useDoodleStore((s) => s.closePanel);
  const selectedId = useDoodleStore((s) => s.selectedId);
  const items = useDoodleStore((s) => s.items);
  const addCharacterOfType = useDoodleStore((s) => s.addCharacterOfType);
  const addStickerToBoard = useDoodleStore((s) => s.addStickerToBoard);
  const replaceObjectWith = useDoodleStore((s) => s.replaceObjectWith);

  const selectedObject = items.find(
    (i): i is Extract<typeof i, { kind: "object" }> =>
      i.id === selectedId && i.kind === "object",
  );

  if (!activePanel) return null;

  return (
    <div className="pointer-events-auto fixed bottom-28 left-6 z-[55] sm:bottom-8 sm:left-[240px]">
      <div
        className="w-[min(320px,calc(100vw-48px))] rounded-[20px] border-2 border-[#111] bg-white p-4 shadow-[5px_6px_0_#111]"
        style={{ transform: "rotate(-0.5deg)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="font-[family-name:var(--font-hand)] text-[20px] font-semibold text-[#111]">
            {activePanel === "character"
              ? "Add character"
              : activePanel === "sticker"
                ? "Add sticker"
                : "Replace with"}
          </p>
          <button
            type="button"
            onClick={closePanel}
            className="font-[family-name:var(--font-hand)] text-[18px] text-[#111]/70 hover:text-[#111]"
          >
            ✕
          </button>
        </div>

        {activePanel === "character" ? (
          <div className="max-h-[280px] space-y-3 overflow-y-auto">
            {CHARACTER_PICKER.map((group) => (
              <div key={group.group}>
                <p className="mb-1.5 font-[family-name:var(--font-hand)] text-[15px] text-[#111]/75">
                  {group.group}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.types.map((t) => (
                    <button
                      key={`${group.group}-${t.label}`}
                      type="button"
                      onMouseEnter={() => playHover()}
                      onClick={() => addCharacterOfType(t.type)}
                      className="rounded-lg border-2 border-[#111] bg-[#F7ED99]/80 px-3 py-1.5 font-[family-name:var(--font-hand)] text-[16px] hover:scale-[1.03] active:scale-95"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                playAddCharacter();
                addCharacterOfType(pickRandom(CHARACTER_TYPES));
              }}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#111]/40 py-2 font-[family-name:var(--font-hand)] text-[17px] hover:bg-[#F3F1EA]"
            >
              <span className="text-[22px] leading-none" aria-hidden>
                🎲
              </span>
              Surprise Character
            </button>
          </div>
        ) : null}

        {activePanel === "sticker" ? <StickerPanel onAdd={addStickerToBoard} /> : null}

        {activePanel === "replace" && selectedObject ? (
          <div className="flex flex-wrap gap-2">
            {getReplaceOptions(selectedObject.type).map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => {
                  if (opt.type !== selectedObject.type) {
                    replaceObjectWith(selectedObject.id, opt.type);
                  } else {
                    closePanel();
                  }
                }}
                className="rounded-lg border-2 border-[#111] bg-[#F3F1EA] px-3 py-2 font-[family-name:var(--font-hand)] text-[16px] hover:bg-[#F7ED99]/70 active:scale-95"
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}

        {activePanel === "replace" && !selectedObject ? (
          <p className="font-[family-name:var(--font-hand)] text-[16px] text-[#111]">
            Select a doodle on the canvas to replace it.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function StickerPanel({
  onAdd,
}: {
  onAdd: (label?: StickerLabel, customText?: string) => void;
}) {
  const [tab, setTab] = useState<"preset" | "custom">("preset");
  const [custom, setCustom] = useState("");

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("preset")}
          className={`flex-1 rounded-lg border-2 py-1.5 font-[family-name:var(--font-hand)] text-[16px] ${
            tab === "preset" ? "border-[#111] bg-[#F7ED99]" : "border-[#111]/20"
          }`}
        >
          Preset
        </button>
        <button
          type="button"
          onClick={() => setTab("custom")}
          className={`flex-1 rounded-lg border-2 py-1.5 font-[family-name:var(--font-hand)] text-[16px] ${
            tab === "custom" ? "border-[#111] bg-[#F7ED99]" : "border-[#111]/20"
          }`}
        >
          Custom
        </button>
      </div>

      {tab === "preset" ? (
        <div className="flex flex-wrap gap-2">
          {STICKER_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onAdd(label)}
              className="rounded-sm border-2 border-[#111] bg-[#F7ED99] px-2.5 py-1 font-[family-name:var(--font-hand)] text-[16px] shadow-[2px_2px_0_#111] hover:scale-105 active:scale-95"
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder='e.g. "Launch Day"'
            maxLength={24}
            className="w-full rounded-lg border-2 border-[#111] px-3 py-2 font-[family-name:var(--font-hand)] text-[17px] outline-none focus:ring-2 focus:ring-accent/40"
          />
          <p className="font-[family-name:var(--font-hand)] text-[15px] text-[#111]/70">
            Try: Launch Day, Fix Bug, Coffee First
          </p>
          <button
            type="button"
            disabled={!custom.trim()}
            onClick={() => {
              onAdd("WOW", custom.trim());
              setCustom("");
            }}
            className="w-full rounded-xl border-2 border-[#111] bg-accent py-2 font-[family-name:var(--font-hand)] text-[17px] font-semibold text-white shadow-[3px_3px_0_#111] disabled:opacity-40"
          >
            Create sticker
          </button>
        </div>
      )}
    </div>
  );
}
