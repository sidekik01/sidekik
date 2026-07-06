"use client";

import { useCallback, useMemo } from "react";
import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { AppProvider } from "@/src/state/AppProvider";
import { useAppContext } from "@/src/state/AppContext";
import { appActions } from "@/src/state/actions";
import { createDirectorMemoryEvent } from "@/src/features/director/memory";
import type {
  CaptionProject,
  CaptionStatistics,
} from "@/src/features/caption-engine/captionEngine";
import type { ExportSettings } from "@/src/features/export/types";
import type { RenderJob } from "@/src/services/rendering";
import type { BrandPreset, CaptionStyle } from "@/src/features/style/types";
import type {
  ClientWorkspace,
  WorkspaceClient,
} from "@/src/features/workspace/workspaceTypes";
import type { Project } from "@/src/types/project";
import type { CaptionBlock, TranscriptResult } from "@/src/types/transcript";

type ProjectContextValue = {
  captionBlocks: CaptionBlock[];
  captionProject: CaptionProject | null;
  captionStatistics: CaptionStatistics | null;
  currentProject: Project | null;
  uploadedVideoFile: File | null;
  exportMessage: string | null;
  exportSettings: ExportSettings;
  renderError: string | null;
  renderJob: RenderJob | null;
  renderJobs: RenderJob[];
  appliedHighlightWordIds: string[];
  selectedCaptionId: string | null;
  selectedCaptionStyle: CaptionStyle;
  selectedBrandPreset: BrandPreset;
  selectedWorkspace: ClientWorkspace;
  selectedWorkspaceClient: WorkspaceClient;
  showCaptionsOnPreview: boolean;
  transcript: TranscriptResult | null;
  videoCurrentTime: number;
  videoDuration: number;
  videoElementRef: RefObject<HTMLVideoElement | null>;
  videoIsPlaying: boolean;
  setCaptionBlocks: Dispatch<SetStateAction<CaptionBlock[]>>;
  setCaptionProject: Dispatch<SetStateAction<CaptionProject | null>>;
  setCaptionStatistics: Dispatch<SetStateAction<CaptionStatistics | null>>;
  setAppliedHighlightWordIds: Dispatch<SetStateAction<string[]>>;
  setCurrentProject: Dispatch<SetStateAction<Project | null>>;
  setUploadedVideoFile: Dispatch<SetStateAction<File | null>>;
  setExportMessage: Dispatch<SetStateAction<string | null>>;
  setExportSettings: Dispatch<SetStateAction<ExportSettings>>;
  setRenderError: Dispatch<SetStateAction<string | null>>;
  setRenderJob: Dispatch<SetStateAction<RenderJob | null>>;
  setSelectedCaptionId: Dispatch<SetStateAction<string | null>>;
  setSelectedCaptionStyle: Dispatch<SetStateAction<CaptionStyle>>;
  setSelectedBrandPreset: Dispatch<SetStateAction<BrandPreset>>;
  setSelectedWorkspace: Dispatch<SetStateAction<ClientWorkspace>>;
  setSelectedWorkspaceClient: Dispatch<SetStateAction<WorkspaceClient>>;
  setShowCaptionsOnPreview: Dispatch<SetStateAction<boolean>>;
  setTranscript: Dispatch<SetStateAction<TranscriptResult | null>>;
  setVideoCurrentTime: Dispatch<SetStateAction<number>>;
  setVideoDuration: Dispatch<SetStateAction<number>>;
  setVideoIsPlaying: Dispatch<SetStateAction<boolean>>;
};

function resolveStateUpdate<T>(value: SetStateAction<T>, currentValue: T) {
  return typeof value === "function"
    ? (value as (previousValue: T) => T)(currentValue)
    : value;
}

function captionTextChanged(
  currentBlocks: CaptionBlock[],
  nextBlocks: CaptionBlock[],
) {
  if (!currentBlocks.length) {
    return false;
  }

  return (
    currentBlocks.length !== nextBlocks.length ||
    currentBlocks.some((block, index) => block.text !== nextBlocks[index]?.text)
  );
}

function captionTimingChanged(
  currentBlocks: CaptionBlock[],
  nextBlocks: CaptionBlock[],
) {
  if (!currentBlocks.length || currentBlocks.length !== nextBlocks.length) {
    return false;
  }

  return currentBlocks.some((block, index) => {
    const nextBlock = nextBlocks[index];

    return (
      Boolean(nextBlock) &&
      (block.start !== nextBlock.start || block.end !== nextBlock.end)
    );
  });
}

export function ProjectProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AppProvider>{children}</AppProvider>;
}

export function useProject(): ProjectContextValue {
  const { dispatch, state, videoElementRef } = useAppContext();
  const {
    brand,
    caption,
    project,
    renderQueue,
    settings,
    style,
    timeline,
    transcript,
    workspace,
  } = state;

  const setCurrentProject = useCallback<Dispatch<SetStateAction<Project | null>>>(
    (value) => {
      dispatch(
        appActions.loadProject(
          resolveStateUpdate(value, project.currentProject),
        ),
      );
    },
    [dispatch, project.currentProject],
  );

  const setUploadedVideoFile = useCallback<
    Dispatch<SetStateAction<File | null>>
  >(
    (value) => {
      dispatch(
        appActions.updateProjectFile(
          resolveStateUpdate(value, project.uploadedVideoFile),
        ),
      );
    },
    [dispatch, project.uploadedVideoFile],
  );

  const setTranscript = useCallback<
    Dispatch<SetStateAction<TranscriptResult | null>>
  >(
    (value) => {
      dispatch(
        appActions.updateTranscript(
          resolveStateUpdate(value, transcript.currentTranscript),
        ),
      );
    },
    [dispatch, transcript.currentTranscript],
  );

  const setCaptionBlocks = useCallback<
    Dispatch<SetStateAction<CaptionBlock[]>>
  >(
    (value) => {
      const nextBlocks = resolveStateUpdate(value, caption.captionBlocks);

      dispatch(
        appActions.updateCaptionBlocks(nextBlocks),
      );

      if (captionTextChanged(caption.captionBlocks, nextBlocks)) {
        dispatch(
          appActions.recordDirectorMemory(
            createDirectorMemoryEvent({
              metadata: {
                blocksAfter: nextBlocks.length,
                blocksBefore: caption.captionBlocks.length,
              },
              projectId: project.currentProject?.id ?? null,
              source: "transcript",
              summary: "Caption text or structure changed.",
              type: "caption_edit",
            }),
          ),
        );
      }

      if (captionTimingChanged(caption.captionBlocks, nextBlocks)) {
        dispatch(
          appActions.recordDirectorMemory(
            createDirectorMemoryEvent({
              metadata: {
                blocks: nextBlocks.length,
              },
              projectId: project.currentProject?.id ?? null,
              source: "timeline",
              summary: "Caption timing changed.",
              type: "timing_change",
            }),
          ),
        );
      }
    },
    [caption.captionBlocks, dispatch, project.currentProject?.id],
  );

  const setCaptionProject = useCallback<
    Dispatch<SetStateAction<CaptionProject | null>>
  >(
    (value) => {
      dispatch(
        appActions.updateCaptionProject({
          captionBlocks: caption.captionBlocks,
          captionProject: resolveStateUpdate(value, caption.captionProject),
          captionStatistics: caption.captionStatistics,
        }),
      );
    },
    [
      caption.captionBlocks,
      caption.captionProject,
      caption.captionStatistics,
      dispatch,
    ],
  );

  const setCaptionStatistics = useCallback<
    Dispatch<SetStateAction<CaptionStatistics | null>>
  >(
    (value) => {
      dispatch(
        appActions.updateCaptionStatistics(
          resolveStateUpdate(value, caption.captionStatistics),
        ),
      );
    },
    [caption.captionStatistics, dispatch],
  );

  const setAppliedHighlightWordIds = useCallback<
    Dispatch<SetStateAction<string[]>>
  >(
    (value) => {
      const nextHighlightWordIds = resolveStateUpdate(
        value,
        caption.appliedHighlightWordIds,
      );

      dispatch(
        appActions.updateHighlightWords(nextHighlightWordIds),
      );

      if (
        caption.appliedHighlightWordIds.join("|") !==
        nextHighlightWordIds.join("|")
      ) {
        dispatch(
          appActions.recordDirectorMemory(
            createDirectorMemoryEvent({
              metadata: {
                highlightsAfter: nextHighlightWordIds.length,
                highlightsBefore: caption.appliedHighlightWordIds.length,
              },
              projectId: project.currentProject?.id ?? null,
              source: "director",
              summary: "Highlight selections changed.",
              type: "highlight_change",
            }),
          ),
        );
      }
    },
    [caption.appliedHighlightWordIds, dispatch, project.currentProject?.id],
  );

  const setSelectedCaptionId = useCallback<
    Dispatch<SetStateAction<string | null>>
  >(
    (value) => {
      dispatch(
        appActions.updateTimeline({
          selectedCaptionId: resolveStateUpdate(
            value,
            timeline.selectedCaptionId,
          ),
        }),
      );
    },
    [dispatch, timeline.selectedCaptionId],
  );

  const setVideoCurrentTime = useCallback<Dispatch<SetStateAction<number>>>(
    (value) => {
      dispatch(
        appActions.updateTimeline({
          videoCurrentTime: resolveStateUpdate(value, timeline.videoCurrentTime),
        }),
      );
    },
    [dispatch, timeline.videoCurrentTime],
  );

  const setVideoDuration = useCallback<Dispatch<SetStateAction<number>>>(
    (value) => {
      dispatch(
        appActions.updateTimeline({
          videoDuration: resolveStateUpdate(value, timeline.videoDuration),
        }),
      );
    },
    [dispatch, timeline.videoDuration],
  );

  const setVideoIsPlaying = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      dispatch(
        appActions.updateTimeline({
          videoIsPlaying: resolveStateUpdate(value, timeline.videoIsPlaying),
        }),
      );
    },
    [dispatch, timeline.videoIsPlaying],
  );

  const setSelectedCaptionStyle = useCallback<
    Dispatch<SetStateAction<CaptionStyle>>
  >(
    (value) => {
      const nextStyle = resolveStateUpdate(value, style.selectedCaptionStyle);

      dispatch(
        appActions.updateStyle(nextStyle),
      );

      if (JSON.stringify(nextStyle) !== JSON.stringify(style.selectedCaptionStyle)) {
        dispatch(
          appActions.recordDirectorMemory(
            createDirectorMemoryEvent({
              metadata: {
                styleAfter: nextStyle.name,
                styleBefore: style.selectedCaptionStyle.name,
              },
              projectId: project.currentProject?.id ?? null,
              source: "style",
              summary: `Caption style changed to ${nextStyle.name}.`,
              type: "style_change",
            }),
          ),
        );
      }
    },
    [dispatch, project.currentProject?.id, style.selectedCaptionStyle],
  );

  const setSelectedBrandPreset = useCallback<
    Dispatch<SetStateAction<BrandPreset>>
  >(
    (value) => {
      const nextBrand = resolveStateUpdate(value, brand.selectedBrandPreset);

      dispatch(
        appActions.updateBrand(nextBrand),
      );

      if (nextBrand.id !== brand.selectedBrandPreset.id) {
        dispatch(
          appActions.recordDirectorMemory(
            createDirectorMemoryEvent({
              metadata: {
                brandAfter: nextBrand.brandName,
                brandBefore: brand.selectedBrandPreset.brandName,
              },
              projectId: project.currentProject?.id ?? null,
              source: "workspace",
              summary: `Brand changed to ${nextBrand.brandName}.`,
              type: "brand_choice",
            }),
          ),
        );
      }
    },
    [brand.selectedBrandPreset, dispatch, project.currentProject?.id],
  );

  const setSelectedWorkspace = useCallback<
    Dispatch<SetStateAction<ClientWorkspace>>
  >(
    (value) => {
      dispatch(
        appActions.updateWorkspace({
          selectedWorkspace: resolveStateUpdate(
            value,
            workspace.selectedWorkspace,
          ),
        }),
      );
    },
    [dispatch, workspace.selectedWorkspace],
  );

  const setSelectedWorkspaceClient = useCallback<
    Dispatch<SetStateAction<WorkspaceClient>>
  >(
    (value) => {
      dispatch(
        appActions.updateWorkspace({
          selectedWorkspaceClient: resolveStateUpdate(
            value,
            workspace.selectedWorkspaceClient,
          ),
        }),
      );
    },
    [dispatch, workspace.selectedWorkspaceClient],
  );

  const setExportSettings = useCallback<
    Dispatch<SetStateAction<ExportSettings>>
  >(
    (value) => {
      const nextExportSettings = resolveStateUpdate(
        value,
        settings.exportSettings,
      );

      dispatch(
        appActions.updateSettings({
          exportSettings: nextExportSettings,
        }),
      );

      if (
        nextExportSettings.outputFormat !==
          settings.exportSettings.outputFormat ||
        nextExportSettings.platform !== settings.exportSettings.platform ||
        nextExportSettings.presetId !== settings.exportSettings.presetId
      ) {
        dispatch(
          appActions.recordDirectorMemory(
            createDirectorMemoryEvent({
              metadata: {
                outputFormat: nextExportSettings.outputFormat,
                platform: nextExportSettings.platform,
                presetId: nextExportSettings.presetId,
              },
              projectId: project.currentProject?.id ?? null,
              source: "export",
              summary: `Export preference changed to ${nextExportSettings.platform}.`,
              type: "export_choice",
            }),
          ),
        );
      }
    },
    [dispatch, project.currentProject?.id, settings.exportSettings],
  );

  const setShowCaptionsOnPreview = useCallback<
    Dispatch<SetStateAction<boolean>>
  >(
    (value) => {
      dispatch(
        appActions.updateSettings({
          showCaptionsOnPreview: resolveStateUpdate(
            value,
            settings.showCaptionsOnPreview,
          ),
        }),
      );
    },
    [dispatch, settings.showCaptionsOnPreview],
  );

  const setRenderJob = useCallback<Dispatch<SetStateAction<RenderJob | null>>>(
    (value) => {
      const nextJob = resolveStateUpdate(value, renderQueue.activeJob);

      dispatch(
        appActions.updateRenderQueue({
          activeJob: nextJob,
          jobs: nextJob ? [nextJob] : renderQueue.jobs,
        }),
      );
    },
    [dispatch, renderQueue.activeJob, renderQueue.jobs],
  );

  const setRenderError = useCallback<Dispatch<SetStateAction<string | null>>>(
    (value) => {
      dispatch(
        appActions.updateRenderQueue({
          error: resolveStateUpdate(value, renderQueue.error),
        }),
      );
    },
    [dispatch, renderQueue.error],
  );

  const setExportMessage = useCallback<Dispatch<SetStateAction<string | null>>>(
    (value) => {
      dispatch(
        appActions.updateRenderQueue({
          message: resolveStateUpdate(value, renderQueue.message),
        }),
      );
    },
    [dispatch, renderQueue.message],
  );

  return useMemo(
    () => ({
      appliedHighlightWordIds: caption.appliedHighlightWordIds,
      captionBlocks: caption.captionBlocks,
      captionProject: caption.captionProject,
      captionStatistics: caption.captionStatistics,
      currentProject: project.currentProject,
      uploadedVideoFile: project.uploadedVideoFile,
      exportMessage: renderQueue.message,
      exportSettings: settings.exportSettings,
      renderError: renderQueue.error,
      renderJob: renderQueue.activeJob,
      renderJobs: renderQueue.jobs,
      selectedBrandPreset: brand.selectedBrandPreset,
      selectedCaptionId: timeline.selectedCaptionId,
      selectedCaptionStyle: style.selectedCaptionStyle,
      selectedWorkspace: workspace.selectedWorkspace,
      selectedWorkspaceClient: workspace.selectedWorkspaceClient,
      setAppliedHighlightWordIds,
      setCaptionBlocks,
      setCaptionProject,
      setCaptionStatistics,
      setCurrentProject,
      setUploadedVideoFile,
      setExportMessage,
      setExportSettings,
      setRenderError,
      setRenderJob,
      setSelectedBrandPreset,
      setSelectedCaptionId,
      setSelectedCaptionStyle,
      setSelectedWorkspace,
      setSelectedWorkspaceClient,
      setShowCaptionsOnPreview,
      setTranscript,
      setVideoCurrentTime,
      setVideoDuration,
      setVideoIsPlaying,
      showCaptionsOnPreview: settings.showCaptionsOnPreview,
      transcript: transcript.currentTranscript,
      videoCurrentTime: timeline.videoCurrentTime,
      videoDuration: timeline.videoDuration,
      videoElementRef,
      videoIsPlaying: timeline.videoIsPlaying,
    }),
    [
      brand.selectedBrandPreset,
      caption.appliedHighlightWordIds,
      caption.captionBlocks,
      caption.captionProject,
      caption.captionStatistics,
      project.currentProject,
      project.uploadedVideoFile,
      renderQueue.activeJob,
      renderQueue.error,
      renderQueue.jobs,
      renderQueue.message,
      settings.exportSettings,
      settings.showCaptionsOnPreview,
      setAppliedHighlightWordIds,
      setCaptionBlocks,
      setCaptionProject,
      setCaptionStatistics,
      setCurrentProject,
      setUploadedVideoFile,
      setExportMessage,
      setExportSettings,
      setRenderError,
      setRenderJob,
      setSelectedBrandPreset,
      setSelectedCaptionId,
      setSelectedCaptionStyle,
      setSelectedWorkspace,
      setSelectedWorkspaceClient,
      setShowCaptionsOnPreview,
      setTranscript,
      setVideoCurrentTime,
      setVideoDuration,
      setVideoIsPlaying,
      style.selectedCaptionStyle,
      timeline.selectedCaptionId,
      timeline.videoCurrentTime,
      timeline.videoDuration,
      timeline.videoIsPlaying,
      transcript.currentTranscript,
      videoElementRef,
      workspace.selectedWorkspace,
      workspace.selectedWorkspaceClient,
    ],
  );
}
