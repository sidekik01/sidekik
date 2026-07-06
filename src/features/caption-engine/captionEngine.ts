import { generateHighlightedWords } from "./captionHighlighter";
import {
  chunkTranscriptWords,
  defaultCaptionEngineSettings,
} from "./captionChunker";
import {
  analyzeReadingSpeed,
  calculateReadingSpeed,
  estimateDifficulty,
} from "./readingSpeed";
import {
  countSentences,
  getAverageCaptionLength,
  getLongestCaption,
  getShortestCaption,
} from "./timing";
import type {
  CaptionProject,
  CaptionStatistics,
  GenerateCaptionProjectInput,
} from "./types";

function createCaptionStatistics({
  averageReadingSpeed,
  captionBlocks,
  transcriptText,
  wordCount,
}: Readonly<{
  averageReadingSpeed: number;
  captionBlocks: CaptionProject["captionBlocks"];
  transcriptText: string;
  wordCount: number;
}>): CaptionStatistics {
  const averageCaptionLength = getAverageCaptionLength(captionBlocks);

  return {
    averageCaptionLength,
    averageReadingSpeed,
    estimatedDifficulty: estimateDifficulty(
      averageReadingSpeed,
      averageCaptionLength,
    ),
    longestCaption: getLongestCaption(captionBlocks),
    sentences: countSentences(transcriptText),
    shortestCaption: getShortestCaption(captionBlocks),
    words: wordCount,
  };
}

export function generateCaptionProject({
  project,
  settings,
  transcript,
}: GenerateCaptionProjectInput): CaptionProject {
  const resolvedSettings = {
    ...defaultCaptionEngineSettings,
    ...settings,
  };
  const captionBlocks = chunkTranscriptWords(
    transcript.words,
    resolvedSettings,
  );
  const highlightedWords = generateHighlightedWords(captionBlocks);
  const readingSpeed = analyzeReadingSpeed(
    transcript.words.length,
    transcript.duration,
  );
  const averageReadingSpeed = calculateReadingSpeed(
    transcript.words.length,
    transcript.duration,
  );

  return {
    captionBlocks,
    highlightedWords,
    project,
    readingSpeed,
    settings: resolvedSettings,
    statistics: createCaptionStatistics({
      averageReadingSpeed,
      captionBlocks,
      transcriptText: transcript.transcript,
      wordCount: transcript.words.length,
    }),
    transcript,
  };
}

export type {
  CaptionBlock,
  CaptionDifficulty,
  CaptionEngineSettings,
  CaptionProject,
  CaptionStatistics,
  GenerateCaptionProjectInput,
  HighlightedWord,
  ReadingSpeed,
  ReadingSpeedLevel,
} from "./types";
