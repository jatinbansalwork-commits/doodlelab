"use client";

import type { CatEmotion } from "@/lib/cat-emotion";
import type { CanvasObjectType } from "@/types/canvas";
import type { MotionConfig } from "@/types/motion";
import { BallDoodle } from "./BallDoodle";
import { CatDoodle } from "./CatDoodle";
import { CoffeeDoodle } from "./CoffeeDoodle";
import { CloudDoodle } from "./CloudDoodle";
import { DogDoodle } from "./DogDoodle";
import { LaptopDoodle } from "./LaptopDoodle";
import { MonitorDoodle } from "./MonitorDoodle";
import { MoonDoodle } from "./MoonDoodle";
import { PlaneDoodle } from "./PlaneDoodle";
import { PlantDoodle } from "./PlantDoodle";
import { PopupDoodle } from "./PopupDoodle";
import { ZzzDoodle } from "./ZzzDoodle";
import { RocketDoodle } from "./RocketDoodle";
import { StarDoodle } from "./StarDoodle";

const MAP: Record<CanvasObjectType, React.ComponentType<{ config: MotionConfig }>> = {
  cloud: CloudDoodle,
  dog: DogDoodle,
  rocket: RocketDoodle,
  plant: PlantDoodle,
  star: StarDoodle,
  ball: BallDoodle,
  cat: CatDoodle,
  plane: PlaneDoodle,
  coffee: CoffeeDoodle,
  laptop: LaptopDoodle,
  moon: MoonDoodle,
  zzz: ZzzDoodle,
  monitor: MonitorDoodle,
  popup: PopupDoodle,
};

export function CanvasDoodle({
  type,
  config,
  catEmotion,
}: {
  type: CanvasObjectType;
  config: MotionConfig;
  catEmotion?: CatEmotion;
}) {
  if (type === "cat") {
    return <CatDoodle config={config} emotion={catEmotion ?? "happy"} />;
  }
  const D = MAP[type];
  return <D config={config} />;
}
