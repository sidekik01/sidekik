import type { SidekikProjectSummary } from "../types/types";
import type { SidekikVideoAnalysis } from "./videoAnalyzer";
import type { Project } from "@/src/types/project";

export function buildProjectSummary({
  project,
  videoAnalysis,
}: {
  project: Project | null;
  videoAnalysis: SidekikVideoAnalysis;
}): SidekikProjectSummary {
  return {
    aspectRatio: project?.aspectRatio ?? "Not available",
    averageCaptionLength: videoAnalysis.averageCaptionLength,
    captionCount: videoAnalysis.captionCount,
    duration: project?.duration ?? "0s",
    orientation: project?.orientation ?? "No video uploaded",
    projectName: project?.filename ?? "Untitled project",
    readingSpeed: videoAnalysis.wordsPerMinute,
    resolution: project ? `${project.width} x ${project.height}` : "Not available",
    wordCount: videoAnalysis.wordCount,
  };
}
