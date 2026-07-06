"use client";

import { useEffect, useRef } from "react";
import type { ChangeEvent, DragEvent, MouseEvent, SyntheticEvent } from "react";
import { generateCaptionProject } from "@/src/features/caption-engine/captionEngine";
import { analyzeCreativeDirection } from "@/src/features/director/directorEngine";
import { useProject } from "@/src/features/project/ProjectContext";
import { restoreProjectMetadata } from "@/src/features/project/projectSerializer";
import type { SavedProject } from "@/src/features/project/types";
import {
  createProjectId,
  createThumbnail,
  detectOrientation,
  formatDuration,
  formatFileSize,
  getAspectRatio,
  isAcceptedVideo,
} from "@/src/services/analysis/videoAnalysis";
import { generateMockTranscript } from "@/src/services/transcription/mockTranscription";
import {
  requestTranscription,
  TranscriptionRequestError,
} from "@/src/services/transcription/requestTranscription";
import { useAppContext } from "@/src/state/AppContext";
import { appActions } from "@/src/state/actions";
import { analysisSteps, transcriptionSteps } from "@/src/types/project";
import type {
  ActiveTab,
  AnalysisStep,
  TranscriptionErrorCode,
  ProjectStage,
  TranscriptionMode,
  TranscriptionStep,
} from "@/src/types/project";
import type { TranscriptResult } from "@/src/types/transcript";

export function useProjectAnalysis() {
  const {
    currentProject,
    setAppliedHighlightWordIds,
    setCaptionBlocks,
    setCaptionProject,
    setCaptionStatistics,
    setExportSettings,
    setSelectedBrandPreset,
    setSelectedCaptionStyle,
    setShowCaptionsOnPreview,
    setSelectedCaptionId,
    setCurrentProject,
    setTranscript,
    setUploadedVideoFile,
    setVideoCurrentTime,
    setVideoDuration,
    transcript,
  } = useProject();
  const { dispatch, state } = useAppContext();
  const {
    activeAnalysisStep,
    activeTab,
    activeTranscriptionStep,
    isDragging,
    projectStage,
    transcriptionErrorCode,
    transcriptionMode,
    transcriptionNotice,
    uploadError,
  } = state.ui;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFileRef = useRef<File | null>(null);
  const currentObjectUrl = useRef<string | null>(null);
  const analysisReady =
    projectStage === "ready" ||
    projectStage === "transcribing" ||
    projectStage === "transcript_ready";
  const isTranscribing = projectStage === "transcribing";
  const transcriptReady = projectStage === "transcript_ready";

  function setActiveTab(activeTab: ActiveTab) {
    dispatch(appActions.updateUi({ activeTab }));
  }

  function setActiveAnalysisStep(activeAnalysisStep: AnalysisStep) {
    dispatch(appActions.updateUi({ activeAnalysisStep }));
  }

  function setActiveTranscriptionStep(
    activeTranscriptionStep: TranscriptionStep,
  ) {
    dispatch(appActions.updateUi({ activeTranscriptionStep }));
  }

  function setIsDragging(isDragging: boolean) {
    dispatch(appActions.updateUi({ isDragging }));
  }

  function setProjectStage(projectStage: ProjectStage) {
    dispatch(appActions.updateUi({ projectStage }));
  }

  function setTranscriptionMode(transcriptionMode: TranscriptionMode) {
    dispatch(appActions.updateUi({ transcriptionMode }));
  }

  function setTranscriptionNotice(transcriptionNotice: string | null) {
    dispatch(appActions.updateUi({ transcriptionNotice }));
  }

  function setTranscriptionErrorCode(
    transcriptionErrorCode: TranscriptionErrorCode | null,
  ) {
    dispatch(appActions.updateUi({ transcriptionErrorCode }));
  }

  function setUploadError(uploadError: string | null) {
    dispatch(appActions.updateUi({ uploadError }));
  }

  useEffect(() => {
    return () => {
      if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
      }
    };
  }, []);

  useEffect(() => {
    if (projectStage !== "analyzing" || !currentProject?.width) {
      return;
    }

    const timers = analysisSteps.map((step, index) =>
      window.setTimeout(() => {
        setActiveAnalysisStep(step);

        if (step === "Ready") {
          setProjectStage("ready");
          setCurrentProject((project) =>
            project ? { ...project, status: "ready" } : project,
          );
          setActiveTab("Analyze");
        }
      }, index * 700),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [projectStage, currentProject?.width, setCurrentProject]);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleVideoFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!isAcceptedVideo(file)) {
      setUploadError("Upload an MP4, MOV, or M4V video file.");
      return;
    }

    if (currentObjectUrl.current) {
      URL.revokeObjectURL(currentObjectUrl.current);
    }

    const objectUrl = URL.createObjectURL(file);
    currentObjectUrl.current = objectUrl;
    uploadedFileRef.current = file;
    setUploadedVideoFile(file);
    setCurrentProject({
      aspectRatio: "Reading",
      audioDetected: "Detected placeholder",
      codec: "Codec unavailable",
      duration: "Reading",
      filename: file.name,
      filesize: formatFileSize(file.size),
      fps: "Unavailable",
      height: 0,
      id: createProjectId(),
      objectUrl,
      orientation: "Landscape",
      status: "analyzing",
      thumbnail: "",
      width: 0,
    });
    setTranscript(null);
    setCaptionBlocks([]);
    setCaptionProject(null);
    setCaptionStatistics(null);
    setAppliedHighlightWordIds([]);
    setSelectedCaptionId(null);
    setVideoCurrentTime(0);
    setVideoDuration(0);
    setActiveAnalysisStep("Reading Metadata");
    setTranscriptionMode("idle");
    setTranscriptionNotice(null);
    setTranscriptionErrorCode(null);
    setProjectStage("analyzing");
    setActiveTab("Analyze");
    setUploadError(null);
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    handleVideoFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleVideoFile(event.dataTransfer.files?.[0]);
  }

  function handlePreviewPanelClick(event: MouseEvent<HTMLElement>) {
    if (projectStage !== "empty") {
      return;
    }

    const target = event.target;

    if (target instanceof Element && target.closest("button,input,video")) {
      return;
    }

    openFilePicker();
  }

  function handleLoadedData(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      return;
    }

    setCurrentProject((project) => {
      if (!project || project.objectUrl !== video.src) {
        return project;
      }

      return {
        ...project,
        aspectRatio: getAspectRatio(width, height),
        duration: formatDuration(video.duration),
        height,
        orientation: detectOrientation(width, height),
        thumbnail: project.thumbnail || createThumbnail(video),
        width,
      };
    });
  }

  async function handleGenerateTranscript() {
    if (!currentProject) {
      return;
    }

    setActiveTab("Captions");
    setActiveTranscriptionStep("Transcribing...");
    setTranscriptionMode("real");
    setTranscriptionNotice("Using real AI transcript.");
    setTranscriptionErrorCode(null);
    setProjectStage("transcribing");
    setCurrentProject((project) =>
      project ? { ...project, status: "transcribing" } : project,
    );

    const timers = transcriptionSteps.slice(1, -1).map((step, index) =>
      window.setTimeout(() => {
        setActiveTranscriptionStep(step);
      }, (index + 1) * 550),
    );

    try {
      if (!uploadedFileRef.current) {
        throw new Error("Upload a video before generating a transcript.");
      }

      const result = await requestTranscription(uploadedFileRef.current);
      completeTranscriptWorkflow({
        mode: "real",
        notice: "Real AI transcript is ready.",
        transcript: result,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Real AI transcription could not be completed.";
      const code =
        error instanceof TranscriptionRequestError
          ? error.code
          : "transcription_failed";

      setTranscriptionMode("failed");
      setTranscriptionNotice(message);
      setTranscriptionErrorCode(code);
      setActiveTranscriptionStep("Ready");
      setProjectStage("ready");
      setCurrentProject((project) =>
        project ? { ...project, status: "ready" } : project,
      );
    } finally {
      timers.forEach((timer) => window.clearTimeout(timer));
    }
  }

  async function handleUseMockTranscript() {
    if (!currentProject) {
      return;
    }

    setActiveTab("Captions");
    setActiveTranscriptionStep("Transcribing...");
    setTranscriptionMode("mock");
    setTranscriptionNotice("Using mock demo transcript.");
    setTranscriptionErrorCode(null);
    setProjectStage("transcribing");
    setCurrentProject((project) =>
      project ? { ...project, status: "transcribing" } : project,
    );

    try {
      const result = await generateMockTranscript();

      completeTranscriptWorkflow({
        mode: "mock",
        notice: "Mock demo transcript is ready.",
        transcript: result,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Mock demo transcript could not be generated.";

      setTranscriptionMode("failed");
      setTranscriptionNotice(message);
      setTranscriptionErrorCode("transcription_failed");
      setActiveTranscriptionStep("Ready");
      setProjectStage("ready");
      setCurrentProject((project) =>
        project ? { ...project, status: "ready" } : project,
      );
    }
  }

  function completeTranscriptWorkflow({
    mode,
    notice,
    transcript,
  }: {
    mode: Exclude<TranscriptionMode, "idle" | "failed">;
    notice: string;
    transcript: TranscriptResult;
  }) {
    if (!currentProject) {
      return;
    }

    const captionProject = generateCaptionProject({
      project: currentProject,
      transcript,
    });
    const directorAnalysis = analyzeCreativeDirection({
      captionBlocks: captionProject.captionBlocks,
      project: currentProject,
      transcript,
    });

    setTranscript(transcript);
    setCaptionBlocks(captionProject.captionBlocks);
    setCaptionProject(captionProject);
    setCaptionStatistics(captionProject.statistics);
    dispatch(appActions.updateDirector(directorAnalysis));
    setAppliedHighlightWordIds([]);
    setSelectedCaptionId(null);
    setShowCaptionsOnPreview(true);
    setActiveTranscriptionStep("Ready");
    setTranscriptionMode(mode);
    setTranscriptionNotice(notice);
    setTranscriptionErrorCode(null);
    setProjectStage("transcript_ready");
    setActiveTab("Captions");
    setCurrentProject((project) =>
      project ? { ...project, status: "transcript_ready" } : project,
    );
  }

  function handleRestoreSavedProject(savedProject: SavedProject) {
    const restoredProject = restoreProjectMetadata(savedProject);

    setCurrentProject(restoredProject);
    setUploadedVideoFile(null);
    setTranscript(savedProject.transcript);
    setCaptionBlocks(savedProject.captionBlocks);
    setCaptionProject(savedProject.captionProject);
    setCaptionStatistics(savedProject.captionProject?.statistics ?? null);
    setSelectedCaptionStyle(savedProject.selectedStyle);
    setSelectedBrandPreset(savedProject.selectedBrand);
    setExportSettings(savedProject.exportSettings);
    setAppliedHighlightWordIds(savedProject.appliedHighlightWordIds);
    setSelectedCaptionId(null);
    setShowCaptionsOnPreview(true);
    setVideoCurrentTime(0);
    setVideoDuration(savedProject.transcript?.duration ?? 0);
    setProjectStage(savedProject.transcript ? "transcript_ready" : "ready");
    setActiveTranscriptionStep("Ready");
    setTranscriptionMode(savedProject.transcript ? "mock" : "idle");
    setTranscriptionNotice(
      savedProject.transcript
        ? "Using saved transcript data. Re-upload video to continue editing."
        : null,
    );
    setTranscriptionErrorCode(null);
    dispatch(appActions.updateDirector(savedProject.directorAnalysis));
    setActiveTab(savedProject.transcript ? "Captions" : "Analyze");
    setUploadError("Re-upload video to continue editing.");
  }

  return {
    activeAnalysisStep,
    activeTab,
    activeTranscriptionStep,
    analysisReady,
    currentProject,
    fileInputRef,
    handleDrop,
    handleFileInput,
    handleGenerateTranscript,
    handleUseMockTranscript,
    handleRestoreSavedProject,
    handleLoadedData,
    handlePreviewPanelClick,
    isTranscribing,
    isDragging,
    openFilePicker,
    projectStage,
    setActiveTab,
    setIsDragging,
    transcriptReady,
    transcriptionErrorCode,
    transcriptionMode,
    transcriptionNotice,
    transcript,
    uploadError,
  };
}
