"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CanvasItemNode } from "./CanvasItemNode";
import { StickyNoteEditor } from "./StickyNoteEditor";
import { STAGE } from "@/lib/scene-bounds";
import { useDoodleStore } from "@/store/doodle-store";

export function MotionCanvas() {
  const items = useDoodleStore((s) => s.items);
  const panX = useDoodleStore((s) => s.panX);
  const panY = useDoodleStore((s) => s.panY);
  const zoom = useDoodleStore((s) => s.zoom);
  const setPan = useDoodleStore((s) => s.setPan);
  const setZoom = useDoodleStore((s) => s.setZoom);
  const select = useDoodleStore((s) => s.select);
  const fitSceneToView = useDoodleStore((s) => s.fitSceneToView);
  const boardReady = useDoodleStore((s) => s.boardReady);
  const isGeneratingBoard = useDoodleStore((s) => s.isGeneratingBoard);

  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [cameraKey, setCameraKey] = useState(0);

  useEffect(() => {
    if (!boardReady || !items.length) return;
    fitSceneToView();
    setCameraKey((k) => k + 1);
    const t = window.setTimeout(() => fitSceneToView(), 150);
    return () => window.clearTimeout(t);
  }, [boardReady, items.length, fitSceneToView]);

  const onBgPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).dataset.canvasBg !== "true") return;
    select(null);
    setPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY, panX, panY });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onBgPointerMove = (e: React.PointerEvent) => {
    if (!panning) return;
    setPan(
      panStart.panX + e.clientX - panStart.x,
      panStart.panY + e.clientY - panStart.y,
    );
  };

  const onBgPointerUp = () => setPanning(false);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom(zoom + (e.deltaY > 0 ? -0.06 : 0.06));
      }
    },
    [zoom, setZoom],
  );

  const showStage = boardReady && !isGeneratingBoard && items.length > 0;

  const characterCount = items.filter((i) => i.kind === "object").length;
  const stickerCount = items.filter((i) => i.kind === "sticker").length;

  useEffect(() => {
    if (!boardReady) return;
    const scene = { items, panX, panY, zoom, boardReady, isGeneratingBoard };
    console.log("[MotionCanvas] canvas mounted");
    console.log("[MotionCanvas] scene data loaded", scene);
    console.log("[MotionCanvas] scene", scene);
    console.log("[MotionCanvas] doodles count", items.length);
    console.log("[MotionCanvas] character count", characterCount);
    console.log("[MotionCanvas] sticker count", stickerCount);
    console.log("[MotionCanvas] showStage", showStage);
  }, [boardReady, items, panX, panY, zoom, isGeneratingBoard, characterCount, stickerCount, showStage]);

  return (
    <div
      className="absolute inset-0 touch-none"
      style={{
        cursor: panning ? "grabbing" : "default",
        background: "#FAFAF7",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(17,17,17,0.03) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
      data-canvas-bg="true"
      onPointerDown={onBgPointerDown}
      onPointerMove={onBgPointerMove}
      onPointerUp={onBgPointerUp}
      onWheel={onWheel}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingTop: 80, paddingBottom: 112, paddingLeft: 16, paddingRight: 16 }}
        data-canvas-bg="true"
      >
        {showStage ? (
          <motion.div
            key={cameraKey}
            initial={{ scale: zoom * 0.72, opacity: 0 }}
            animate={{ scale: zoom, opacity: 1, x: panX, y: panY }}
            transition={{
              scale: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.35 },
              x: { duration: 0 },
              y: { duration: 0 },
            }}
            className="relative shrink-0 overflow-visible rounded-[32px] border-2 border-[#111]/12 bg-[#FAFAF7] shadow-[8px_10px_0_rgba(17,17,17,0.1)]"
            style={{
              width: STAGE.width,
              height: STAGE.height,
            }}
          >
            {items.map((item) => (
              <CanvasItemNode key={item.id} item={item} />
            ))}
            <StickyNoteEditor />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
