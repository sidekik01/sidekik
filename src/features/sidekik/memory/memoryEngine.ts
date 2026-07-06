import type {
  SidekikAnalysisInput,
  SidekikMemoryContext,
} from "../types/types";

export function buildMemoryContext({
  brand,
  creativeSettings,
  workspace,
}: SidekikAnalysisInput): SidekikMemoryContext {
  return {
    editCount: 0,
    learnedPreferences: [
      brand ? `Brand preset: ${brand.brandName}` : "No brand preset selected",
      creativeSettings.captionStyle
        ? `Caption style: ${creativeSettings.captionStyle.name}`
        : "No caption style selected",
      workspace ? `Workspace selected: ${workspace.workspaceId}` : "No workspace selected",
    ],
    recentPatterns: [],
  };
}
