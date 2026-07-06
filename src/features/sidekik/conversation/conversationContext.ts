import type {
  SidekikAnalysisInput,
  SidekikConversationContext,
} from "../types/types";

export function buildConversationContext({
  brand,
  captionProject,
  project,
  transcript,
}: SidekikAnalysisInput): SidekikConversationContext {
  const availableTopics = [
    project ? "project metadata" : null,
    transcript ? "transcript review" : null,
    captionProject ? "caption structure" : null,
    brand ? "brand alignment" : null,
    "export readiness",
  ].filter((topic): topic is string => Boolean(topic));

  return {
    availableTopics,
    currentWorkflowStage: captionProject
      ? "caption review"
      : transcript
        ? "transcript review"
        : project
          ? "project analysis"
          : "upload",
    guardrails: [
      "No OpenAI calls in the architecture layer.",
      "Recommendations must come from deterministic project data.",
      "Users approve changes before Sidekik applies them.",
    ],
    projectLabel: project?.filename ?? "Untitled project",
  };
}
