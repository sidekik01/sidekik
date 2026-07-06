import type {
  CaptionProject,
  CaptionStatistics,
} from "@/src/features/caption-engine/captionEngine";
import type { DirectorAnalysis } from "@/src/features/director/types";
import type {
  DirectorMemoryEvent,
  DirectorMemoryState,
} from "@/src/features/director/memory/types";
import type { AccountState } from "@/src/features/account/accountTypes";
import type { ExportSettings } from "@/src/features/export/types";
import type { RenderJob } from "@/src/services/rendering";
import type { SubscriptionState } from "@/src/features/subscription/subscriptionTypes";
import type { BrandPreset, CaptionStyle } from "@/src/features/style/types";
import type {
  ClientWorkspace,
  WorkspaceClient,
} from "@/src/features/workspace/workspaceTypes";
import type {
  ActiveTab,
  AnalysisStep,
  Project,
  ProjectStage,
  TranscriptionErrorCode,
  TranscriptionMode,
  TranscriptionStep,
} from "@/src/types/project";
import type { CaptionBlock, TranscriptResult } from "@/src/types/transcript";

export type AppState = {
  account: AccountState;
  subscription: SubscriptionState;
  project: {
    currentProject: Project | null;
    uploadedVideoFile: File | null;
  };
  transcript: {
    currentTranscript: TranscriptResult | null;
  };
  caption: {
    captionBlocks: CaptionBlock[];
    captionProject: CaptionProject | null;
    captionStatistics: CaptionStatistics | null;
    appliedHighlightWordIds: string[];
  };
  timeline: {
    selectedCaptionId: string | null;
    videoCurrentTime: number;
    videoDuration: number;
    videoIsPlaying: boolean;
  };
  style: {
    selectedCaptionStyle: CaptionStyle;
  };
  brand: {
    selectedBrandPreset: BrandPreset;
  };
  workspace: {
    selectedWorkspace: ClientWorkspace;
    selectedWorkspaceClient: WorkspaceClient;
  };
  director: {
    analysis: DirectorAnalysis | null;
    memory: DirectorMemoryState;
  };
  renderQueue: {
    activeJob: RenderJob | null;
    jobs: RenderJob[];
    error: string | null;
    message: string | null;
  };
  settings: {
    exportSettings: ExportSettings;
    showCaptionsOnPreview: boolean;
  };
  ui: {
    activeAnalysisStep: AnalysisStep;
    activeTab: ActiveTab;
    activeTranscriptionStep: TranscriptionStep;
    isDragging: boolean;
    projectStage: ProjectStage;
    transcriptionErrorCode: TranscriptionErrorCode | null;
    transcriptionMode: TranscriptionMode;
    transcriptionNotice: string | null;
    uploadError: string | null;
  };
};

export type AppAction =
  | { type: "LOAD_PROJECT"; payload: Project | null }
  | { type: "UPDATE_PROJECT_FILE"; payload: File | null }
  | {
      type: "UPDATE_ACCOUNT";
      payload: Partial<AppState["account"]>;
    }
  | {
      type: "UPDATE_SUBSCRIPTION";
      payload: Partial<AppState["subscription"]>;
    }
  | { type: "UPDATE_TRANSCRIPT"; payload: TranscriptResult | null }
  | {
      type: "UPDATE_CAPTION_PROJECT";
      payload: {
        captionBlocks: CaptionBlock[];
        captionProject: CaptionProject | null;
        captionStatistics: CaptionStatistics | null;
      };
    }
  | { type: "UPDATE_CAPTION_BLOCKS"; payload: CaptionBlock[] }
  | { type: "UPDATE_CAPTION_STATISTICS"; payload: CaptionStatistics | null }
  | { type: "UPDATE_HIGHLIGHT_WORDS"; payload: string[] }
  | {
      type: "UPDATE_TIMELINE";
      payload: Partial<AppState["timeline"]>;
    }
  | { type: "UPDATE_STYLE"; payload: CaptionStyle }
  | { type: "UPDATE_BRAND"; payload: BrandPreset }
  | {
      type: "UPDATE_WORKSPACE";
      payload: Partial<AppState["workspace"]>;
    }
  | { type: "UPDATE_DIRECTOR"; payload: DirectorAnalysis | null }
  | { type: "RECORD_DIRECTOR_MEMORY"; payload: DirectorMemoryEvent }
  | { type: "CLEAR_DIRECTOR_MEMORY" }
  | {
      type: "UPDATE_RENDER_QUEUE";
      payload: Partial<AppState["renderQueue"]>;
    }
  | {
      type: "UPDATE_SETTINGS";
      payload: Partial<AppState["settings"]>;
    }
  | {
      type: "UPDATE_UI";
      payload: Partial<AppState["ui"]>;
    };
