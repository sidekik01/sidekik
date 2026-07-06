"use client";

import {
  Check,
  Clock,
  Download,
  FileVideo,
  Info,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  defaultExportPreset,
  exportPresets,
} from "@/src/features/export/exportPresets";
import {
  defaultExportSettings,
  exportFormats,
} from "@/src/features/export/exportSettings";
import type {
  ExportFormat,
  ExportPreset,
} from "@/src/features/export/types";
import { useProject } from "@/src/features/project/ProjectContext";
import {
  createRenderJob,
  createFailedRenderJob,
  createVideoMetadata,
  prepareRenderPayload,
  validateMp4Render,
  validateRenderPreparation,
} from "@/src/services/rendering";
import { requestRenderedVideo } from "@/src/rendering/export/clientRender";

function formatDuration(value: number) {
  if (!value) {
    return "Not available";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function SummaryRow({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-medium text-zinc-100">
        {value}
      </div>
    </div>
  );
}

function ChecklistItem({
  isReady,
  label,
}: Readonly<{
  isReady: boolean;
  label: string;
}>) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/8 bg-zinc-900/80 px-3 py-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <span
        className={`grid size-6 place-items-center rounded-full ${
          isReady ? "bg-emerald-300 text-zinc-950" : "bg-zinc-800 text-zinc-500"
        }`}
      >
        <Check className="size-3.5" />
      </span>
    </div>
  );
}

export function ExportPanel() {
  const {
    appliedHighlightWordIds,
    captionBlocks,
    currentProject,
    exportMessage,
    exportSettings,
    renderError,
    renderJob,
    selectedCaptionStyle,
    setExportMessage,
    setExportSettings,
    setRenderError,
    setRenderJob,
    showCaptionsOnPreview,
    transcript,
    uploadedVideoFile,
    videoDuration,
  } = useProject();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(
    exportSettings.outputFormat,
  );
  const [selectedPreset, setSelectedPreset] =
    useState<ExportPreset>(defaultExportPreset);
  const videoLoaded = Boolean(currentProject?.objectUrl);
  const videoFileReady = Boolean(uploadedVideoFile);
  const transcriptReady = Boolean(transcript?.words.length);
  const captionsGenerated = captionBlocks.length > 0;
  const styleSelected = Boolean(selectedCaptionStyle);
  const timelineReady = captionsGenerated && videoLoaded;
  const currentExportSettings = useMemo(
    () => ({
      outputFormat: selectedFormat,
      platform: selectedPreset.platform,
      presetId: selectedPreset.id,
    }),
    [selectedFormat, selectedPreset.id, selectedPreset.platform],
  );
  const warnings = useMemo(() => {
    const nextWarnings: string[] = [];

    if (!transcriptReady) {
      nextWarnings.push("No captions");
    }

    if (!styleSelected) {
      nextWarnings.push("No caption style selected");
    }

    if (!showCaptionsOnPreview) {
      nextWarnings.push("Captions are disabled on preview");
    }

    if (videoLoaded && !videoFileReady) {
      nextWarnings.push("Video file must be re-uploaded before rendering.");
    }

    const mp4Warning = validateMp4Render(currentExportSettings);

    if (mp4Warning) {
      nextWarnings.push(mp4Warning);
    }

    if (
      currentProject?.orientation &&
      currentProject.orientation !== selectedPreset.expectedOrientation
    ) {
      nextWarnings.push(
        "Your video format may need cropping or resizing for this platform.",
      );
    }

    return nextWarnings;
  }, [
    currentProject?.orientation,
    currentExportSettings,
    selectedPreset.expectedOrientation,
    showCaptionsOnPreview,
    styleSelected,
    transcriptReady,
    videoFileReady,
    videoLoaded,
  ]);
  const resolutionSummary = currentProject?.width
    ? `${currentProject.width} x ${currentProject.height} · ${currentProject.orientation}`
    : "Upload a video";
  const durationSummary = formatDuration(
    transcript?.duration || videoDuration || 0,
  );

  useEffect(() => {
    setSelectedFormat(exportSettings.outputFormat);

    const matchingPreset = exportPresets.find(
      (preset) => preset.id === exportSettings.presetId,
    );

    if (matchingPreset) {
      setSelectedPreset(matchingPreset);
    }
  }, [exportSettings.outputFormat, exportSettings.presetId]);

  useEffect(() => {
    setExportSettings(currentExportSettings);
  }, [
    currentExportSettings.outputFormat,
    currentExportSettings.platform,
    currentExportSettings.presetId,
    setExportSettings,
  ]);

  async function handlePrepareExport() {
    const renderDuration = transcript?.duration || videoDuration || 0;
    const videoMetadata = createVideoMetadata({
      durationSeconds: renderDuration,
      project: currentProject,
    });
    const renderInput = {
      appliedHighlightWordIds,
      captionBlocks,
      exportSettings: currentExportSettings,
      selectedCaptionStyle,
      videoDuration: renderDuration,
      videoFile: uploadedVideoFile,
      videoMetadata,
    };
    const errors = [
      ...validateRenderPreparation(renderInput),
      validateMp4Render(currentExportSettings),
    ].filter((error): error is string => Boolean(error));

    if (errors.length) {
      setRenderError(errors[0]);
      setRenderJob(
        createFailedRenderJob({
        error: errors[0],
          exportSettings: currentExportSettings,
          videoDuration: renderDuration,
        }),
      );
      return;
    }

    prepareRenderPayload(renderInput);
    setRenderError(null);
    setExportMessage("Preparing render job.");
    const nextJob = createRenderJob({
        captionBlocks,
        exportSettings: currentExportSettings,
      videoDuration: renderDuration,
    });

    setRenderJob(nextJob);

    try {
      setRenderJob((job) =>
        job
          ? {
              ...job,
              phase: "Rendering",
              progress: 25,
              status: "rendering",
            }
          : job,
      );
      setExportMessage("Rendering MP4 with Remotion.");

      const result = await requestRenderedVideo(renderInput);

      setRenderJob((job) =>
        job
          ? {
              ...job,
              phase: "Encoding",
              progress: 95,
              status: "encoding",
            }
          : job,
      );
      setRenderJob({
        ...result.job,
        phase: "Finished",
        progress: 100,
        status: "complete",
      });
      setExportMessage("Rendered MP4 is ready.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Rendering failed.";

      setRenderError(message);
      setExportMessage(null);
      setRenderJob(
        createFailedRenderJob({
          error: message,
          exportSettings: currentExportSettings,
          videoDuration: renderDuration,
        }),
      );
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-sky-300/15 bg-sky-300/10 p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-sky-300/15 text-sky-100">
            <FileVideo className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-sky-50">
              Export Prep
            </div>
            <p className="mt-1 text-sm leading-6 text-sky-100/70">
              Configure output settings and render a captioned MP4 locally.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Export Format
        </div>
        <div className="grid gap-2">
          {exportFormats.map((format) => (
            <button
              className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                selectedFormat === format
                  ? "border-sky-300/40 bg-sky-300/10 text-sky-100"
                  : "border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
              key={format}
              onClick={() => setSelectedFormat(format)}
              type="button"
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Platform Presets
        </div>
        <div className="grid gap-2">
          {exportPresets.map((preset) => (
            <button
              className={`rounded-2xl border p-3 text-left transition ${
                selectedPreset.id === preset.id
                  ? "border-violet-300/40 bg-violet-300/10 text-violet-100"
                  : "border-white/10 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-100">
                    {preset.platform}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {preset.aspectRatio} · {preset.recommendedResolution}
                  </div>
                </div>
                <div className="rounded-lg border border-white/8 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-zinc-500">
                  {preset.estimatedBitrate}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl bg-black/20 px-3 py-2 text-zinc-400">
                  Safe zone: {preset.captionSafeZone}
                </div>
                <div className="rounded-xl bg-black/20 px-3 py-2 text-zinc-400">
                  Caption: {preset.recommendedCaptionSize}
                </div>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                {preset.notes}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SummaryRow label="Resolution" value={resolutionSummary} />
        <SummaryRow
          label="Export Resolution"
          value={selectedPreset.recommendedResolution}
        />
        <SummaryRow label="Style" value={selectedCaptionStyle.name} />
        <SummaryRow
          label="Caption Position"
          value={selectedPreset.captionPositionRecommendation}
        />
        <SummaryRow label="Duration" value={durationSummary} />
        <SummaryRow label="Est. Bitrate" value={selectedPreset.estimatedBitrate} />
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          <Clock className="size-3.5" />
          Pre-export Checklist
        </div>
        <div className="space-y-2">
          <ChecklistItem isReady={videoLoaded} label="Video loaded" />
          <ChecklistItem isReady={transcriptReady} label="Captions ready" />
          <ChecklistItem isReady={captionsGenerated} label="Captions generated" />
          <ChecklistItem isReady={styleSelected} label="Style selected" />
          <ChecklistItem isReady={timelineReady} label="Timeline ready" />
        </div>
      </div>

      {warnings.length ? (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-100">
            <TriangleAlert className="size-4" />
            Export warnings
          </div>
          <div className="space-y-1">
            {warnings.map((warning) => (
              <div className="text-sm text-amber-100/80" key={warning}>
                {warning}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {renderError ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm font-medium text-red-100">
          <TriangleAlert className="size-4" />
          {renderError}
        </div>
      ) : exportMessage ? (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-medium text-emerald-100">
          <Info className="size-4" />
          {exportMessage}
        </div>
      ) : null}

      {renderJob ? (
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Rendering Queue
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-100">
                {renderJob.outputFormat} · {renderJob.platform}
              </div>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                renderJob.status === "complete"
                  ? "bg-emerald-300/10 text-emerald-200"
                  : renderJob.status === "failed"
                    ? "bg-red-300/10 text-red-200"
                    : "bg-sky-300/10 text-sky-200"
              }`}
            >
              {renderJob.phase}
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-300 transition-all duration-500"
              style={{ width: `${renderJob.progress}%` }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <SummaryRow label="Progress" value={`${renderJob.progress}%`} />
            <SummaryRow
              label="Estimated Duration"
              value={formatDuration(renderJob.estimatedDuration)}
            />
          </div>
          <div className="mt-3 truncate font-mono text-[10px] text-zinc-600">
            {renderJob.id} · {new Date(renderJob.createdAt).toLocaleTimeString()}
          </div>
          {renderJob.status === "complete" ? (
            <a
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
              download
              href={renderJob.downloadUrl}
            >
              <Download className="size-4" />
              Download Export
            </a>
          ) : null}
        </div>
      ) : null}

      <button
        className="w-full rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-sky-950/30 transition hover:bg-sky-300"
        data-render-video-button="true"
        onClick={handlePrepareExport}
        type="button"
      >
        Prepare Export
      </button>
    </div>
  );
}
