import type { Project } from "@/src/types/project";
import type { CaptionBlock, TranscriptResult } from "@/src/types/transcript";

export type DirectorCategory =
  | "Hook"
  | "Readability"
  | "Pacing"
  | "Captions"
  | "CTA"
  | "Accessibility";

export type DirectorStatus = "passed" | "warning" | "suggestion";
export type RecommendationSeverity = DirectorStatus;
export type RecommendationFilter = "All" | "Warnings" | "Suggestions" | "Passed";

export type DirectorRecommendation = {
  id: string;
  severity: RecommendationSeverity;
  category: DirectorCategory;
  title: string;
  description: string;
  suggestedFix: string;
  autoFixAvailable: boolean;
};

export type DirectorCategoryResult = {
  category: DirectorCategory;
  score: number;
  status: DirectorStatus;
  recommendations: DirectorRecommendation[];
};

export type DirectorScoreBreakdown = {
  overall: number;
  hook: number;
  readability: number;
  pacing: number;
  captions: number;
  caption: number;
  cta: number;
  accessibility: number;
};

export type DirectorMetrics = {
  averageCaptionLength: number;
  averageCaptionDuration: number;
  captionCount: number;
  firstCaptionWords: number;
  longestCaptionWords: number;
  shortestCaptionDuration: number;
  transcriptWords: number;
  wordsPerMinute: number;
};

export type DirectorAnalysisInput = {
  project: Project | null;
  transcript: TranscriptResult | null;
  captionBlocks: CaptionBlock[];
};

export type DirectorAnalysis = {
  scores: DirectorScoreBreakdown;
  categories: DirectorCategoryResult[];
  recommendations: DirectorRecommendation[];
  metrics: DirectorMetrics;
};
