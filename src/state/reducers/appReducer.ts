import type { AppAction, AppState } from "@/src/state/types";

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOAD_PROJECT":
      return {
        ...state,
        project: {
          ...state.project,
          currentProject: action.payload,
        },
      };
    case "UPDATE_PROJECT_FILE":
      return {
        ...state,
        project: {
          ...state.project,
          uploadedVideoFile: action.payload,
        },
      };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: {
          ...state.account,
          ...action.payload,
        },
      };
    case "UPDATE_SUBSCRIPTION":
      return {
        ...state,
        subscription: {
          ...state.subscription,
          ...action.payload,
        },
      };
    case "UPDATE_TRANSCRIPT":
      return {
        ...state,
        transcript: {
          ...state.transcript,
          currentTranscript: action.payload,
        },
      };
    case "UPDATE_CAPTION_PROJECT":
      return {
        ...state,
        caption: {
          ...state.caption,
          captionBlocks: action.payload.captionBlocks,
          captionProject: action.payload.captionProject,
          captionStatistics: action.payload.captionStatistics,
        },
      };
    case "UPDATE_CAPTION_BLOCKS":
      return {
        ...state,
        caption: {
          ...state.caption,
          captionBlocks: action.payload,
        },
      };
    case "UPDATE_CAPTION_STATISTICS":
      return {
        ...state,
        caption: {
          ...state.caption,
          captionStatistics: action.payload,
        },
      };
    case "UPDATE_HIGHLIGHT_WORDS":
      return {
        ...state,
        caption: {
          ...state.caption,
          appliedHighlightWordIds: action.payload,
        },
      };
    case "UPDATE_TIMELINE":
      return {
        ...state,
        timeline: {
          ...state.timeline,
          ...action.payload,
        },
      };
    case "UPDATE_STYLE":
      return {
        ...state,
        style: {
          ...state.style,
          selectedCaptionStyle: action.payload,
        },
      };
    case "UPDATE_BRAND":
      return {
        ...state,
        brand: {
          ...state.brand,
          selectedBrandPreset: action.payload,
        },
      };
    case "UPDATE_WORKSPACE":
      return {
        ...state,
        workspace: {
          ...state.workspace,
          ...action.payload,
        },
      };
    case "UPDATE_DIRECTOR":
      return {
        ...state,
        director: {
          ...state.director,
          analysis: action.payload,
        },
      };
    case "RECORD_DIRECTOR_MEMORY":
      return {
        ...state,
        director: {
          ...state.director,
          memory: {
            editHistory: [
              action.payload,
              ...state.director.memory.editHistory,
            ].slice(0, 100),
          },
        },
      };
    case "CLEAR_DIRECTOR_MEMORY":
      return {
        ...state,
        director: {
          ...state.director,
          memory: {
            editHistory: [],
          },
        },
      };
    case "UPDATE_RENDER_QUEUE":
      return {
        ...state,
        renderQueue: {
          ...state.renderQueue,
          ...action.payload,
        },
      };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case "UPDATE_UI":
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
