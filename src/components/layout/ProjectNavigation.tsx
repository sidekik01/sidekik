"use client";

import {
  Archive,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  FolderClock,
  Image,
  Palette,
  Plus,
  Save,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { analyzeCreativeDirection } from "@/src/features/director/directorEngine";
import { exportPresets } from "@/src/features/export/exportPresets";
import { useProject } from "@/src/features/project/ProjectContext";
import {
  loadSavedProjects,
  saveProjectToStorage,
} from "@/src/features/project/projectStorage";
import { createSavedProject } from "@/src/features/project/projectSerializer";
import type { SavedProject } from "@/src/features/project/types";
import { brandPresets } from "@/src/features/style/brandPresets";
import { defaultWorkspaces } from "@/src/features/workspace/defaultWorkspaces";
import {
  loadWorkspaceSelection,
  saveWorkspaceSelection,
} from "@/src/features/workspace/workspaceStorage";
import type {
  ClientWorkspace,
  WorkspaceClient,
} from "@/src/features/workspace/workspaceTypes";

const navigationItems = [
  { label: "New Project", icon: Plus },
  { label: "Recent Projects", icon: FolderClock },
  { label: "Assets", icon: Image },
  { label: "Caption Styles", icon: Palette },
  { label: "Brand Presets", icon: BriefcaseBusiness },
  { label: "Settings", icon: Settings },
] as const;

export function ProjectNavigation({
  isCollapsed,
  onRestoreSavedProject,
  onToggle,
}: Readonly<{
  isCollapsed: boolean;
  onRestoreSavedProject: (savedProject: SavedProject) => void;
  onToggle: () => void;
}>) {
  const {
    appliedHighlightWordIds,
    captionBlocks,
    captionProject,
    currentProject,
    exportSettings,
    selectedBrandPreset,
    selectedCaptionStyle,
    selectedWorkspace,
    selectedWorkspaceClient,
    transcript,
    setExportSettings,
    setSelectedBrandPreset,
    setSelectedCaptionStyle,
    setSelectedWorkspace,
    setSelectedWorkspaceClient,
  } = useProject();
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [sidebarMessage, setSidebarMessage] = useState<string | null>(null);
  const directorAnalysis = useMemo(
    () =>
      analyzeCreativeDirection({
        captionBlocks,
        project: currentProject,
        transcript,
      }),
    [captionBlocks, currentProject, transcript],
  );

  useEffect(() => {
    setSavedProjects(loadSavedProjects());
    const storedSelection = loadWorkspaceSelection();
    const workspace =
      defaultWorkspaces.find(
        (candidate) => candidate.id === storedSelection?.workspaceId,
      ) ?? defaultWorkspaces[0];
    const client =
      workspace.clients.find(
        (candidate) => candidate.id === storedSelection?.clientId,
      ) ?? workspace.clients[0];

    handleSelectClient(workspace, client, false);
  }, []);

  function handleSelectClient(
    workspace: ClientWorkspace,
    client: WorkspaceClient,
    shouldAnnounce = true,
  ) {
    const brandPreset =
      brandPresets.find((brand) => brand.id === client.brandPresetId) ??
      brandPresets[0];
    const exportPreset =
      exportPresets.find(
        (preset) => preset.platform === brandPreset.exportPreference,
      ) ?? exportPresets[0];

    setSelectedWorkspace(workspace);
    setSelectedWorkspaceClient(client);
    setSelectedBrandPreset(brandPreset);
    setSelectedCaptionStyle({
      ...brandPreset.captionStylePreset,
      fontFamily: `${brandPreset.fontPreference}, Inter, Arial, sans-serif`,
      highlightColor: brandPreset.highlightColor,
    });
    setExportSettings((currentSettings) => ({
      ...currentSettings,
      platform: exportPreset.platform,
      presetId: exportPreset.id,
    }));
    saveWorkspaceSelection({
      clientId: client.id,
      workspaceId: workspace.id,
    });

    if (shouldAnnounce) {
      setSidebarMessage(`Client set to ${client.name}.`);
    }
  }

  function handleSaveProject() {
    if (!currentProject) {
      setSidebarMessage("Upload a video before saving a project.");
      return;
    }

    const savedProject = createSavedProject({
      appliedHighlightWordIds,
      captionBlocks,
      captionProject,
      currentProject,
      directorAnalysis,
      exportSettings,
      selectedBrand: selectedBrandPreset,
      selectedStyle: selectedCaptionStyle,
      transcript,
    });

    setSavedProjects(saveProjectToStorage(savedProject));
    setSidebarMessage("Project saved locally.");
  }

  function handleRestoreProject(savedProject: SavedProject) {
    onRestoreSavedProject(savedProject);
    setSidebarMessage("Video file must be re-uploaded for saved projects.");
  }

  return (
    <aside
      className={`flex min-h-0 shrink-0 flex-col border-r border-white/10 bg-zinc-950/75 px-3 py-4 shadow-2xl shadow-black/25 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? "w-[76px]" : "w-[260px]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-sky-300/20 bg-gradient-to-br from-sky-400/20 to-violet-500/15">
            <Archive className="size-5 text-sky-200" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Projects
              </p>
              <p className="truncate text-xs text-zinc-500">Editor library</p>
            </div>
          )}
        </div>
        <button
          aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-zinc-100"
          onClick={onToggle}
          type="button"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav className="mt-6 grid gap-1">
        {navigationItems.map(({ icon: Icon, label }, index) => {
          const isActive = index === 0;

          return (
            <button
              className={`flex h-11 items-center gap-3 rounded-2xl px-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-sky-400 text-zinc-950 shadow-lg shadow-sky-950/30"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
              } ${isCollapsed ? "justify-center" : ""}`}
              key={label}
              title={isCollapsed ? label : undefined}
              type="button"
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 grid gap-3">
        <button
          className={`flex h-11 items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 ${
            isCollapsed ? "justify-center" : ""
          }`}
          onClick={handleSaveProject}
          title={isCollapsed ? "Save Project" : undefined}
          type="button"
        >
          <Save className="size-4 shrink-0" aria-hidden="true" />
          {!isCollapsed && <span className="truncate">Save Project</span>}
        </button>

        {!isCollapsed && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-xl border border-sky-300/20 bg-sky-300/10">
                <Users className="size-4 text-sky-200" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Client Workspace
                </div>
                <div className="truncate text-sm font-semibold text-zinc-100">
                  {selectedWorkspace.name}
                </div>
              </div>
            </div>
            <div className="grid gap-1">
              {selectedWorkspace.clients.map((client) => {
                const isSelected = client.id === selectedWorkspaceClient.id;

                return (
                  <button
                    className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                      isSelected
                        ? "border border-sky-300/30 bg-sky-300/15 text-sky-100"
                        : "border border-transparent text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
                    }`}
                    key={client.id}
                    onClick={() =>
                      handleSelectClient(selectedWorkspace, client)
                    }
                    type="button"
                  >
                    <span className="truncate">{client.name}</span>
                    <span className="text-[10px] font-medium text-zinc-600">
                      {client.brandPresetId}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Recent Projects
              </div>
              <div className="font-mono text-[10px] text-zinc-600">
                {savedProjects.length}
              </div>
            </div>
            <div className="space-y-1">
              {savedProjects.length ? (
                savedProjects.map((savedProject) => (
                  <button
                    className="w-full rounded-xl px-2 py-2 text-left transition hover:bg-white/[0.05]"
                    key={savedProject.id}
                    onClick={() => handleRestoreProject(savedProject)}
                    type="button"
                  >
                    <div className="truncate text-xs font-semibold text-zinc-200">
                      {savedProject.name}
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-zinc-600">
                      {new Date(savedProject.savedAt).toLocaleString()}
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 text-xs leading-5 text-zinc-500">
                  Saved projects will appear here.
                </div>
              )}
            </div>
          </div>
        )}

        {!isCollapsed && sidebarMessage ? (
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100">
            {sidebarMessage}
          </div>
        ) : null}
      </div>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.035] p-3">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-violet-300 text-xs font-bold text-zinc-950">
            sk
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Workspace
              </p>
              <p className="truncate text-sm font-semibold text-zinc-100">
                {selectedWorkspace.name}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {selectedWorkspaceClient.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
