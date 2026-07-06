import type { CaptionBlock, TranscriptWord } from "@/src/types/transcript";

export function getActiveCaptionBlock(
  captionBlocks: CaptionBlock[],
  currentTime: number,
) {
  return (
    captionBlocks.find(
      (captionBlock) =>
        currentTime >= captionBlock.start && currentTime <= captionBlock.end,
    ) ?? null
  );
}

export function getActiveWord(words: TranscriptWord[], currentTime: number) {
  return (
    words.find((word) => currentTime >= word.start && currentTime <= word.end) ??
    null
  );
}
