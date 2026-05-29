import type { ExportFormat, MotionConfig } from "@/types/motion";
import { generateCssCode } from "./css";
import { generateFramerMotionCode } from "./framer-motion";
import { generateReactTailwindCode } from "./react-tailwind";

export function generateExportCode(
  format: ExportFormat,
  config: MotionConfig,
): string {
  switch (format) {
    case "react":
      return generateReactTailwindCode(config);
    case "framer":
      return generateFramerMotionCode(config);
    case "css":
      return generateCssCode(config);
  }
}
