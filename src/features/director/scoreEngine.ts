import type { CaptionBlock, TranscriptResult } from "@/src/types/transcript";
import type {
  DirectorCategoryResult,
  DirectorMetrics,
  DirectorScoreBreakdown,
} from "./types";

function clampScore(value: number) {
  return Math.max(0, Math.min(Math.round(value), 100));
}

function getAverageCaptionLength(captionBlocks: CaptionBlock[]) {
  if (!captionBlocks.length) {
    return 0;
  }

  return (
    captionBlocks.reduce((total, block) => total + block.words.length, 0) /
    captionBlocks.length
  );
}

function getAverageCaptionDuration(captionBlocks: CaptionBlock[]) {
  if (!captionBlocks.length) {
    return 0;
  }

  return (
    captionBlocks.reduce(
      (total, block) => total + Math.max(block.end - block.start, 0),
      0,
    ) / captionBlocks.length
  );
}

function getShortestCaptionDuration(captionBlocks: CaptionBlock[]) {
  if (!captionBlocks.length) {
    return 0;
  }

  return Math.min(
    ...captionBlocks.map((block) => Math.max(block.end - block.start, 0)),
  );
}

export function getDirectorMetrics(
  transcript: TranscriptResult | null,
  captionBlocks: CaptionBlock[],
): DirectorMetrics {
  const duration = transcript?.duration ?? 0;
  const transcriptWords = transcript?.words.length ?? 0;

  return {
    averageCaptionDuration: getAverageCaptionDuration(captionBlocks),
    averageCaptionLength: getAverageCaptionLength(captionBlocks),
    captionCount: captionBlocks.length,
    firstCaptionWords: captionBlocks[0]?.words.length ?? 0,
    longestCaptionWords: Math.max(
      0,
      ...captionBlocks.map((block) => block.words.length),
    ),
    shortestCaptionDuration: getShortestCaptionDuration(captionBlocks),
    transcriptWords,
    wordsPerMinute: duration ? Math.round(transcriptWords / (duration / 60)) : 0,
  };
}

export function calculateDirectorScores(
  categories: DirectorCategoryResult[],
): DirectorScoreBreakdown {
  const scoreFor = (categoryName: DirectorCategoryResult["category"]) =>
    categories.find((category) => category.category === categoryName)?.score ??
    0;
  const hook = scoreFor("Hook");
  const readability = scoreFor("Readability");
  const pacing = scoreFor("Pacing");
  const captions = scoreFor("Captions");
  const cta = scoreFor("CTA");
  const accessibility = scoreFor("Accessibility");
  const overall = clampScore(
    hook * 0.18 +
      readability * 0.2 +
      pacing * 0.18 +
      captions * 0.18 +
      cta * 0.12 +
      accessibility * 0.14,
  );

  return {
    accessibility,
    caption: captions,
    captions,
    cta,
    hook,
    overall,
    pacing,
    readability,
  };
}
