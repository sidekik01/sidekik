"use client";

import { useProject } from "@/src/features/project/ProjectContext";

export function ProjectDetailsSummary() {
  const { currentProject, selectedBrandPreset, selectedWorkspaceClient } =
    useProject();

  if (!currentProject) {
    return null;
  }

  const detailRows = [
    ["File", currentProject.filename],
    ["Client", selectedWorkspaceClient.projectLabel],
    ["Brand", selectedBrandPreset.brandName],
    ["Size", currentProject.filesize],
    ["Duration", currentProject.duration],
    ["Resolution", `${currentProject.width} x ${currentProject.height}`],
    ["Aspect", currentProject.aspectRatio],
    ["Orientation", currentProject.orientation],
    ["Audio", currentProject.audioDetected],
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Project Ready
        </p>
        <p className="mt-2 text-sm leading-6 text-emerald-50/90">
          Analysis complete. The project metadata is ready for the next
          workflow.
        </p>
      </div>
      <div className="grid gap-2">
        {currentProject.thumbnail && (
          <div
            aria-label="Thumbnail preview"
            className="aspect-video w-full rounded-2xl border border-white/10 bg-cover bg-center"
            role="img"
            style={{ backgroundImage: `url(${currentProject.thumbnail})` }}
          />
        )}
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
  );
}
