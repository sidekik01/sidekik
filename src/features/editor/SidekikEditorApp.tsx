"use client";

import { useEffect, useRef, useState } from "react";
import { RightSidebar } from "@/src/components/controls/RightSidebar";
import { AppHeader } from "@/src/components/layout/AppHeader";
import { ProjectNavigation } from "@/src/components/layout/ProjectNavigation";
import { Timeline } from "@/src/components/timeline/Timeline";
import { VideoWorkspace } from "@/src/components/video/VideoWorkspace";
import { useProjectAnalysis } from "@/src/hooks/useProjectAnalysis";
import { loadSavedProjects } from "@/src/features/project/projectStorage";
import { getMockSavedProject } from "@/src/features/project/mockSavedProjects";
import { AppProvider } from "@/src/state/AppProvider";

function SidekikEditor({
  projectId,
}: Readonly<{
  projectId?: string;
}>) {
  const [isProjectNavCollapsed, setIsProjectNavCollapsed] = useState(false);
  const projectAnalysis = useProjectAnalysis();
  const restoredProjectIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!projectId || restoredProjectIdRef.current === projectId) {
      return;
    }

    const savedProject =
      loadSavedProjects().find((project) => project.id === projectId) ??
      getMockSavedProject(projectId);

    if (!savedProject) {
      return;
    }

    restoredProjectIdRef.current = projectId;
    projectAnalysis.handleRestoreSavedProject(savedProject);
  }, [projectAnalysis, projectId]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#090a0d] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_86%_16%,rgba(168,85,247,0.13),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.055),transparent_35%)]" />

      <div className="relative flex min-h-screen flex-col">
        <AppHeader />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <ProjectNavigation
            isCollapsed={isProjectNavCollapsed}
            onRestoreSavedProject={projectAnalysis.handleRestoreSavedProject}
            onToggle={() =>
              setIsProjectNavCollapsed((currentValue) => !currentValue)
            }
          />

          <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
              <VideoWorkspace
                activeAnalysisStep={projectAnalysis.activeAnalysisStep}
                activeTranscriptionStep={projectAnalysis.activeTranscriptionStep}
                analysisReady={projectAnalysis.analysisReady}
                currentProject={projectAnalysis.currentProject}
                fileInputRef={projectAnalysis.fileInputRef}
                isDragging={projectAnalysis.isDragging}
                isTranscribing={projectAnalysis.isTranscribing}
                onDrop={projectAnalysis.handleDrop}
                onFileInput={projectAnalysis.handleFileInput}
                onGenerateTranscript={projectAnalysis.handleGenerateTranscript}
                onLoadedData={projectAnalysis.handleLoadedData}
                onOpenFilePicker={projectAnalysis.openFilePicker}
                onPreviewClick={projectAnalysis.handlePreviewPanelClick}
                onUseMockTranscript={projectAnalysis.handleUseMockTranscript}
                projectStage={projectAnalysis.projectStage}
                setIsDragging={projectAnalysis.setIsDragging}
                transcriptionMode={projectAnalysis.transcriptionMode}
                transcriptionNotice={projectAnalysis.transcriptionNotice}
                transcriptReady={projectAnalysis.transcriptReady}
                uploadError={projectAnalysis.uploadError}
              />

              <RightSidebar
                activeTab={projectAnalysis.activeTab}
                activeTranscriptionStep={projectAnalysis.activeTranscriptionStep}
                analysisReady={projectAnalysis.analysisReady}
                onRetryTranscription={projectAnalysis.handleGenerateTranscript}
                onTabChange={projectAnalysis.setActiveTab}
                onUseMockTranscript={projectAnalysis.handleUseMockTranscript}
                projectStage={projectAnalysis.projectStage}
                transcriptionErrorCode={projectAnalysis.transcriptionErrorCode}
                transcriptionMode={projectAnalysis.transcriptionMode}
                transcriptionNotice={projectAnalysis.transcriptionNotice}
              />
            </div>

            <Timeline />
          </div>
        </div>
      </div>
    </main>
  );
}

export function SidekikEditorApp({
  projectId,
}: Readonly<{
  projectId?: string;
}>) {
  return (
    <AppProvider>
      <SidekikEditor projectId={projectId} />
    </AppProvider>
  );
}
