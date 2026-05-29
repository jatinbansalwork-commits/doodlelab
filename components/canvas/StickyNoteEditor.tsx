"use client";

import {
  intensityLabel,
  objectConfig,
  speedLabel,
  speedToDuration,
  intensityToConfig,
} from "@/lib/canvas-math";
import { ANIM_STYLE_LABEL } from "@/lib/item-motion";
import { useDoodleStore } from "@/store/doodle-store";

export function StickyNoteEditor() {
  const selectedId = useDoodleStore((s) => s.selectedId);
  const editPanelOpen = useDoodleStore((s) => s.editPanelOpen);
  const setEditPanelOpen = useDoodleStore((s) => s.setEditPanelOpen);
  const items = useDoodleStore((s) => s.items);
  const updateObject = useDoodleStore((s) => s.updateObject);

  const obj = items.find(
    (i): i is Extract<typeof i, { kind: "object" }> =>
      i.id === selectedId && i.kind === "object",
  );

  if (!obj || !editPanelOpen) return null;

  const cfg = objectConfig(obj);

  return (
    <div
      className="pointer-events-auto absolute z-30 w-52 border-2 border-[#111] bg-[#F7ED99] p-3 shadow-[3px_4px_0_#11111130]"
      style={{
        left: obj.x + 70,
        top: obj.y - 10,
        transform: "rotate(2deg)",
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-[family-name:var(--font-hand)] text-[20px] leading-none text-[#111]">
          {ANIM_STYLE_LABEL[obj.playStyle ?? "float"]} ✎
        </p>
        <button
          type="button"
          onClick={() => setEditPanelOpen(false)}
          className="font-[family-name:var(--font-hand)] text-[16px] text-[#111]/70 hover:text-[#111]"
        >
          done
        </button>
      </div>
      <div className="space-y-3 font-[family-name:var(--font-hand)] text-[16px] text-[#111]">
        <label className="block">
          <span className="text-[15px]">Speed — {speedLabel(obj.speed)}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={obj.speed}
            className="mt-1 w-full accent-accent"
            onInput={(e) => {
              const speed = parseFloat(e.currentTarget.value);
              updateObject(obj.id, {
                speed,
                config: { ...obj.config, duration: speedToDuration(speed) },
              });
            }}
          />
          <span className="flex justify-between text-[15px] text-[#111]/70">
            <span>Slow</span>
            <span>Fast</span>
          </span>
        </label>
        <label className="block">
          <span className="text-[15px]">Intensity — {intensityLabel(obj.intensity)}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={obj.intensity}
            className="mt-1 w-full accent-accent"
            onInput={(e) => {
              const intensity = parseFloat(e.currentTarget.value);
              updateObject(obj.id, {
                intensity,
                config: intensityToConfig(intensity, obj.config),
              });
            }}
          />
          <span className="flex justify-between text-[15px] text-[#111]/70">
            <span>Gentle</span>
            <span>Extreme</span>
          </span>
        </label>
        <label className="block">
          <span className="text-[15px]">Delay — {cfg.delay.toFixed(1)}s</span>
          <input
            type="range"
            min={0}
            max={100}
            value={cfg.delay * 100}
            className="mt-1 w-full accent-accent"
            onInput={(e) =>
              updateObject(obj.id, {
                config: {
                  ...obj.config,
                  delay: parseFloat(e.currentTarget.value) / 100,
                },
              })
            }
          />
        </label>
      </div>
    </div>
  );
}
