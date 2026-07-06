import type { TranscriptWord } from "@/src/types/transcript";
import { getCaptionDuration } from "./timing";
import type { CaptionBlock, CaptionEngineSettings } from "./types";

export const defaultCaptionEngineSettings: CaptionEngineSettings = {
  maxCaptionDuration: 2.5,
  maxLines: 2,
  maxWordsPerCaption: 5,
  minCaptionDuration: 0.5,
  minWordsPerCaption: 3,
  preferredWordsPerLine: 3,
};

const PUNCTUATION_BREAK_PATTERN = /[.!?,:;]$/;

function getWordsDuration(words: TranscriptWord[]) {
  const firstWord = words[0];
  const lastWord = words.at(-1);

  if (!firstWord || !lastWord) {
    return 0;
  }

  return lastWord.end - firstWord.start;
}

function shouldEndCaption(
  words: TranscriptWord[],
  settings: CaptionEngineSettings,
  nextWord?: TranscriptWord,
) {
  if (!words.length) {
    return false;
  }

  const duration = getWordsDuration(words);
  const lastWord = words.at(-1);
  const hasEnoughWords = words.length >= settings.minWordsPerCaption;
  const hitMaxWords = words.length >= settings.maxWordsPerCaption;
  const hitMaxDuration = duration >= settings.maxCaptionDuration;
  const hitLineLimit =
    words.length >= settings.maxLines * settings.preferredWordsPerLine;
  const hasPunctuationBreak = Boolean(
    lastWord && PUNCTUATION_BREAK_PATTERN.test(lastWord.word),
  );

  if (!nextWord) {
    return true;
  }

  if (duration < settings.minCaptionDuration) {
    return false;
  }

  if (hasEnoughWords && hasPunctuationBreak) {
    return true;
  }

  return hitMaxWords || hitMaxDuration || hitLineLimit;
}

function createCaptionBlock(words: TranscriptWord[], index: number): CaptionBlock {
  const firstWord = words[0];
  const lastWord = words.at(-1);

  return {
    end: lastWord?.end ?? 0,
    id: `caption-${index + 1}`,
    start: firstWord?.start ?? 0,
    text: words.map((entry) => entry.word).join(" "),
    words,
  };
}

function mergeShortCaptionBlocks(
  captionBlocks: CaptionBlock[],
  settings: CaptionEngineSettings,
) {
  return captionBlocks.reduce<CaptionBlock[]>((mergedBlocks, captionBlock) => {
    const duration = getCaptionDuration(captionBlock);
    const previousBlock = mergedBlocks.at(-1);
    const canMergeWithPrevious =
      previousBlock &&
      previousBlock.words.length + captionBlock.words.length <=
        settings.maxLines * settings.preferredWordsPerLine;

    if (duration < settings.minCaptionDuration && canMergeWithPrevious) {
      const mergedWords = [...previousBlock.words, ...captionBlock.words];
      mergedBlocks[mergedBlocks.length - 1] = createCaptionBlock(
        mergedWords,
        mergedBlocks.length - 1,
      );
      return mergedBlocks;
    }

    mergedBlocks.push(createCaptionBlock(captionBlock.words, mergedBlocks.length));
    return mergedBlocks;
  }, []);
}

export function chunkTranscriptWords(
  transcriptWords: TranscriptWord[],
  settings: Partial<CaptionEngineSettings> = {},
): CaptionBlock[] {
  const resolvedSettings = {
    ...defaultCaptionEngineSettings,
    ...settings,
  };
  const captionBlocks: CaptionBlock[] = [];
  let currentWords: TranscriptWord[] = [];

  transcriptWords.forEach((word, index) => {
    currentWords = [...currentWords, word];

    if (
      shouldEndCaption(
        currentWords,
        resolvedSettings,
        transcriptWords[index + 1],
      )
    ) {
      captionBlocks.push(createCaptionBlock(currentWords, captionBlocks.length));
      currentWords = [];
    }
  });

  if (currentWords.length) {
    captionBlocks.push(createCaptionBlock(currentWords, captionBlocks.length));
  }

  return mergeShortCaptionBlocks(captionBlocks, resolvedSettings);
}
