import { useProject } from "@/src/features/project/ProjectContext";
import type { Project } from "@/src/types/project";
import type {
  TranscriptionMode,
  TranscriptionStep,
} from "@/src/types/project";

export function ProjectReadyPanel({
  isTranscribing,
  project,
  activeTranscriptionStep,
  onGenerateTranscript,
  onUseMockTranscript,
  transcriptReady,
  transcriptionMode,
  transcriptionNotice,
}: Readonly<{
  activeTranscriptionStep: TranscriptionStep;
  isTranscribing: boolean;
  project: Project;
  onGenerateTranscript: () => void;
  onUseMockTranscript: () => void;
  transcriptReady: boolean;
  transcriptionMode: TranscriptionMode;
  transcriptionNotice: string | null;
}>) {
  const { selectedBrandPreset, selectedWorkspaceClient } = useProject();
  const transcriptionModeLabel =
    transcriptionMode === "real"
      ? "Real AI"
      : transcriptionMode === "mock"
        ? "Mock Demo"
        : transcriptionMode === "failed"
          ? "Transcription failed"
          : "Not started";
  const detailRows = [
    ["Filename", project.filename],
    ["Client", selectedWorkspaceClient.projectLabel],
    ["Brand", selectedBrandPreset.brandName],
    ["Resolution", `${project.width} x ${project.height}`],
    ["Duration", project.duration],
    ["Aspect Ratio", project.aspectRatio],
    ["Orientation", project.orientation],
    ["File Size", project.filesize],
  ];

  return (
    <div className="relative z-10 w-full max-w-4xl rounded-[28px] border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Project Ready
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Ready for Captions
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            Sidekik has prepared this video for AI processing.
          </p>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
          {isTranscribing
            ? "Transcribing"
            : transcriptReady
              ? "Captions Ready"
              : "Ready for Captions"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          {project.thumbnail ? (
            <div
              aria-label="Thumbnail preview"
              className="aspect-video w-full bg-cover bg-center"
              role="img"
              style={{ backgroundImage: `url(${project.thumbnail})` }}
            />
          ) : (
            <div className="grid aspect-video place-items-center text-xs font-medium text-zinc-500">
              Thumbnail Preview
            </div>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {detailRows.map(([label, value]) => (
            <div
              className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.035] p-3"
              key={label}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="mt-1 truncate text-sm font-medium text-zinc-100">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Status
            </div>
            <div className="mt-1 text-sm font-medium text-emerald-200">
              {isTranscribing
                ? "Transcribing"
                : transcriptReady
                  ? "Captions Ready"
                  : "Ready for Captions"}
            </div>
          </div>
          <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-semibold text-zinc-300">
            {transcriptionModeLabel}
          </div>
        </div>
      </div>

      {isTranscribing && (
        <div className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-300/10 px-4 py-3 text-sm font-medium text-sky-100">
          {activeTranscriptionStep}
        </div>
      )}

      {transcriptionMode !== "idle" || transcriptionNotice ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
            transcriptionMode === "failed"
              ? "border-rose-300/20 bg-rose-300/10 text-rose-100"
              : transcriptionMode === "mock"
                ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
                : "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
          }`}
        >
          {transcriptionNotice ??
            (transcriptionMode === "real"
              ? "Real AI transcript is ready."
              : transcriptionMode === "mock"
                ? "Mock demo transcript is ready."
                : "Transcription failed.")}
        </div>
      ) : null}

      {transcriptionMode === "failed" ? (
        <button
          className="mt-3 w-full rounded-2xl border border-amber-300/25 bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isTranscribing}
          onClick={onUseMockTranscript}
          type="button"
        >
          Use Mock Transcript Instead
        </button>
      ) : null}

      <button
        className="mt-6 w-full rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-sky-950/30 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
        disabled={isTranscribing}
        onClick={onGenerateTranscript}
        type="button"
      >
        {isTranscribing
          ? "Transcribing..."
          : transcriptReady
            ? transcriptionMode === "mock"
              ? "Generate Real AI Captions"
              : "Regenerate Captions"
            : "Generate Captions"}
      </button>
    </div>
  );
}
