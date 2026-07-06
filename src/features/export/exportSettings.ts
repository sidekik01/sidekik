import { defaultExportPreset } from "@/src/features/export/exportPresets";
import type { ExportFormat, ExportSettings } from "@/src/features/export/types";

export const exportFormats: ExportFormat[] = [
  "MP4",
  "SRT",
  "Transparent Captions placeholder",
  "FCPXML placeholder",
];

export const defaultExportSettings: ExportSettings = {
  outputFormat: "MP4",
  platform: defaultExportPreset.platform,
  presetId: defaultExportPreset.id,
};
