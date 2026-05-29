"use client";

import type { StickerLabel } from "@/types/canvas";

const STICKERS: StickerLabel[] = [
  "WOW",
  "MAGIC",
  "FAST",
  "SMOOTH",
  "BOUNCE",
  "AI",
  "SHIP IT",
];

export function StickerPack() {
  return (
    <div className="pointer-events-auto fixed left-4 top-1/2 z-40 -translate-y-1/2">
      <p className="mb-2 font-[family-name:var(--font-hand)] text-[18px] text-[#111]/65">
        stickers
      </p>
      <div className="flex flex-col gap-2">
        {STICKERS.map((label) => (
          <div
            key={label}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("sticker", label);
              e.dataTransfer.effectAllowed = "copy";
            }}
            className="cursor-grab rounded-sm border-2 border-[#111] bg-[#F7ED99] px-2.5 py-1.5 font-[family-name:var(--font-hand)] text-[16px] shadow-[2px_2px_0_#111] active:cursor-grabbing"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
