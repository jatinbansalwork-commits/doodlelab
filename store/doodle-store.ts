import { create } from "zustand";
import { pickRandom, CHARACTER_TYPES } from "@/lib/board-actions";
import { ANIM_STYLE_CYCLE, ANIM_STYLE_LABEL } from "@/lib/item-motion";
import { SURPRISE_MESSAGES } from "@/lib/replace-options";
import { playDoodleSound, setSoundMuted, isSoundMuted } from "@/lib/sounds/doodle-sounds";
import type { PlayAnimStyle } from "@/types/canvas";
import { buildSceneFromBlueprint, buildSceneFromConcept } from "@/lib/build-scene";
import { generateConcepts } from "@/lib/generate-concepts";
import { remixSceneBlueprint } from "@/lib/remix-scene";
import { clampToStage } from "@/lib/stage-clamp";
import { computeStageScale, viewportCenterToCanvas } from "@/lib/scene-bounds";
import {
  intensityToConfig,
  speedToDuration,
} from "@/lib/canvas-math";
import { generateExportCode } from "@/lib/code-export";
import { exportSceneSvg } from "@/lib/export-svg";
import type {
  CanvasArrow,
  CanvasItem,
  CanvasObject,
  StickerLabel,
} from "@/types/canvas";
import type { AppPhase, DoodleConcept, ExportFormat } from "@/types/doodle-app";

let idCounter = 0;
const nextId = () => `c-${++idCounter}-${Date.now()}`;

interface DoodleState {
  phase: AppPhase;
  prompt: string;
  isGenerating: boolean;
  concepts: DoodleConcept[];
  pickedConceptId: string | null;
  selectedConcept: DoodleConcept | null;

  items: CanvasItem[];
  arrows: CanvasArrow[];
  selectedId: string | null;
  panX: number;
  panY: number;
  zoom: number;

  exportOpen: boolean;
  exportFormat: ExportFormat;
  copyToast: boolean;
  editPanelOpen: boolean;
  boardFeedback: string | null;
  isGeneratingBoard: boolean;
  boardReady: boolean;
  activePanel: null | "character" | "sticker" | "replace";
  visualPulse: Record<string, number>;
  soundMuted: boolean;

  setPrompt: (p: string) => void;
  doodleIt: () => Promise<void>;
  pickConcept: (id: string) => void;
  openBoard: () => Promise<void>;
  backToPrompt: () => void;

  setPan: (x: number, y: number) => void;
  setZoom: (z: number) => void;
  select: (id: string | null) => void;
  moveItem: (id: string, x: number, y: number) => void;
  updateObject: (
    id: string,
    patch: Partial<Pick<CanvasObject, "speed" | "intensity" | "config" | "playStyle">>,
  ) => void;
  addSticker: (label: StickerLabel, x: number, y: number, customText?: string) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => void;

  fitSceneToView: () => void;
  setEditPanelOpen: (open: boolean) => void;
  setBoardFeedback: (message: string | null) => void;
  openPanel: (panel: "character" | "sticker" | "replace") => void;
  closePanel: () => void;
  bumpVisualPulse: (ids: string[]) => void;
  remixBoard: () => void;
  addCharacterOfType: (type: import("@/types/canvas").CanvasObjectType) => void;
  addStickerToBoard: (label?: StickerLabel, customText?: string) => void;
  animateSelection: () => void;
  surpriseBoard: () => void;
  replaceObjectWith: (id: string, type: import("@/types/canvas").CanvasObjectType) => void;
  setSoundMuted: (muted: boolean) => void;
  toggleSoundMuted: () => void;

  setExportOpen: (open: boolean) => void;
  setExportFormat: (f: ExportFormat) => void;
  getExportContent: () => string;
  showCopyToast: () => void;
}

export const useDoodleStore = create<DoodleState>((set, get) => ({
  phase: "prompt",
  prompt: "",
  isGenerating: false,
  concepts: [],
  pickedConceptId: null,
  selectedConcept: null,

  items: [],
  arrows: [],
  selectedId: null,
  panX: typeof window !== "undefined" ? window.innerWidth / 2 - 500 : 0,
  panY: typeof window !== "undefined" ? window.innerHeight / 2 - 400 : 0,
  zoom: 1,

  exportOpen: false,
  exportFormat: "react",
  copyToast: false,
  editPanelOpen: false,
  boardFeedback: null,
  isGeneratingBoard: false,
  boardReady: false,
  activePanel: null,
  visualPulse: {},
  soundMuted: typeof window !== "undefined" ? isSoundMuted() : false,

  setPrompt: (prompt) => set({ prompt }),

  setSoundMuted: (muted) => {
    setSoundMuted(muted);
    set({ soundMuted: muted });
  },

  toggleSoundMuted: () => {
    const next = !get().soundMuted;
    setSoundMuted(next);
    set({ soundMuted: next });
    if (!next) playDoodleSound("hover");
  },

  doodleIt: async () => {
    const { prompt } = get();
    if (!prompt.trim()) return;
    set({ isGenerating: true, phase: "prompt" });
    await new Promise((r) => setTimeout(r, 700));
    const concepts = generateConcepts(prompt);
    set({ concepts, isGenerating: false, phase: "concepts", pickedConceptId: null });
  },

  pickConcept: (id) => {
    if (!get().concepts.some((c) => c.id === id)) return;
    set({ pickedConceptId: id });
  },

  openBoard: async () => {
    const { pickedConceptId, concepts } = get();
    const concept = concepts.find((c) => c.id === pickedConceptId);
    if (!concept) return;

    set({
      selectedConcept: concept,
      phase: "canvas",
      isGeneratingBoard: true,
      boardReady: false,
      items: [],
      arrows: [],
      selectedId: null,
      editPanelOpen: false,
      boardFeedback: null,
    });

    await new Promise((r) => setTimeout(r, 1500));

    const { prompt } = get();
    const { items, arrows } = buildSceneFromConcept(concept, prompt);
    const hero = items.find((i): i is CanvasObject => i.kind === "object");
    const zoom =
      typeof window !== "undefined"
        ? computeStageScale(window.innerWidth, window.innerHeight)
        : 1.2;

    set({
      items,
      arrows,
      selectedId: null,
      panX: 0,
      panY: 0,
      zoom,
    });

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    get().fitSceneToView();

    set({
      isGeneratingBoard: false,
      boardReady: true,
      boardFeedback: null,
    });
    playDoodleSound("sceneReady");
  },

  fitSceneToView: () => {
    if (typeof window === "undefined") return;
    const { items } = get();
    if (!items.length) return;
    const zoom = computeStageScale(window.innerWidth, window.innerHeight);
    set({ panX: 0, panY: 0, zoom });
  },

  setEditPanelOpen: (editPanelOpen) => set({ editPanelOpen }),
  setBoardFeedback: (boardFeedback) => set({ boardFeedback }),

  openPanel: (activePanel) => set({ activePanel }),
  closePanel: () => set({ activePanel: null }),

  bumpVisualPulse: (ids) =>
    set((s) => {
      const next = { ...s.visualPulse };
      const tick = Date.now();
      for (const id of ids) next[id] = tick;
      return { visualPulse: next };
    }),

  remixBoard: () => {
    const concept = get().selectedConcept;
    if (!concept || !get().boardReady) return;
    const blueprint = remixSceneBlueprint(concept, get().prompt);
    const { items, arrows } = buildSceneFromBlueprint(blueprint, concept);
    const ids = items.map((i) => i.id);
    set({ items, arrows, selectedId: null, editPanelOpen: false, activePanel: null });
    get().fitSceneToView();
    get().bumpVisualPulse(ids);
    playDoodleSound("remix");
    set({ boardFeedback: "Whoa — new version!" });
    setTimeout(() => set({ boardFeedback: null }), 2400);
  },

  addCharacterOfType: (type) => {
    const concept = get().selectedConcept;
    if (!concept || !get().boardReady) return;
    const { items, panX, panY, zoom } = get();
    const center =
      typeof window !== "undefined"
        ? viewportCenterToCanvas(panX, panY, zoom, window.innerWidth, window.innerHeight)
        : { x: 360, y: 248 };
    const baseConfig = intensityToConfig(concept.intensity, {
      ...concept.config,
      duration: speedToDuration(concept.speed),
    });
    const newObj: CanvasObject = {
      id: nextId(),
      kind: "object",
      type,
      x: center.x - 40,
      y: center.y - 30,
      scale: 1.1,
      config: baseConfig,
      speed: concept.speed,
      intensity: concept.intensity,
      playStyle: "bounce",
    };
    const clamped = clampToStage(newObj, newObj.x, newObj.y);
    newObj.x = clamped.x;
    newObj.y = clamped.y;
    set({
      items: [...items, newObj],
      selectedId: newObj.id,
      activePanel: null,
    });
    get().bumpVisualPulse([newObj.id]);
    playDoodleSound("character");
  },

  addStickerToBoard: (label, customText) => {
    if (!get().boardReady) return;
    const { panX, panY, zoom } = get();
    const center =
      typeof window !== "undefined"
        ? viewportCenterToCanvas(panX, panY, zoom, window.innerWidth, window.innerHeight)
        : { x: 360, y: 248 };
    const stickerLabel = label ?? "WOW";
    get().addSticker(
      stickerLabel,
      center.x + (Math.random() - 0.5) * 60,
      center.y + (Math.random() - 0.5) * 40,
      customText,
    );
    const added = get().items[get().items.length - 1];
    if (added) {
      get().bumpVisualPulse([added.id]);
      playDoodleSound("sticker");
    }
    set({ selectedId: added?.id ?? null, activePanel: null });
  },

  animateSelection: () => {
    if (!get().boardReady) return;
    const { selectedId, items } = get();
    const targets = selectedId ? items.filter((i) => i.id === selectedId) : items;
    if (!targets.length) return;

    const objectTargets = targets.filter((i): i is CanvasObject => i.kind === "object");

    const nextStyleFor = (current?: PlayAnimStyle): PlayAnimStyle => {
      const i = ANIM_STYLE_CYCLE.indexOf(current ?? "float");
      return ANIM_STYLE_CYCLE[(i + 1) % ANIM_STYLE_CYCLE.length]!;
    };

    let feedbackStyle: PlayAnimStyle = "bounce";

    const stickerOrNote = targets.filter((t) => t.kind !== "object");

    set((s) => ({
      items: s.items.map((item) => {
        if (item.kind !== "object" || !objectTargets.some((t) => t.id === item.id)) {
          return item;
        }
        const playStyle = nextStyleFor(item.playStyle);
        feedbackStyle = playStyle;
        const speed = Math.min(100, Math.max(35, item.speed));
        const intensity = Math.min(100, Math.max(40, item.intensity + 15));
        return {
          ...item,
          playStyle,
          speed,
          intensity,
          config: intensityToConfig(intensity, {
            ...item.config,
            duration: speedToDuration(speed),
            distance: 12 + (intensity / 100) * 56,
          }),
        };
      }),
      boardFeedback: objectTargets.length
        ? `${ANIM_STYLE_LABEL[feedbackStyle]} mode!`
        : "✨ More wiggle!",
    }));
    get().bumpVisualPulse(targets.map((t) => t.id));
    if (stickerOrNote.length && !objectTargets.length) {
      set({ boardFeedback: "✨ Wiggle!" });
    }
    playDoodleSound("animate");
    setTimeout(() => set({ boardFeedback: null }), 1800);
  },

  surpriseBoard: () => {
    const concept = get().selectedConcept;
    if (!concept || !get().boardReady || typeof window === "undefined") return;
    playDoodleSound("surprise");
    const msg = pickRandom(SURPRISE_MESSAGES);
    const roll = Math.random();
    if (roll < 0.3) {
      get().addCharacterOfType(pickRandom(CHARACTER_TYPES));
      set({ boardFeedback: msg });
      setTimeout(() => set({ boardFeedback: null }), 2200);
      return;
    }
    if (roll < 0.55) {
      get().addStickerToBoard();
      set({ boardFeedback: msg });
      setTimeout(() => set({ boardFeedback: null }), 2200);
      return;
    }
    if (roll < 0.75) {
      const { items, panX, panY, zoom } = get();
      const center = viewportCenterToCanvas(
        panX,
        panY,
        zoom,
        window.innerWidth,
        window.innerHeight,
      );
      const note = {
        id: nextId(),
        kind: "note" as const,
        text: pickRandom(["surprise!", "yay!", "woohoo!", "nice!"]),
        x: center.x + (Math.random() - 0.5) * 60,
        y: center.y + (Math.random() - 0.5) * 40,
        rotation: (Math.random() - 0.5) * 12,
      };
      const clamped = clampToStage(note, note.x, note.y);
      note.x = clamped.x;
      note.y = clamped.y;
      set({
        items: [...items, note],
        selectedId: note.id,
        boardFeedback: msg,
      });
      get().bumpVisualPulse([note.id]);
      setTimeout(() => set({ boardFeedback: null }), 2200);
      return;
    }
    get().animateSelection();
    set({ boardFeedback: msg });
    setTimeout(() => set({ boardFeedback: null }), 2200);
  },

  replaceObjectWith: (id, type) => {
    const item = get().items.find((i): i is CanvasObject => i.id === id && i.kind === "object");
    if (!item || item.type === type) {
      get().closePanel();
      return;
    }
    set((s) => ({
      items: s.items.map((i) =>
        i.id === id && i.kind === "object"
          ? { ...i, type, playStyle: "pulse" as PlayAnimStyle }
          : i,
      ),
      activePanel: null,
      selectedId: id,
    }));
    get().bumpVisualPulse([id]);
    playDoodleSound("create");
  },

  backToPrompt: () =>
    set({
      phase: "prompt",
      concepts: [],
      pickedConceptId: null,
      selectedConcept: null,
      items: [],
      arrows: [],
      selectedId: null,
      editPanelOpen: false,
      boardFeedback: null,
      isGeneratingBoard: false,
      boardReady: false,
      activePanel: null,
      visualPulse: {},
      prompt: "",
    }),

  setPan: (panX, panY) => set({ panX, panY }),
  setZoom: (zoom) => set({ zoom: Math.min(2, Math.max(0.45, zoom)) }),
  select: (selectedId) => {
    if (selectedId) playDoodleSound("select");
    set({ selectedId, editPanelOpen: false });
  },

  moveItem: (id, x, y) =>
    set((s) => ({
      items: s.items.map((item) => {
        if (item.id !== id) return item;
        const clamped = clampToStage(item, x, y);
        return { ...item, x: clamped.x, y: clamped.y };
      }),
    })),

  updateObject: (id, patch) =>
    set((s) => ({
      items: s.items.map((item) => {
        if (item.id !== id || item.kind !== "object") return item;
        const next = { ...item, ...patch };
        if (patch.speed !== undefined) {
          next.config = { ...next.config, duration: speedToDuration(patch.speed) };
        }
        if (patch.intensity !== undefined) {
          next.config = intensityToConfig(patch.intensity, {
            ...next.config,
            distance: 12 + (patch.intensity / 100) * 56,
          });
        }
        if (patch.config) {
          next.config = { ...next.config, ...patch.config };
        }
        return next;
      }),
    })),

  addSticker: (label, x, y, customText) =>
    set((s) => {
      const item: CanvasItem = {
        id: nextId(),
        kind: "sticker",
        label,
        customText,
        x,
        y,
        rotation: (Math.random() - 0.5) * 10,
      };
      const clamped = clampToStage(item, x, y);
      item.x = clamped.x;
      item.y = clamped.y;
      return { items: [...s.items, item] };
    }),

  deleteItem: (id) => {
    playDoodleSound("delete");
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      arrows: s.arrows.filter((a) => a.fromId !== id && a.toId !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
      editPanelOpen: s.selectedId === id ? false : s.editPanelOpen,
      activePanel:
        s.activePanel === "replace" && s.selectedId === id ? null : s.activePanel,
    }));
  },

  duplicateItem: (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const copy = { ...item, id: nextId(), x: item.x + 28, y: item.y + 28 };
    set((s) => ({
      items: [...s.items, copy],
      selectedId: copy.id,
    }));
  },

  setExportOpen: (exportOpen) => {
    if (exportOpen) playDoodleSound("export");
    set({ exportOpen });
  },
  setExportFormat: (exportFormat) => set({ exportFormat }),

  getExportContent: () => {
    const { exportFormat, selectedConcept, items } = get();
    const hero = items.find((i): i is CanvasObject => i.kind === "object");
    const config = hero?.config ?? selectedConcept?.config;
    if (!config) return "";

    switch (exportFormat) {
      case "svg":
        return exportSceneSvg(items);
      case "gif":
        return `<!-- Animated scene: open in browser or convert with ezgif.com -->\n${exportSceneSvg(items)}`;
      case "framer":
        return generateExportCode("framer", config);
      case "react":
      default:
        return generateExportCode("react", config);
    }
  },

  showCopyToast: () => {
    set({ copyToast: true });
    setTimeout(() => set({ copyToast: false }), 2000);
  },
}));
