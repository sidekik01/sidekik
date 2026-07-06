import { analyzeCreativeDirection } from "@/src/features/director/directorEngine";
import { exportPresets } from "@/src/features/export/exportPresets";
import { mockProjects } from "@/src/features/app/mockData";
import { brandPresets } from "@/src/features/style/brandPresets";
import { captionStylePresets } from "@/src/features/style/stylePresets";
import type { SavedProject } from "@/src/features/project/types";
import type { Orientation, Project } from "@/src/types/project";

function getOrientation(platform: string): Orientation {
  return (
    exportPresets.find((preset) => preset.platform === platform)
      ?.expectedOrientation ?? "Vertical Reel"
  );
}

export function getMockSavedProject(projectId: string): SavedProject | null {
  const mockProject = mockProjects.find((project) => project.id === projectId);

  if (!mockProject) {
    return null;
  }

  const brand =
    brandPresets.find((preset) => preset.brandName === mockProject.brand) ??
    brandPresets[0];
  const exportPreset =
    exportPresets.find((preset) => preset.platform === mockProject.platform) ??
    exportPresets[0];
  const project: Omit<Project, "objectUrl"> = {
    aspectRatio: exportPreset.aspectRatio,
    audioDetected: "Detected placeholder",
    codec: "Codec unavailable",
    duration: "00:00",
    filename: mockProject.name,
    filesize: "Re-upload required",
    fps: "Unavailable",
    height: 0,
    id: mockProject.id,
    orientation: getOrientation(mockProject.platform),
    status: "ready",
    thumbnail: "",
    width: 0,
  };
  const directorAnalysis = analyzeCreativeDirection({
    captionBlocks: [],
    project: {
      ...project,
      objectUrl: "",
    },
    transcript: null,
  });

  return {
    appliedHighlightWordIds: [],
    captionBlocks: [],
    captionProject: null,
    directorAnalysis,
    exportSettings: {
      outputFormat: "MP4",
      platform: exportPreset.platform,
      presetId: exportPreset.id,
    },
    id: mockProject.id,
    name: mockProject.name,
    project,
    savedAt: new Date().toISOString(),
    selectedBrand: brand,
    selectedStyle: brand.captionStylePreset ?? captionStylePresets[0],
    transcript: null,
  };
}
