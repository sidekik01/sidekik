import { createRenderSettings } from "@/src/rendering/export/renderSettings";
import type { ExportSettings } from "@/src/features/export/types";
import type { CaptionStyle } from "@/src/features/style/types";
import type { CaptionBlock } from "@/src/types/transcript";
import type {
  RenderJob,
  RenderPreparation,
  RenderPreparationInput,
  RenderVideoMetadata,
} from "@/src/rendering/types/types";

export type {
  RenderJob,
  RenderJobStatus,
  RenderPhase,
  RenderPreparation,
  RenderPreparationInput,
  RenderVideoMetadata,
} from "@/src/rendering/types/types";

export function validateRenderPreparation({
  captionBlocks,
  selectedCaptionStyle,
  videoFile,
  videoMetadata,
}: RenderPreparationInput) {
  const errors: string[] = [];

  if (!videoFile) {
    errors.push("Video file must be re-uploaded before rendering.");
  }

  if (!videoMetadata) {
    errors.push("Video metadata must be available before rendering.");
  }

  if (!captionBlocks.length) {
    errors.push("Captions must be generated before rendering.");
  }

  if (!selectedCaptionStyle) {
    errors.push("Caption style must be selected before rendering.");
  }

  return errors;
}

export function validateMp4Render(exportSettings: ExportSettings) {
  return exportSettings.outputFormat === "MP4"
    ? null
    : "Real video rendering currently outputs MP4. Select MP4 to render.";
}

export function prepareRenderPayload(
  input: RenderPreparationInput,
): RenderPreparation {
  const errors = [
    ...validateRenderPreparation(input),
    validateMp4Render(input.exportSettings),
  ].filter((error): error is string => Boolean(error));

  if (
    errors.length ||
    !input.videoMetadata ||
    !input.selectedCaptionStyle
  ) {
    throw new Error(errors[0] ?? "Unable to prepare render payload.");
  }

  return {
    appliedHighlightWordIds: input.appliedHighlightWordIds,
    captionBlocks: input.captionBlocks,
    captionStyle: input.selectedCaptionStyle,
    platformPreset: input.exportSettings.platform,
    renderSettings: createRenderSettings(input.exportSettings),
    videoMetadata: {
      ...input.videoMetadata,
      durationSeconds: input.videoDuration || input.videoMetadata.durationSeconds,
    },
  };
}

export function createVideoMetadata({
  durationSeconds,
  project,
}: {
  durationSeconds: number;
  project: {
    aspectRatio: string;
    codec: string;
    duration: string;
    filename: string;
    filesize: string;
    fps: string;
    height: number;
    orientation: string;
    width: number;
  } | null;
}): RenderVideoMetadata | null {
  if (!project) {
    return null;
  }

  return {
    aspectRatio: project.aspectRatio,
    codec: project.codec,
    duration: project.duration,
    durationSeconds,
    filename: project.filename,
    filesize: project.filesize,
    fps: project.fps,
    height: project.height,
    orientation: project.orientation,
    width: project.width,
  };
}

export function createRenderJob({
  captionBlocks,
  exportSettings,
  videoDuration,
}: Readonly<{
  captionBlocks: CaptionBlock[];
  exportSettings: ExportSettings;
  videoDuration: number;
}>): RenderJob {
  return {
    createdAt: new Date().toISOString(),
    error: null,
    estimatedDuration: Math.max(
      Math.round(videoDuration || captionBlocks.at(-1)?.end || 0),
      1,
    ),
    id: `render-${Date.now()}`,
    outputFormat: exportSettings.outputFormat,
    phase: "Preparing",
    platform: exportSettings.platform,
    progress: 0,
    status: "preparing",
  };
}

export function createFailedRenderJob({
  error,
  exportSettings,
  videoDuration,
}: {
  error: string;
  exportSettings: ExportSettings;
  videoDuration: number;
}): RenderJob {
  return {
    createdAt: new Date().toISOString(),
    error,
    estimatedDuration: Math.max(Math.round(videoDuration), 1),
    id: `render-${Date.now()}`,
    outputFormat: exportSettings.outputFormat,
    phase: "Finished",
    platform: exportSettings.platform,
    progress: 0,
    status: "failed",
  };
}
