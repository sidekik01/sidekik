import type { AppState } from "@/src/state/types";

export const appSelectors = {
  getCurrentProject: (state: AppState) => state.project.currentProject,
  getTranscript: (state: AppState) => state.transcript.currentTranscript,
  getCaptionBlocks: (state: AppState) => state.caption.captionBlocks,
  getCaptionProject: (state: AppState) => state.caption.captionProject,
  getTimeline: (state: AppState) => state.timeline,
  getSelectedStyle: (state: AppState) => state.style.selectedCaptionStyle,
  getSelectedBrand: (state: AppState) => state.brand.selectedBrandPreset,
  getWorkspace: (state: AppState) => state.workspace,
  getDirectorAnalysis: (state: AppState) => state.director.analysis,
  getDirectorMemory: (state: AppState) => state.director.memory,
  getRenderQueue: (state: AppState) => state.renderQueue,
  getSettings: (state: AppState) => state.settings,
  getUi: (state: AppState) => state.ui,
};
