"use client";

import { ANIM_STYLE_LABEL } from "@/lib/item-motion";
import { playHover } from "@/lib/sounds/doodle-sounds";
import { useDoodleStore } from "@/store/doodle-store";

const ICON = "text-[23px] leading-none shrink-0";
const BTN =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 font-[family-name:var(--font-hand)] text-[18px] hover:bg-[#F7ED99]/50 active:scale-95";

function ToolbarAction({
  icon,
  label,
  onClick,
  className,
  title,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => playHover()}
      onClick={onClick}
      className={className ? `${BTN} ${className}` : BTN}
      title={title}
    >
      <span className={ICON} aria-hidden>
        {icon}
      </span>
      {label}
    </button>
  );
}

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
          <ToolbarAction icon="✏️" label="Edit" onClick={() => setEditPanelOpen(true)} />
        ) : null}
        <ToolbarAction
          icon="⚡"
          label="Animate"
          onClick={() => animateSelection()}
          title={styleHint ? `Current: ${styleHint}` : "Cycle animation style"}
        />
        {isObject ? (
          <ToolbarAction icon="🎭" label="Replace" onClick={() => openPanel("replace")} />
        ) : null}
        <ToolbarAction
          icon="🗑"
          label="Delete"
          onClick={() => deleteItem(selected.id)}
          className="hover:bg-[#FFAB91]/40"
        />
      </div>
    </div>
  );
}
