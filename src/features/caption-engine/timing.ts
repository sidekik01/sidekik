import type { CaptionBlock } from "./types";

export function getWordDuration(start: number, end: number) {
  return Math.max(end - start, 0);
}

export function getCaptionDuration(captionBlock: CaptionBlock) {
  return getWordDuration(captionBlock.start, captionBlock.end);
}

export function getAverageCaptionDuration(captionBlocks: CaptionBlock[]) {
  if (!captionBlocks.length) {
    return 0;
  }

  const totalDuration = captionBlocks.reduce(
    (total, captionBlock) => total + getCaptionDuration(captionBlock),
    0,
  );

  return totalDuration / captionBlocks.length;
}

export function getAverageCaptionLength(captionBlocks: CaptionBlock[]) {
  if (!captionBlocks.length) {
    return 0;
  }

  const totalWords = captionBlocks.reduce(
    (total, captionBlock) => total + captionBlock.words.length,
    0,
  );

  return totalWords / captionBlocks.length;
}

export function getLongestCaption(captionBlocks: CaptionBlock[]) {
  return captionBlocks.reduce<CaptionBlock | null>((longest, captionBlock) => {
    if (!longest || captionBlock.words.length > longest.words.length) {
      return captionBlock;
    }

    return longest;
  }, null);
}

export function getShortestCaption(captionBlocks: CaptionBlock[]) {
  return captionBlocks.reduce<CaptionBlock | null>((shortest, captionBlock) => {
    if (!shortest || captionBlock.words.length < shortest.words.length) {
      return captionBlock;
    }

    return shortest;
  }, null);
}

export function countSentences(transcriptText: string) {
  const sentenceMatches = transcriptText.match(/[^.!?]+[.!?]+/g);

  if (sentenceMatches?.length) {
    return sentenceMatches.length;
  }

  return transcriptText.trim() ? 1 : 0;
}
