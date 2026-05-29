"use client";

import { useEffect, useState } from "react";
import { ActionDock } from "./ActionDock";
import { BoardPanels } from "./BoardPanels";
import { BoardGenerating } from "./BoardGenerating";
import { BoardTopBar } from "./BoardTopBar";
import { ContextToolbar } from "./ContextToolbar";
import { MotionCanvas } from "./MotionCanvas";
import { useDoodleStore } from "@/store/doodle-store";

export function CanvasView() {
  const boardReady = useDoodleStore((s) => s.boardReady);
  const isGeneratingBoard = useDoodleStore((s) => s.isGeneratingBoard);
  const items = useDoodleStore((s) => s.items);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (boardReady && items.length > 0) {
      const t = window.setTimeout(() => setShowControls(true), 650);
      return () => window.clearTimeout(t);
    }
    setShowControls(false);
  }, [boardReady, items.length]);

  const showEditing = showControls && boardReady && items.length > 0 && !isGeneratingBoard;

  return (
    <div className="fixed inset-0">
      <BoardTopBar showActions={showEditing} />
      <BoardGenerating />
      <MotionCanvas />
      {showEditing ? (
        <>
          <ActionDock />
          <BoardPanels />
          <ContextToolbar />
        </>
      ) : null}
    </div>
  );
}
