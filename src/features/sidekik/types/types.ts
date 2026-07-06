import type { CaptionProject, HighlightedWord } from "@/src/features/caption-engine/types";
import type { ExportPreset, ExportSettings } from "@/src/features/export/types";
import type { BrandPreset, CaptionStyle } from "@/src/features/style/types";
import type { WorkspaceSelection } from "@/src/features/workspace/workspaceTypes";
import type { Project } from "@/src/types/project";
import type { TranscriptResult } from "@/src/types/transcript";

export type SidekikSeverity = "strength" | "opportunity" | "warning";

export type SidekikAction = {
  id: string;
  title: string;
  description: string;
  category:
    | "analysis"
    | "captions"
    | "style"
    | "brand"
    | "platform"
    | "workflow";
  priority: "high" | "medium" | "low";
  autoFixAvailable: boolean;
};

export type SidekikInsight = {
  id: string;
  title: string;
  description: string;
  severity: SidekikSeverity;
  source: "project" | "transcript" | "captions" | "brand" | "platform";
};

export type SidekikCreativeSettings = {
  captionStyle: CaptionStyle | null;
  captionsEnabled: boolean;
  activeWordHighlightEnabled: boolean;
};

export type SidekikProjectSummary = {
  projectName: string;
  duration: string;
  orientation: string;
  resolution: string;
  aspectRatio: string;
  wordCount: number;
  captionCount: number;
  averageCaptionLength: number;
  readingSpeed: number;
};

export type SidekikCreativeScore = {
  overall: number;
  hook: number;
  readability: number;
  pacing: number;
  captions: number;
  brand: number;
  platform: number;
};

export type SidekikPlatformNote = {
  id: string;
  platform: string;
  note: string;
  status: "aligned" | "review" | "missing";
};

export type SidekikBrandNote = {
  id: string;
  brandName: string;
  note: string;
  status: "aligned" | "review" | "missing";
};

export type SidekikConversationContext = {
  projectLabel: string;
  currentWorkflowStage: string;
  availableTopics: string[];
  guardrails: string[];
};

export type SidekikMemoryContext = {
  editCount: number;
  recentPatterns: string[];
  learnedPreferences: string[];
};

export type SidekikAnalysisInput = {
  project: Project | null;
  transcript: TranscriptResult | null;
  captionProject: CaptionProject | null;
  brand: BrandPreset | null;
  workspace: WorkspaceSelection | null;
  exportTarget: ExportSettings | ExportPreset | null;
  creativeSettings: SidekikCreativeSettings;
};

export type SidekikAnalysis = {
  creativeScore: SidekikCreativeScore;
  projectSummary: SidekikProjectSummary;
  strengths: SidekikInsight[];
  opportunities: SidekikInsight[];
  warnings: SidekikInsight[];
  recommendedActions: SidekikAction[];
  suggestedHighlightWords: HighlightedWord[];
  platformNotes: SidekikPlatformNote[];
  brandNotes: SidekikBrandNote[];
  conversationContext: SidekikConversationContext;
  memoryContext: SidekikMemoryContext;
};
