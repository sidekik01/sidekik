import type { CaptionProject } from "@/src/features/caption-engine/captionEngine";
import type { DirectorAnalysis } from "@/src/features/director/types";
import type { ExportSettings } from "@/src/features/export/types";
import type { BrandPreset, CaptionStyle } from "@/src/features/style/types";
import type { Project } from "@/src/types/project";
import type { CaptionBlock, TranscriptResult } from "@/src/types/transcript";

export type SerializableProjectMetadata = Omit<Project, "objectUrl">;

export type SavedProject = {
  id: string;
  name: string;
  savedAt: string;
  project: SerializableProjectMetadata;
  transcript: TranscriptResult | null;
  captionBlocks: CaptionBlock[];
  captionProject: CaptionProject | null;
  selectedStyle: CaptionStyle;
  selectedBrand: BrandPreset;
  exportSettings: ExportSettings;
  directorAnalysis: DirectorAnalysis;
  appliedHighlightWordIds: string[];
};

export type ProjectSnapshot = {
  currentProject: Project | null;
  transcript: TranscriptResult | null;
  captionBlocks: CaptionBlock[];
  captionProject: CaptionProject | null;
  selectedStyle: CaptionStyle;
  selectedBrand: BrandPreset;
  exportSettings: ExportSettings;
  directorAnalysis: DirectorAnalysis;
  appliedHighlightWordIds: string[];
};
