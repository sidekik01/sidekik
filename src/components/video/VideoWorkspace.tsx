"use client";

import type { ChangeEvent, DragEvent, MouseEvent, SyntheticEvent } from "react";
import { ProjectAnalysisCard } from "@/src/components/analysis/ProjectAnalysisCard";
import { ProjectReadyPanel } from "@/src/components/analysis/ProjectReadyPanel";
import { UploadPrompt } from "@/src/components/upload/UploadPrompt";
import { useProject } from "@/src/features/project/ProjectContext";
import type {
  AnalysisStep,
  Project,
  ProjectStage,
  TranscriptionMode,
  TranscriptionStep,
} from "@/src/types/project";

export function VideoWorkspace({
  activeAnalysisStep,
  activeTranscriptionStep,
  analysisReady,
  currentProject,
  fileInputRef,
  isTranscribing,
  isDragging,
  onDrop,
  onFileInput,
  onGenerateTranscript,
  onUseMockTranscript,
  onLoadedData,
  onOpenFilePicker,
  onPreviewClick,
  setIsDragging,
  transcriptReady,
  transcriptionMode,
  transcriptionNotice,
  uploadError,
  projectStage,
}: Readonly<{
  activeAnalysisStep: AnalysisStep;
  activeTranscriptionStep: TranscriptionStep;
  analysisReady: boolean;
  currentProject: Project | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isTranscribing: boolean;
  isDragging: boolean;
  onDrop: (event: DragEvent<HTMLElement>) => void;
  onFileInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onGenerateTranscript: () => void;
  onUseMockTranscript: () => void;
  onLoadedData: (event: SyntheticEvent<HTMLVideoElement>) => void;
  onOpenFilePicker: () => void;
  onPreviewClick: (event: MouseEvent<HTMLElement>) => void;
  setIsDragging: (value: boolean) => void;
  transcriptReady: boolean;
  transcriptionMode: TranscriptionMode;
  transcriptionNotice: string | null;
  uploadError: string | null;
  projectStage: ProjectStage;
}>) {
  const {
    appliedHighlightWordIds,
    captionBlocks,
    setShowCaptionsOnPreview,
    setVideoCurrentTime,
    setVideoDuration,
    setVideoIsPlaying,
    showCaptionsOnPreview,
    selectedCaptionStyle,
    transcript,
    videoCurrentTime,
    videoElementRef,
  } = useProject();
  const activeCaption =
    transcriptReady && showCaptionsOnPreview
      ? captionBlocks.find(
          (captionBlock) =>
            videoCurrentTime >= captionBlock.start &&
            videoCurrentTime <= captionBlock.end,
        )
      : null;
  const captionPositionClass =
    selectedCaptionStyle.position === "top"
      ? "top-[10%] items-start"
      : selectedCaptionStyle.position === "center"
        ? "top-1/2 -translate-y-1/2 items-center"
        : "bottom-[10%] items-end";
  const shadowOpacity = selectedCaptionStyle.shadowIntensity / 100;

  return (
    <section
      className={`flex min-h-[620px] flex-col rounded-[32px] border bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(24,24,27,0.88)_36%,rgba(7,8,11,0.95))] p-3 shadow-2xl shadow-black/35 backdrop-blur-xl transition duration-200 sm:p-4 ${
        isDragging
          ? "border-sky-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.35),0_28px_90px_rgba(14,165,233,0.16)]"
          : "border-white/10 hover:border-white/15"
      }`}
      onClick={onPreviewClick}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        const nextTarget = event.relatedTarget;

        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setIsDragging(false);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDrop={onDrop}
      onKeyDown={(event) => {
        if (
          projectStage === "empty" &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onOpenFilePicker();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between gap-4 px-2 pb-4">
        <div>
          <h2 className="text-sm font-black text-zinc-100">
            Video Preview
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            {projectStage === "analyzing"
              ? "Analyzing project"
              : analysisReady
                ? "Project ready"
                : currentProject?.width
                  ? `${currentProject.orientation} - ${currentProject.width} x ${currentProject.height}`
                  : "Drop or upload a video"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {transcriptReady ? (
            <label className="mr-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
              <input
                checked={showCaptionsOnPreview}
                className="size-3 accent-sky-400"
                onChange={(event) =>
                  setShowCaptionsOnPreview(event.target.checked)
                }
                type="checkbox"
              />
              Show Captions On Preview
            </label>
          ) : null}
          <span
            className={`size-2 rounded-full shadow-[0_0_16px_currentColor] ${
              analysisReady ? "bg-emerald-400" : "bg-sky-400"
            }`}
          />
          <span className="text-xs font-medium text-zinc-500">
            {projectStage === "analyzing"
              ? "Analyzing"
              : analysisReady
                ? "Project ready"
                : "Ready"}
          </span>
        </div>
      </div>

      <div
        className={`relative grid flex-1 place-items-center overflow-hidden rounded-[26px] border bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.10),transparent_34%),linear-gradient(135deg,#101217,#181b22_48%,#090a0d)] transition duration-200 ${
          isDragging
            ? "border-sky-300/70 shadow-[0_0_0_1px_rgba(125,211,252,0.35),0_24px_80px_rgba(14,165,233,0.14)]"
            : "border-white/10"
        }`}
      >
        <input
          accept=".mp4,.mov,.m4v,video/mp4,video/quicktime,video/x-m4v"
          className="hidden"
          onChange={onFileInput}
          ref={fileInputRef}
          type="file"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />
        <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-zinc-400 backdrop-blur">
          {currentProject?.width
            ? `${currentProject.orientation} - ${currentProject.width} x ${currentProject.height}`
            : "MP4, MOV, M4V"}
        </div>

        {projectStage === "analyzing" && currentProject ? (
          <>
            <video
              className="hidden"
              muted
              onLoadedData={onLoadedData}
              playsInline
              preload="metadata"
              src={currentProject.objectUrl}
            />
            <ProjectAnalysisCard activeStep={activeAnalysisStep} />
          </>
        ) : analysisReady && currentProject ? (
          <div className="relative z-10 flex size-full flex-col items-center justify-center gap-4 overflow-auto p-4 sm:p-6">
            <ProjectReadyPanel
              activeTranscriptionStep={activeTranscriptionStep}
              isTranscribing={isTranscribing}
              project={currentProject}
              onGenerateTranscript={onGenerateTranscript}
              onUseMockTranscript={onUseMockTranscript}
              transcriptReady={transcriptReady}
              transcriptionMode={transcriptionMode}
              transcriptionNotice={transcriptionNotice}
            />
            <div className="relative w-full max-w-4xl overflow-hidden rounded-[26px] border border-white/10 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.03)]">
              {currentProject.objectUrl ? (
                <video
                  className="max-h-[38vh] w-full bg-black"
                  controls
                  onLoadedMetadata={(event) => {
                    setVideoDuration(event.currentTarget.duration || 0);
                  }}
                  onPause={() => setVideoIsPlaying(false)}
                  onPlay={() => setVideoIsPlaying(true)}
                  onTimeUpdate={(event) => {
                    setVideoCurrentTime(event.currentTarget.currentTime);
                  }}
                  ref={videoElementRef}
                  src={currentProject.objectUrl}
                />
              ) : (
                <div className="grid min-h-[220px] place-items-center p-6 text-center">
                  <div>
                    <div className="text-lg font-black text-white">
                      Re-upload video to continue editing.
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Project setup was restored, but browsers cannot persist
                      the original video file between sessions.
                    </p>
                    <button
                      className="mt-5 rounded-2xl bg-sky-400 px-5 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-sky-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-300"
                      onClick={onOpenFilePicker}
                      type="button"
                    >
                      Re-upload Video
                    </button>
                  </div>
                </div>
              )}
              {activeCaption ? (
                <div
                  className={`pointer-events-none absolute inset-x-[8%] flex justify-center ${captionPositionClass}`}
                >
                  <div
                    className={`max-w-[86%] text-center font-black leading-tight ${
                      selectedCaptionStyle.backgroundBox
                        ? "rounded-2xl bg-black/55 px-4 py-2"
                        : "px-2 py-1"
                    }`}
                    style={{
                      color: selectedCaptionStyle.textColor,
                      fontFamily: selectedCaptionStyle.fontFamily,
                      fontSize: `clamp(18px, ${selectedCaptionStyle.fontSize / 16}vw, ${selectedCaptionStyle.fontSize}px)`,
                      textShadow: `0 2px 0 rgba(0,0,0,${Math.max(
                        shadowOpacity,
                        0.35,
                      )}), 0 0 ${
                        selectedCaptionStyle.shadowIntensity / 3.8
                      }px rgba(0,0,0,${Math.max(shadowOpacity, 0.25)})`,
                      textTransform: selectedCaptionStyle.textTransform,
                    }}
                  >
                    {activeCaption.text.split(/\s+/).map((word, index) => {
                      const timedWord = activeCaption.words[index];
                      const suggestedHighlightId = `${activeCaption.id}-word-${
                        index + 1
                      }`;
                      const isSuggestedHighlight =
                        appliedHighlightWordIds.includes(suggestedHighlightId);
                      const isActiveWord =
                        Boolean(timedWord) &&
                        videoCurrentTime >= timedWord.start &&
                        videoCurrentTime <= timedWord.end;
                      const shouldHighlight =
                        isSuggestedHighlight ||
                        (selectedCaptionStyle.activeWordHighlight &&
                          isActiveWord);
                      const showPill =
                        shouldHighlight &&
                        selectedCaptionStyle.activeWordHighlightMode ===
                          "background-pill";
                      const showScalePop =
                        shouldHighlight &&
                        selectedCaptionStyle.activeWordHighlightMode ===
                          "scale-pop";

                      return (
                        <span
                          className={`mx-1 inline-block rounded-xl transition ${
                            showPill ? "px-2 py-0.5" : ""
                          } ${showScalePop ? "scale-110" : ""}`}
                          key={`${activeCaption.id}-${index}-${word}`}
                          style={{
                            backgroundColor: showPill
                              ? selectedCaptionStyle.highlightColor
                              : undefined,
                            color: showPill
                              ? "#050505"
                              : shouldHighlight
                                ? selectedCaptionStyle.highlightColor
                                : undefined,
                            filter: shouldHighlight
                              ? `drop-shadow(0 0 10px ${selectedCaptionStyle.highlightColor})`
                              : undefined,
                          }}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <UploadPrompt
            onSelectVideo={onOpenFilePicker}
            uploadError={uploadError}
          />
        )}
      </div>
    </section>
  );
}
