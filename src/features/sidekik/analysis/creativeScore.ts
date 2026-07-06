import type { SidekikCreativeSettings } from "../types/types";
import type { SidekikVideoAnalysis } from "./videoAnalyzer";
import type { BrandPreset } from "@/src/features/style/types";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateSidekikCreativeScore({
  brand,
  creativeSettings,
  videoAnalysis,
}: {
  brand: BrandPreset | null;
  creativeSettings: SidekikCreativeSettings;
  videoAnalysis: SidekikVideoAnalysis;
}) {
  const hook = videoAnalysis.hasTranscript ? 72 : 0;
  const readability = clampScore(
    100 - Math.abs(videoAnalysis.averageCaptionLength - 4) * 12,
  );
  const pacing = clampScore(
    videoAnalysis.wordsPerMinute
      ? 100 - Math.abs(videoAnalysis.wordsPerMinute - 150) * 0.7
      : 0,
  );
  const captions = clampScore(
    (videoAnalysis.hasCaptions ? 70 : 0) +
      (creativeSettings.captionsEnabled ? 15 : 0) +
      (creativeSettings.activeWordHighlightEnabled ? 10 : 0),
  );
  const brandScore = brand && creativeSettings.captionStyle ? 88 : brand ? 70 : 45;
  const platform = videoAnalysis.hasProject ? 76 : 0;
  const overall = clampScore(
    hook * 0.18 +
      readability * 0.18 +
      pacing * 0.18 +
      captions * 0.2 +
      brandScore * 0.12 +
      platform * 0.14,
  );

  return {
    brand: brandScore,
    captions,
    hook,
    overall,
    pacing,
    platform,
    readability,
  };
}
