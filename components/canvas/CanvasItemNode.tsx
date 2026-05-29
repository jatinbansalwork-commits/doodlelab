"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CanvasDoodle } from "@/components/doodles/CanvasDoodle";
import { burstForItem, liveObjectMotion, motionKeyForObject } from "@/lib/item-motion";
import { objectConfig } from "@/lib/canvas-math";
import { playDragStart, playDrop } from "@/lib/sounds/doodle-sounds";
import { cn } from "@/lib/cn";
import { useDoodleStore } from "@/store/doodle-store";
import type { CanvasItem, StickerLabel } from "@/types/canvas";

const STICKER_COLORS: Record<StickerLabel, string> = {
  WOW: "#F7ED99",
  MAGIC: "#E1BEE7",
  FAST: "#FFAB91",
  SMOOTH: "#B3E5FC",
  BOUNCE: "#C8E6C9",
  AI: "#D1C4E9",
  "SHIP IT": "#FFCCBC",
};

import { AMBIENT } from "@/lib/ambient-motion";

/** Tween + reverse — safe (spring allows max 2 keyframes). */
const IDLE_BOB = {
  animate: { y: -3 },
  transition: {
    duration: 1.4,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut" as const,
  },
};

function idleSwayRotation(base: number) {
  return {
    animate: { rotate: [base - 1.5, base + 1.5] },
    transition: AMBIENT.sway.transition,
  };
}

const DRAG_SPRING = { type: "spring" as const, stiffness: 400, damping: 28 };

export function CanvasItemNode({ item }: { item: CanvasItem }) {
  const selectedId = useDoodleStore((s) => s.selectedId);
  const select = useDoodleStore((s) => s.select);
  const moveItem = useDoodleStore((s) => s.moveItem);
  const bumpVisualPulse = useDoodleStore((s) => s.bumpVisualPulse);
  const buddyReact = useDoodleStore((s) => s.buddyReact);
  const zoom = useDoodleStore((s) => s.zoom);
  const pulseEntry = useDoodleStore((s) => s.visualPulse[item.id]);
  const pulse = pulseEntry?.seq ?? 0;
  const pulseAction = pulseEntry?.action ?? "default";

  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, itemX: 0, itemY: 0 });
  const didDrag = useRef(false);
  const dragSoundPlayed = useRef(false);

  const selected = selectedId === item.id;
  const burst = burstForItem(item, pulse > 0 ? pulseAction : "default");

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (selectedId !== item.id) select(item.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    didDrag.current = false;
    dragSoundPlayed.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      itemX: item.x,
      itemY: item.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = (e.clientX - dragStart.current.x) / zoom;
    const dy = (e.clientY - dragStart.current.y) / zoom;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      didDrag.current = true;
      if (!dragSoundPlayed.current) {
        dragSoundPlayed.current = true;
        playDragStart();
      }
    }
    moveItem(item.id, dragStart.current.itemX + dx, dragStart.current.itemY + dy);
  };

  const onPointerUp = () => {
    if (dragging && didDrag.current) {
      playDrop();
      bumpVisualPulse([item.id], "default");
      buddyReact("dragDrop");
    }
    setDragging(false);
  };

  const baseProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    className: cn(
      "absolute touch-none select-none",
      dragging ? "cursor-grabbing z-30" : "cursor-grab active:cursor-grabbing",
      selected && !dragging && "z-20",
    ),
    style: { left: item.x, top: item.y } as const,
  };

  const dragLift = dragging
    ? { y: -8, scale: 1.06, transition: DRAG_SPRING }
    : null;

  const selectionRing = selected ? (
    <div
      className="pointer-events-none absolute -inset-3 rounded-2xl border-[2.5px] border-dashed border-accent"
      style={{
        borderRadius: "24px 28px 20px 26px",
        boxShadow: "0 0 0 3px rgba(107,91,255,0.12)",
      }}
    />
  ) : null;

  const motionWrap = (children: React.ReactNode) => {
    if (pulse > 0) {
      return (
        <motion.div
          key={`${item.id}-${pulse}`}
          {...baseProps}
          animate={{ ...burst.animate, ...(dragLift ?? {}) }}
          transition={burst.transition}
        >
          {selectionRing}
          {children}
        </motion.div>
      );
    }
    if (dragging && dragLift) {
      return (
        <motion.div
          key={`${item.id}-drag`}
          {...baseProps}
          animate={dragLift}
          transition={DRAG_SPRING}
        >
          {selectionRing}
          {children}
        </motion.div>
      );
    }
    const sway = idleSwayRotation(
      item.kind === "sticker" ? item.rotation : item.kind === "note" ? item.rotation : 0,
    );
    return (
      <motion.div
        key={item.id}
        {...baseProps}
        animate={IDLE_BOB.animate}
        transition={IDLE_BOB.transition}
      >
        {selectionRing}
        <motion.div
          animate={sway.animate}
          transition={sway.transition}
          className={cn(
            "transition-transform duration-200 ease-out",
            selected && "scale-[1.04]",
          )}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  };

  if (item.kind === "note") {
    return motionWrap(
      <div
        className="max-w-[200px]"
        style={{
          transform: `rotate(${item.rotation}deg)`,
          border: "2px solid #111",
          boxShadow: dragging ? "6px 8px 0 rgba(17,17,17,0.25)" : "3px 4px 0 rgba(17,17,17,0.2)",
        }}
      >
        <div className="bg-[#F7ED99] px-4 py-3 font-[family-name:var(--font-hand)] text-[18px] leading-snug text-[#111]">
          {item.text}
        </div>
      </div>,
    );
  }

  if (item.kind === "sticker") {
    const text = item.customText ?? item.label;
    const bg = item.customText ? "#F7ED99" : STICKER_COLORS[item.label];

    return motionWrap(
      <div
        className="px-4 py-2 font-[family-name:var(--font-hand)] text-[20px] font-semibold"
        style={{
          transform: `rotate(${item.rotation}deg)`,
          background: bg,
          border: "2px solid #111",
          boxShadow: dragging ? "6px 7px 0 #111" : "3px 4px 0 #111",
        }}
      >
        {text}
      </div>,
    );
  }

  const config = objectConfig(item);
  const scale = item.scale ?? 1;
  const live = liveObjectMotion(config, item.playStyle ?? "float");
  const objectRing = selected ? (
    <div
      className="pointer-events-none absolute -inset-4 rounded-3xl border-[2.5px] border-dashed border-accent"
      style={{ borderRadius: "28px 32px 24px 30px", boxShadow: "0 0 0 2px rgba(107,91,255,0.15)" }}
    />
  ) : null;

  if (pulse > 0) {
    return (
      <motion.div
        key={`${item.id}-${pulse}-${motionKeyForObject(item)}`}
        {...baseProps}
        animate={{ ...burst.animate, ...(dragLift ?? {}) }}
        transition={burst.transition}
      >
        {objectRing}
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <CanvasDoodle key={motionKeyForObject(item)} type={item.type} config={config} />
        </div>
      </motion.div>
    );
  }

  if (dragging && dragLift) {
    return (
      <motion.div
        key={`${item.id}-drag-${motionKeyForObject(item)}`}
        {...baseProps}
        animate={dragLift}
        transition={DRAG_SPRING}
        style={{
          ...baseProps.style,
          filter: "drop-shadow(0 10px 14px rgba(17,17,17,0.22))",
        }}
      >
        {objectRing}
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <CanvasDoodle key={motionKeyForObject(item)} type={item.type} config={config} />
        </div>
      </motion.div>
    );
  }

  return (
    <div {...baseProps}>
      {objectRing}
      <motion.div
        key={motionKeyForObject(item)}
        animate={live.animate}
        transition={live.transition}
        style={{ transformOrigin: "top left" }}
        className={cn(
          "origin-top-left transition-transform duration-200 ease-out",
          selected && "scale-[1.04]",
        )}
      >
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <CanvasDoodle type={item.type} config={config} />
        </div>
      </motion.div>
    </div>
  );
}
