import { exportPresets } from "@/src/features/export/exportPresets";
import type { ExportSettings } from "@/src/features/export/types";
import type { RemotionRenderSettings } from "../types/types";

const defaultResolution = {
  height: 1920,
  width: 1080,
};

function parseResolution(resolution: string) {
  const [width, height] = resolution
    .toLowerCase()
    .split("x")
    .map((value) => Number(value.trim()));

  if (!width || !height) {
    return defaultResolution;
  }

  return { height, width };
}

function getSafeZonePadding(presetId: string) {
  if (presetId === "youtube-shorts") {
    return { bottom: 0.18, left: 0.1, right: 0.1, top: 0.08 };
  }

  if (presetId === "landscape-youtube") {
    return { bottom: 0.1, left: 0.1, right: 0.1, top: 0.08 };
  }

  if (presetId === "square-social") {
    return { bottom: 0.12, left: 0.1, right: 0.1, top: 0.1 };
  }

  return { bottom: 0.14, left: 0.1, right: 0.1, top: 0.08 };
}

export function createRenderSettings(
  exportSettings: ExportSettings,
): RemotionRenderSettings {
  const preset = exportPresets.find(
    (candidate) => candidate.id === exportSettings.presetId,
  );
  const resolution = parseResolution(
    preset?.recommendedResolution ?? "1080 x 1920",
  );

  return {
    exportSettings,
    fps: 30,
    outputHeight: resolution.height,
    outputWidth: resolution.width,
    safeZonePadding: getSafeZonePadding(exportSettings.presetId),
  };
}
