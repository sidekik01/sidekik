import type { Project } from "@/src/types/project";
import type {
  ProjectSnapshot,
  SavedProject,
  SerializableProjectMetadata,
} from "./types";

function serializeProjectMetadata(
  project: Project,
): SerializableProjectMetadata {
  const { objectUrl: _objectUrl, ...metadata } = project;

  return metadata;
}

export function createSavedProject(snapshot: ProjectSnapshot): SavedProject {
  if (!snapshot.currentProject) {
    throw new Error("Upload and analyze a video before saving a project.");
  }

  return {
    appliedHighlightWordIds: snapshot.appliedHighlightWordIds,
    captionBlocks: snapshot.captionBlocks,
    captionProject: snapshot.captionProject,
    directorAnalysis: snapshot.directorAnalysis,
    exportSettings: snapshot.exportSettings,
    id: snapshot.currentProject.id,
    name: snapshot.currentProject.filename || "Untitled Project",
    project: serializeProjectMetadata(snapshot.currentProject),
    savedAt: new Date().toISOString(),
    selectedBrand: snapshot.selectedBrand,
    selectedStyle: snapshot.selectedStyle,
    transcript: snapshot.transcript,
  };
}

export function restoreProjectMetadata(savedProject: SavedProject): Project {
  return {
    ...savedProject.project,
    objectUrl: "",
  };
}
