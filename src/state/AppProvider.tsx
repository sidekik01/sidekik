"use client";

import { useMemo, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import { defaultExportSettings } from "@/src/features/export/exportSettings";
import { defaultBrandPreset } from "@/src/features/style/brandPresets";
import { defaultCaptionStyle } from "@/src/features/style/captionStyles";
import {
  defaultWorkspace,
  defaultWorkspaceClient,
} from "@/src/features/workspace/defaultWorkspaces";
import { AppContext } from "@/src/state/AppContext";
import { appReducer } from "@/src/state/reducers/appReducer";
import type { AppState } from "@/src/state/types";
import { defaultSubscription } from "@/src/features/subscription/subscriptionTypes";

export const initialAppState: AppState = {
  account: {
    error: null,
    isLoading: false,
    isLocalMode: true,
    mode: "anonymous",
    profile: null,
  },
  brand: {
    selectedBrandPreset: defaultBrandPreset,
  },
  caption: {
    appliedHighlightWordIds: [],
    captionBlocks: [],
    captionProject: null,
    captionStatistics: null,
  },
  director: {
    analysis: null,
    memory: {
      editHistory: [],
    },
  },
  project: {
    currentProject: null,
    uploadedVideoFile: null,
  },
  renderQueue: {
    activeJob: null,
    error: null,
    jobs: [],
    message: null,
  },
  settings: {
    exportSettings: defaultExportSettings,
    showCaptionsOnPreview: true,
  },
  style: {
    selectedCaptionStyle: defaultCaptionStyle,
  },
  subscription: {
    current: defaultSubscription,
    plan: "creator",
  },
  timeline: {
    selectedCaptionId: null,
    videoCurrentTime: 0,
    videoDuration: 0,
    videoIsPlaying: false,
  },
  transcript: {
    currentTranscript: null,
  },
  ui: {
    activeAnalysisStep: "Reading Metadata",
    activeTab: "Analyze",
    activeTranscriptionStep: "Transcribing...",
    isDragging: false,
    projectStage: "empty",
    transcriptionErrorCode: null,
    transcriptionMode: "idle",
    transcriptionNotice: null,
    uploadError: null,
  },
  workspace: {
    selectedWorkspace: defaultWorkspace,
    selectedWorkspaceClient: defaultWorkspaceClient,
  },
};

export function AppProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const value = useMemo(
    () => ({
      dispatch,
      state,
      videoElementRef,
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
