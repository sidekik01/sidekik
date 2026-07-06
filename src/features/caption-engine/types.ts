import type { Project } from "@/src/types/project";
import type { TranscriptResult, TranscriptWord } from "@/src/types/transcript";

export type CaptionDifficulty = "Easy" | "Moderate" | "Hard";

export type ReadingSpeedLevel = "slow" | "comfortable" | "fast";

export type CaptionEngineSettings = {
  minWordsPerCaption: number;
  maxWordsPerCaption: number;
  maxLines: number;
  preferredWordsPerLine: number;
  minCaptionDuration: number;
  maxCaptionDuration: number;
};

export type CaptionBlock = {
  id: string;
  text: string;
  start: number;
  end: number;
  words: TranscriptWord[];
};

export type HighlightedWord = TranscriptWord & {
  id: string;
  captionId: string;
  index: number;
  emphasis: "normal" | "strong";
  reasons: string[];
  confidence: number;
};

export type ReadingSpeed = {
  wordsPerMinute: number;
  level: ReadingSpeedLevel;
};

export type CaptionStatistics = {
  words: number;
  sentences: number;
  averageCaptionLength: number;
  averageReadingSpeed: number;
  longestCaption: CaptionBlock | null;
  shortestCaption: CaptionBlock | null;
  estimatedDifficulty: CaptionDifficulty;
};

export type CaptionProject = {
  project: Project;
  transcript: TranscriptResult;
  captionBlocks: CaptionBlock[];
  highlightedWords: HighlightedWord[];
  readingSpeed: ReadingSpeed;
  statistics: CaptionStatistics;
  settings: CaptionEngineSettings;
};

export type GenerateCaptionProjectInput = {
  project: Project;
  transcript: TranscriptResult;
  settings?: Partial<CaptionEngineSettings>;
};
