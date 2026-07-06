import type {
  CaptionProject,
  CaptionStatistics,
} from "@/src/features/caption-engine/captionEngine";
import type { DirectorAnalysis } from "@/src/features/director/types";
import type { DirectorMemoryEvent } from "@/src/features/director/memory/types";
import type { BrandPreset, CaptionStyle } from "@/src/features/style/types";
import type { AppAction, AppState } from "@/src/state/types";
import type { Project } from "@/src/types/project";
import type { CaptionBlock, TranscriptResult } from "@/src/types/transcript";

export const appActions = {
  loadProject: (project: Project | null): AppAction => ({
    payload: project,
    type: "LOAD_PROJECT",
  }),
  updateProjectFile: (file: File | null): AppAction => ({
    payload: file,
    type: "UPDATE_PROJECT_FILE",
  }),
  updateAccount: (account: Partial<AppState["account"]>): AppAction => ({
    payload: account,
    type: "UPDATE_ACCOUNT",
  }),
  updateSubscription: (
    subscription: Partial<AppState["subscription"]>,
  ): AppAction => ({
    payload: subscription,
    type: "UPDATE_SUBSCRIPTION",
  }),
  updateTranscript: (transcript: TranscriptResult | null): AppAction => ({
    payload: transcript,
    type: "UPDATE_TRANSCRIPT",
  }),
  updateCaptionProject: ({
    captionBlocks,
    captionProject,
    captionStatistics,
  }: {
    captionBlocks: CaptionBlock[];
    captionProject: CaptionProject | null;
    captionStatistics: CaptionStatistics | null;
  }): AppAction => ({
    payload: { captionBlocks, captionProject, captionStatistics },
    type: "UPDATE_CAPTION_PROJECT",
  }),
  updateCaptionBlocks: (captionBlocks: CaptionBlock[]): AppAction => ({
    payload: captionBlocks,
    type: "UPDATE_CAPTION_BLOCKS",
  }),
  updateCaptionStatistics: (
    captionStatistics: CaptionStatistics | null,
  ): AppAction => ({
    payload: captionStatistics,
    type: "UPDATE_CAPTION_STATISTICS",
  }),
  updateHighlightWords: (highlightWordIds: string[]): AppAction => ({
    payload: highlightWordIds,
    type: "UPDATE_HIGHLIGHT_WORDS",
  }),
  updateTimeline: (timeline: Partial<AppState["timeline"]>): AppAction => ({
    payload: timeline,
    type: "UPDATE_TIMELINE",
  }),
  updateStyle: (style: CaptionStyle): AppAction => ({
    payload: style,
    type: "UPDATE_STYLE",
  }),
  updateBrand: (brand: BrandPreset): AppAction => ({
    payload: brand,
    type: "UPDATE_BRAND",
  }),
  updateWorkspace: (
    workspace: Partial<AppState["workspace"]>,
  ): AppAction => ({
    payload: workspace,
    type: "UPDATE_WORKSPACE",
  }),
  updateDirector: (analysis: DirectorAnalysis | null): AppAction => ({
    payload: analysis,
    type: "UPDATE_DIRECTOR",
  }),
  recordDirectorMemory: (event: DirectorMemoryEvent): AppAction => ({
    payload: event,
    type: "RECORD_DIRECTOR_MEMORY",
  }),
  clearDirectorMemory: (): AppAction => ({
    type: "CLEAR_DIRECTOR_MEMORY",
  }),
  updateRenderQueue: (
    renderQueue: Partial<AppState["renderQueue"]>,
  ): AppAction => ({
    payload: renderQueue,
    type: "UPDATE_RENDER_QUEUE",
  }),
  updateSettings: (settings: Partial<AppState["settings"]>): AppAction => ({
    payload: settings,
    type: "UPDATE_SETTINGS",
  }),
  updateUi: (ui: Partial<AppState["ui"]>): AppAction => ({
    payload: ui,
    type: "UPDATE_UI",
  }),
};
