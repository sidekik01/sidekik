import type { CaptionBlock, TranscriptResult } from "@/src/types/transcript";
import type { DirectorScoreBreakdown } from "./types";

function clampScore(value: number) {
  return Math.max(0, Math.min(Math.round(value), 100));
}

function getWordsPerMinute(transcript: TranscriptResult | null) {
  if (!transcript?.duration) {
    return 0;
  }

  return Math.round(transcript.words.length / (transcript.duration / 60));
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

export function getDirectorMetrics(
  transcript: TranscriptResult | null,
  captionBlocks: CaptionBlock[],
) {
  return {
    averageCaptionDuration: getAverageCaptionDuration(captionBlocks),
    averageCaptionLength: getAverageCaptionLength(captionBlocks),
    captionCount: captionBlocks.length,
    firstCaptionWords: captionBlocks[0]?.words.length ?? 0,
    wordsPerMinute: getWordsPerMinute(transcript),
  };
}

export function calculateCreativeScores(
  transcript: TranscriptResult | null,
  captionBlocks: CaptionBlock[],
): DirectorScoreBreakdown {
  const metrics = getDirectorMetrics(transcript, captionBlocks);
  const hook = clampScore(88 - Math.max(metrics.firstCaptionWords - 5, 0) * 8);
  const readability = clampScore(
    96 - Math.max(metrics.averageCaptionLength - 4.5, 0) * 12,
  );
  const pacing = clampScore(
    92 - Math.max(metrics.wordsPerMinute - 165, 0) * 0.8,
  );
  const caption = clampScore(
    94 -
      Math.max(metrics.averageCaptionDuration - 2.4, 0) * 16 -
      Math.max(0.7 - metrics.averageCaptionDuration, 0) * 14,
  );
  const cta = 58;
  const accessibility = caption;
  const overall = clampScore(
    hook * 0.2 +
      readability * 0.24 +
      pacing * 0.22 +
      caption * 0.22 +
      cta * 0.12,
  );

  return {
    accessibility,
    caption,
    captions: caption,
    cta,
    hook,
    overall,
    pacing,
    readability,
  };
}
