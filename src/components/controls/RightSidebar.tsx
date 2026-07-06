"use client";

import { Check, Circle, Play } from "lucide-react";
import { ProjectDetailsSummary } from "@/src/components/analysis/ProjectDetailsSummary";
import { Badge, Button, EmptyState, LoadingState, Panel } from "@/src/components/ui";
import { useProject } from "@/src/features/project/ProjectContext";
import { DirectorPanel } from "@/src/features/director/DirectorPanel";
import { ExportPanel } from "@/src/features/export/ExportPanel";
import { StyleControls } from "@/src/features/style/StyleControls";
import { TranscriptPanel } from "@/src/features/transcript/TranscriptPanel";
import { tabs } from "@/src/types/project";
import { useAppContext } from "@/src/state/AppContext";
import type {
  ActiveTab,
  TranscriptionErrorCode,
  TranscriptionMode,
  ProjectStage,
  TranscriptionStep,
} from "@/src/types/project";

function PlaceholderTab({ label }: Readonly<{ label: ActiveTab }>) {
  return (
    <EmptyState title={`${label} tools`}>
      {label} tools will appear here in a future update.
    </EmptyState>
  );
}

type WorkflowStage = {
  id: ActiveTab;
  label: string;
  isComplete: boolean;
};

function WorkflowStages({
  activeTab,
  onTabChange,
  stages,
}: Readonly<{
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  stages: WorkflowStage[];
}>) {
  return (
    <div className="grid gap-2">
      {stages.map((stage, index) => {
        const isActive = activeTab === stage.id;

        return (
          <button
            className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
              isActive
                ? "border-sky-300/40 bg-sky-300/10 text-sky-100"
                : stage.isComplete
                  ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/15"
                  : "border-white/10 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
            }`}
            key={stage.id}
            onClick={() => onTabChange(stage.id)}
            type="button"
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-black ${
                isActive
                  ? "border-sky-300/40 bg-sky-300 text-zinc-950"
                  : stage.isComplete
                    ? "border-emerald-300/30 bg-emerald-300 text-zinc-950"
                    : "border-white/10 bg-zinc-900 text-zinc-500"
              }`}
            >
              {stage.isComplete ? <Check className="size-4" /> : index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{stage.label}</span>
              <span className="mt-0.5 block text-[11px] opacity-65">
                {isActive
                  ? "Active"
                  : stage.isComplete
                    ? "Complete"
                    : "Not complete"}
              </span>
            </span>
            {isActive ? (
              <Play className="size-3.5 shrink-0 fill-current" />
            ) : (
              <Circle className="size-3.5 shrink-0 opacity-40" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function RightSidebar({
  activeTab,
  activeTranscriptionStep,
  analysisReady,
  onTabChange,
  onRetryTranscription,
  onUseMockTranscript,
  projectStage,
  transcriptionErrorCode,
  transcriptionMode,
  transcriptionNotice,
}: Readonly<{
  activeTab: ActiveTab;
  activeTranscriptionStep: TranscriptionStep;
  analysisReady: boolean;
  onTabChange: (tab: ActiveTab) => void;
  onRetryTranscription: () => void;
  onUseMockTranscript: () => void;
  projectStage: ProjectStage;
  transcriptionErrorCode: TranscriptionErrorCode | null;
  transcriptionMode: TranscriptionMode;
  transcriptionNotice: string | null;
}>) {
  const {
    captionBlocks,
    currentProject,
    renderJob,
    selectedCaptionStyle,
    transcript,
  } = useProject();
  const { state } = useAppContext();
  const stages: WorkflowStage[] = tabs.map((tab) => {
    const isComplete =
      tab === "Analyze"
        ? analysisReady && Boolean(currentProject)
        : tab === "Captions"
          ? Boolean(transcript?.words.length && captionBlocks.length)
          : tab === "Style"
            ? Boolean(selectedCaptionStyle)
            : tab === "Review"
              ? Boolean(state.director.analysis && transcript?.words.length && captionBlocks.length)
              : renderJob?.status === "complete";

    return {
      id: tab,
      isComplete,
      label: tab,
    };
  });
  const nextStep =
    activeTab === "Analyze"
      ? { label: "Generate Captions", target: "Captions" as ActiveTab }
      : activeTab === "Captions"
        ? { label: "Choose Style", target: "Style" as ActiveTab }
        : activeTab === "Style"
          ? { label: "Review With Sidekik", target: "Review" as ActiveTab }
          : activeTab === "Review"
            ? { label: "Prepare Export", target: "Export" as ActiveTab }
            : { label: "Render Video", target: "Export" as ActiveTab };

  function handleNextStep() {
    if (activeTab === "Analyze") {
      if (analysisReady && currentProject) {
        onRetryTranscription();
      }

      return;
    }

    if (activeTab === "Export") {
      const renderButton = document.querySelector<HTMLButtonElement>(
        "[data-render-video-button='true']",
      );

      renderButton?.click();
      return;
    }

    onTabChange(nextStep.target);
  }

  return (
    <Panel as="aside" className="flex min-h-0 flex-col p-4">
      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Workflow
            </div>
            <div className="mt-1 text-sm font-black text-zinc-100">
              Finish your video
            </div>
          </div>
          <Badge>Draft</Badge>
        </div>
        <WorkflowStages
          activeTab={activeTab}
          onTabChange={onTabChange}
          stages={stages}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto pr-1">
        {activeTab === "Analyze" ? (
          analysisReady && currentProject ? (
            <ProjectDetailsSummary />
          ) : currentProject ? (
            <LoadingState title="Project analysis">
              Project analysis is running.
            </LoadingState>
          ) : (
            <EmptyState title="No video uploaded">
              Upload a video to begin project analysis.
            </EmptyState>
          )
        ) : activeTab === "Style" ? (
          <StyleControls />
        ) : activeTab === "Captions" ? (
          <TranscriptPanel
            activeTranscriptionStep={activeTranscriptionStep}
            onRetryTranscription={onRetryTranscription}
            onUseMockTranscript={onUseMockTranscript}
            projectStage={projectStage}
            transcriptionErrorCode={transcriptionErrorCode}
            transcriptionMode={transcriptionMode}
            transcriptionNotice={transcriptionNotice}
          />
        ) : activeTab === "Review" ? (
          <DirectorPanel />
        ) : activeTab === "Export" ? (
          <ExportPanel />
        ) : (
          <PlaceholderTab label={activeTab} />
        )}
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <Button
          className="w-full rounded-2xl"
          disabled={activeTab === "Analyze" && (!analysisReady || !currentProject)}
          onClick={handleNextStep}
          size="lg"
          variant="primary"
        >
          {nextStep.label}
        </Button>
      </div>
    </Panel>
  );
}
