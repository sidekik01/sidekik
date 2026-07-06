import { collectRecommendations } from "./recommendationEngine";
import { runDirectorRules } from "./directorRules";
import {
  calculateDirectorScores,
  getDirectorMetrics,
} from "./scoreEngine";
import type { DirectorAnalysis, DirectorAnalysisInput } from "./types";

const emptyAnalysis: DirectorAnalysis = {
  categories: [
    {
      category: "Hook",
      recommendations: [
        {
          autoFixAvailable: false,
          category: "Hook",
          description:
            "Generate a transcript before the director can review creative performance.",
          id: "director-needs-transcript",
          severity: "suggestion",
          suggestedFix: "Upload a video and generate a transcript.",
          title: "Creative review is waiting",
        },
      ],
      score: 0,
      status: "suggestion",
    },
  ],
  metrics: {
    averageCaptionDuration: 0,
    averageCaptionLength: 0,
    captionCount: 0,
    firstCaptionWords: 0,
    longestCaptionWords: 0,
    shortestCaptionDuration: 0,
    transcriptWords: 0,
    wordsPerMinute: 0,
  },
  recommendations: [
    {
      autoFixAvailable: false,
      category: "Hook",
      description:
        "Generate a transcript before the director can review creative performance.",
      id: "director-needs-transcript",
      severity: "suggestion",
      suggestedFix: "Upload a video and generate a transcript.",
      title: "Creative review is waiting",
    },
  ],
  scores: {
    accessibility: 0,
    caption: 0,
    captions: 0,
    cta: 0,
    hook: 0,
    overall: 0,
    pacing: 0,
    readability: 0,
  },
};

export function analyzeCreativeDirection({
  captionBlocks,
  transcript,
}: DirectorAnalysisInput): DirectorAnalysis {
  if (!transcript || !captionBlocks.length) {
    return emptyAnalysis;
  }

  const metrics = getDirectorMetrics(transcript, captionBlocks);
  const categories = runDirectorRules({
    metrics,
    transcriptText: transcript.transcript,
  });

  return {
    categories,
    metrics,
    recommendations: collectRecommendations(categories),
    scores: calculateDirectorScores(categories),
  };
}
