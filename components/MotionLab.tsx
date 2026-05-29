"use client";

import { ConceptPicker } from "@/components/concepts/ConceptPicker";
import { CanvasView } from "@/components/canvas/CanvasView";
import { ExportModal } from "@/components/export/ExportModal";
import { PromptScreen } from "@/components/prompt/PromptScreen";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useDoodleStore } from "@/store/doodle-store";

export function MotionLab() {
  const phase = useDoodleStore((s) => s.phase);
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#111]">
      {phase === "prompt" && <PromptScreen />}
      {phase === "concepts" && <ConceptPicker />}
      {phase === "canvas" && <CanvasView />}
      <ExportModal />
    </div>
  );
}
