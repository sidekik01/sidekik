import { generateHighlightedWords } from "@/src/features/caption-engine/captionHighlighter";
import { buildConversationContext } from "../conversation/conversationContext";
import { buildMemoryContext } from "../memory/memoryEngine";
import {
  getBrandNotes,
  getPlatformNotes,
  getRecommendedActions,
  getSidekikInsights,
} from "../recommendations/recommendationEngine";
import { calculateSidekikCreativeScore } from "../analysis/creativeScore";
import { buildProjectSummary } from "../analysis/projectContext";
import { analyzeVideo } from "../analysis/videoAnalyzer";
import type { SidekikAnalysis, SidekikAnalysisInput } from "../types/types";

export function analyzeProject(input: SidekikAnalysisInput): SidekikAnalysis {
  const videoAnalysis = analyzeVideo({
    captionProject: input.captionProject,
    project: input.project,
    transcript: input.transcript,
  });
  const { opportunities, strengths, warnings } = getSidekikInsights({
    creativeSettings: input.creativeSettings,
    videoAnalysis,
  });
  const captionBlocks = input.captionProject?.captionBlocks ?? [];

  return {
    brandNotes: getBrandNotes({
      brand: input.brand,
      creativeSettings: input.creativeSettings,
    }),
    conversationContext: buildConversationContext(input),
    creativeScore: calculateSidekikCreativeScore({
      brand: input.brand,
      creativeSettings: input.creativeSettings,
      videoAnalysis,
    }),
    memoryContext: buildMemoryContext(input),
    opportunities,
    platformNotes: getPlatformNotes({
      exportTarget: input.exportTarget,
      project: input.project,
    }),
    projectSummary: buildProjectSummary({
      project: input.project,
      videoAnalysis,
    }),
    recommendedActions: getRecommendedActions({
      creativeSettings: input.creativeSettings,
      videoAnalysis,
    }),
    strengths,
    suggestedHighlightWords:
      input.captionProject?.highlightedWords ?? generateHighlightedWords(captionBlocks),
    warnings,
  };
}
