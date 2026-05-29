import { create } from "zustand";
import { pickRandom, CHARACTER_TYPES, STICKER_LABELS } from "@/lib/board-actions";
import { ANIM_STYLE_CYCLE, ANIM_STYLE_LABEL } from "@/lib/item-motion";
import {
  isSoundMuted,
  playAddCharacter,
  playAddSticker,
  playClick,
  playExport,
  playRemix,
  playSelect,
  playSuccess,
  playHover,
  setSoundMuted,
} from "@/lib/sounds/doodle-sounds";
import {
  DELETE_ANIM_MS,
  REMIX_STAGGER_MS,
  type MicroAction,
  type StageMicroAction,
} from "@/lib/micro-interactions";
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
import type { BuddyMood, BuddyTrigger } from "@/lib/doodle-buddy/messages";
import { buildBuddyCue } from "@/lib/doodle-buddy/react";
import type { AppPhase, DoodleConcept, ExportFormat } from "@/types/doodle-app";

let idCounter = 0;
const nextId = () => `c-${++idCounter}-${Date.now()}`;
let buddyDismissTimer: number | undefined;
let lastDragBuddyAt = 0;

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
  visualPulse: Record<string, { seq: number; action: MicroAction }>;
  stageMoment: { seq: number; action: StageMicroAction } | null;
  buddyCue: { text: string; mood: BuddyMood; seq: number } | null;
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
  bumpVisualPulse: (ids: string[], action?: MicroAction) => void;
  triggerStageMoment: (action: StageMicroAction) => void;
  buddyReact: (trigger: BuddyTrigger) => void;
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
  stageMoment: null,
  buddyCue: null,
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
    if (!next) playHover();
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
    playSuccess();
    get().buddyReact("boardReady");
  },

  buddyReact: (trigger) => {
    if (!get().boardReady || get().isGeneratingBoard) return;
    if (trigger === "dragDrop") {
      const now = Date.now();
      if (now - lastDragBuddyAt < 6000) return;
      lastDragBuddyAt = now;
    }
    const cue = buildBuddyCue(trigger);
    set({ buddyCue: cue });
    if (typeof window === "undefined") return;
    if (buddyDismissTimer) clearTimeout(buddyDismissTimer);
    buddyDismissTimer = window.setTimeout(() => {
      set((s) => (s.buddyCue?.seq === cue.seq ? { buddyCue: null } : {}));
    }, 2600);
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

  bumpVisualPulse: (ids, action = "default") =>
    set((s) => {
      const next = { ...s.visualPulse };
      const seq = Date.now();
      for (const id of ids) next[id] = { seq, action };
      return { visualPulse: next };
    }),

  triggerStageMoment: (action) => {
    if (typeof window === "undefined") return;
    const seq = Date.now();
    set({ stageMoment: { action, seq } });
    window.setTimeout(() => {
      set((s) => (s.stageMoment?.seq === seq ? { stageMoment: null } : {}));
    }, 580);
  },

  remixBoard: () => {
    const concept = get().selectedConcept;
    if (!concept || !get().boardReady) return;
    playRemix();
    get().triggerStageMoment("remix");
    const blueprint = remixSceneBlueprint(concept, get().prompt);
    const { items, arrows } = buildSceneFromBlueprint(blueprint, concept);
    const ids = items.map((i) => i.id);
    set({ items, arrows, selectedId: null, editPanelOpen: false, activePanel: null, boardFeedback: null });
    get().fitSceneToView();
    get().buddyReact("remix");
    if (typeof window !== "undefined") {
      ids.forEach((id, i) => {
        window.setTimeout(() => get().bumpVisualPulse([id], "remix"), i * REMIX_STAGGER_MS);
      });
    }
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
    playAddCharacter();
    get().bumpVisualPulse([newObj.id], "addCharacter");
    get().buddyReact("addCharacter");
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
      playAddSticker();
      get().bumpVisualPulse([added.id], "addSticker");
      get().buddyReact("addSticker");
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
      boardFeedback: null,
    }));
    get().bumpVisualPulse(targets.map((t) => t.id), "default");
    playClick();
    get().buddyReact("animate");
  },

  surpriseBoard: () => {
    const concept = get().selectedConcept;
    if (!concept || !get().boardReady || typeof window === "undefined") return;
    playSuccess();

    const roll = Math.random();
    const objects = get().items.filter((i): i is CanvasObject => i.kind === "object");

    const surpriseAnimateRandom = () => {
      if (!objects.length) {
        get().animateSelection();
        get().buddyReact("surprise");
        return;
      }
      const target = pickRandom(objects);
      const playStyle = pickRandom(ANIM_STYLE_CYCLE);
      get().updateObject(target.id, {
        playStyle,
        speed: Math.min(100, target.speed + 20),
        intensity: Math.min(100, target.intensity + 18),
      });
      set({ selectedId: target.id });
      get().bumpVisualPulse([target.id], "default");
      playClick();
      get().buddyReact("animate");
    };

    if (roll < 0.22) {
      get().addCharacterOfType(pickRandom(CHARACTER_TYPES));
      get().buddyReact("surprise");
      return;
    }
    if (roll < 0.42) {
      get().addStickerToBoard(pickRandom(STICKER_LABELS));
      return;
    }
    if (roll < 0.55) {
      surpriseAnimateRandom();
      return;
    }
    if (roll < 0.68) {
      get().addStickerToBoard(pickRandom(STICKER_LABELS));
      surpriseAnimateRandom();
      return;
    }
    if (roll < 0.82) {
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
        text: pickRandom(["surprise!", "yay!", "nice!"]),
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
        boardFeedback: null,
      });
      get().bumpVisualPulse([note.id], "addSticker");
      get().buddyReact("surprise");
      return;
    }
    get().animateSelection();
    get().buddyReact("surprise");
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
    playClick();
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
      stageMoment: null,
      buddyCue: null,
      prompt: "",
    }),

  setPan: (panX, panY) => set({ panX, panY }),
  setZoom: (zoom) => set({ zoom: Math.min(2, Math.max(0.45, zoom)) }),
  select: (selectedId) => {
    if (selectedId) playSelect();
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
    if (!get().items.some((i) => i.id === id)) return;
    playClick();
    get().bumpVisualPulse([id], "delete");
    get().buddyReact("delete");
    if (typeof window === "undefined") return;
    window.setTimeout(() => {
      set((s) => ({
        items: s.items.filter((i) => i.id !== id),
        arrows: s.arrows.filter((a) => a.fromId !== id && a.toId !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
        editPanelOpen: s.selectedId === id ? false : s.editPanelOpen,
        activePanel:
          s.activePanel === "replace" && s.selectedId === id ? null : s.activePanel,
        visualPulse: Object.fromEntries(
          Object.entries(s.visualPulse).filter(([key]) => key !== id),
        ),
      }));
    }, DELETE_ANIM_MS);
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
    if (exportOpen) {
      playExport();
      get().triggerStageMoment("export");
      const ids = get().items.map((i) => i.id);
      get().bumpVisualPulse(ids, "export");
      get().buddyReact("export");
    }
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
