import type { ExportSettings } from "@/src/features/export/types";
import type { CaptionStyle } from "@/src/features/style/types";
import type { CaptionBlock } from "@/src/types/transcript";

export type RenderJobStatus =
  | "idle"
  | "preparing"
  | "rendering"
  | "encoding"
  | "complete"
  | "failed";

export type RenderPhase = "Preparing" | "Rendering" | "Encoding" | "Finished";

export type RenderJob = {
  id: string;
  status: RenderJobStatus;
  phase: RenderPhase;
  progress: number;
  outputFormat: ExportSettings["outputFormat"];
  platform: ExportSettings["platform"];
  createdAt: string;
  estimatedDuration: number;
  error: string | null;
  downloadUrl?: string;
  outputPath?: string;
};

export type RenderVideoMetadata = {
  filename: string;
  filesize: string;
  duration: string;
  durationSeconds: number;
  width: number;
  height: number;
  aspectRatio: string;
  orientation: string;
  fps: string;
  codec: string;
};

export type RemotionRenderSettings = {
  exportSettings: ExportSettings;
  outputWidth: number;
  outputHeight: number;
  fps: number;
  safeZonePadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export type SidekikRenderCompositionProps = {
  videoUrl: string;
  captionBlocks: CaptionBlock[];
  captionStyle: CaptionStyle;
  renderSettings: RemotionRenderSettings;
  videoMetadata: RenderVideoMetadata;
  appliedHighlightWordIds: string[];
};

export type RenderPreparationInput = {
  captionBlocks: CaptionBlock[];
  selectedCaptionStyle: CaptionStyle | null;
  exportSettings: ExportSettings;
  videoDuration: number;
  videoFile: File | null;
  videoMetadata: RenderVideoMetadata | null;
  appliedHighlightWordIds: string[];
};

export type RenderPreparation = Omit<
  SidekikRenderCompositionProps,
  "videoUrl"
> & {
  platformPreset: ExportSettings["platform"];
};

export type RenderApiSuccess = {
  job: RenderJob;
  downloadUrl: string;
  outputPath: string;
};

export type RenderApiError = {
  error: string;
};
