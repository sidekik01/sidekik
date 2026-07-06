export type ExportFormat =
  | "MP4"
  | "SRT"
  | "Transparent Captions placeholder"
  | "FCPXML placeholder";

export type ExportPlatformPreset =
  | "TikTok / Reels"
  | "YouTube Shorts"
  | "Square Social"
  | "LinkedIn"
  | "Meta Ads"
  | "Landscape YouTube";

export type ExportPreset = {
  id: string;
  platform: ExportPlatformPreset;
  aspectRatio: string;
  recommendedResolution: string;
  captionSafeZone: string;
  captionPositionRecommendation: string;
  estimatedBitrate: string;
  recommendedCaptionSize: string;
  notes: string;
  expectedOrientation: "Vertical Reel" | "Square" | "Landscape";
};

export type ExportSettings = {
  outputFormat: ExportFormat;
  platform: ExportPlatformPreset;
  presetId: string;
};
