"use client";

import { useEffect } from "react";
import { useDoodleStore } from "@/store/doodle-store";

export function useKeyboardShortcuts() {
  const phase = useDoodleStore((s) => s.phase);
  const doodleIt = useDoodleStore((s) => s.doodleIt);
  const select = useDoodleStore((s) => s.select);
  const setExportOpen = useDoodleStore((s) => s.setExportOpen);
  const backToPrompt = useDoodleStore((s) => s.backToPrompt);
  const deleteItem = useDoodleStore((s) => s.deleteItem);
  const selectedId = useDoodleStore((s) => s.selectedId);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExportOpen(false);
        if (phase === "canvas") {
          const { editPanelOpen, setEditPanelOpen } = useDoodleStore.getState();
          if (editPanelOpen) setEditPanelOpen(false);
          else select(null);
        }
        if (phase === "concepts") backToPrompt();
      }
      if (
        phase === "canvas" &&
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedId &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        deleteItem(selectedId);
      }
      if (phase === "prompt" && e.key === "Enter" && document.activeElement?.tagName === "TEXTAREA") {
        e.preventDefault();
        void doodleIt();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, doodleIt, select, setExportOpen, backToPrompt, deleteItem, selectedId]);
}
