import type { CaptionProject } from "@/src/features/caption-engine/types";
import type { Project } from "@/src/types/project";
import type { TranscriptResult } from "@/src/types/transcript";

export type SidekikVideoAnalysis = {
  hasProject: boolean;
  hasTranscript: boolean;
  hasCaptions: boolean;
  durationSeconds: number;
  wordCount: number;
  captionCount: number;
  averageCaptionLength: number;
  averageCaptionDuration: number;
  wordsPerMinute: number;
  orientation: string;
  resolution: string;
};

function parseDuration(duration: string | undefined) {
  if (!duration) {
    return 0;
  }

  const normalized = duration.replace("s", "").trim();
  const value = Number(normalized);

  return Number.isFinite(value) ? value : 0;
}

export function analyzeVideo({
  captionProject,
  project,
  transcript,
}: {
  captionProject: CaptionProject | null;
  project: Project | null;
  transcript: TranscriptResult | null;
}): SidekikVideoAnalysis {
  const captionBlocks = captionProject?.captionBlocks ?? [];
  const durationSeconds =
    transcript?.duration ?? captionProject?.transcript.duration ?? parseDuration(project?.duration);
  const wordCount =
    transcript?.words.length ?? captionProject?.transcript.words.length ?? 0;
  const captionCount = captionBlocks.length;
  const averageCaptionLength = captionCount
    ? captionBlocks.reduce((total, block) => total + block.words.length, 0) /
      captionCount
    : 0;
  const averageCaptionDuration = captionCount
    ? captionBlocks.reduce(
        (total, block) => total + Math.max(block.end - block.start, 0),
        0,
      ) / captionCount
    : 0;

  return {
    averageCaptionDuration,
    averageCaptionLength,
    captionCount,
    durationSeconds,
    hasCaptions: captionCount > 0,
    hasProject: Boolean(project),
    hasTranscript: wordCount > 0,
    orientation: project?.orientation ?? "Unknown",
    resolution: project ? `${project.width} x ${project.height}` : "No video",
    wordCount,
    wordsPerMinute: durationSeconds
      ? Math.round(wordCount / (durationSeconds / 60))
      : 0,
  };
}
