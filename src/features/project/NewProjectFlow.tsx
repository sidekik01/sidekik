"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  FileVideo,
  ImagePlus,
  Upload,
} from "lucide-react";
import { AppShell } from "@/src/components/app/AppShell";
import { SurfaceCard } from "@/src/components/app/AppCards";
import { Button, Input, Select } from "@/src/components/ui";
import { analyzeCreativeDirection } from "@/src/features/director/directorEngine";
import { exportPresets } from "@/src/features/export/exportPresets";
import type { ExportPlatformPreset } from "@/src/features/export/types";
import { createSavedProject } from "@/src/features/project/projectSerializer";
import { saveProjectToStorage } from "@/src/features/project/projectStorage";
import { brandPresets } from "@/src/features/style/brandPresets";
import {
  captionPresetOptions,
  loadStoredBrandPresets,
  type CaptionPresetOption,
} from "@/src/features/style/brandBuilderStorage";
import { captionStylePresets } from "@/src/features/style/stylePresets";
import type { BrandPreset } from "@/src/features/style/types";
import {
  createProjectId,
  formatFileSize,
  isAcceptedVideo,
} from "@/src/services/analysis/videoAnalysis";
import type { Orientation, Project } from "@/src/types/project";

const platformOptions: ExportPlatformPreset[] = [
  "TikTok / Reels",
  "YouTube Shorts",
  "LinkedIn",
  "Meta Ads",
  "Landscape YouTube",
];

const customBrand: BrandPreset = {
  brandName: "No Brand / Custom",
  captionStylePreset: captionStylePresets[0],
  exportPreference: "TikTok / Reels",
  fontPreference: "Inter",
  highlightColor: "#38bdf8",
  id: "custom-project-brand",
  logoPlaceholder: "+",
  primaryColor: "#71717a",
  safeZonePreference: "standard",
};

type UploadedVideoSummary = {
  filename: string;
  filesize: string;
  orientation: Orientation;
};

function captionPresetToStyle(presetName: CaptionPresetOption) {
  if (presetName === "Creator Pop") {
    return captionStylePresets.find((preset) => preset.id === "creator-pop") ?? captionStylePresets[0];
  }

  if (presetName === "Bold") {
    return captionStylePresets.find((preset) => preset.id === "bold-opus") ?? captionStylePresets[0];
  }

  if (presetName === "Minimal" || presetName === "Podcast") {
    return captionStylePresets.find((preset) => preset.id === "minimal-pro") ?? captionStylePresets[0];
  }

  return captionStylePresets[0];
}

function getPlatformOrientation(platform: ExportPlatformPreset): Orientation {
  const preset = exportPresets.find((candidate) => candidate.platform === platform);

  return preset?.expectedOrientation ?? "Vertical Reel";
}

function getSupportedPlatform(platform: string): ExportPlatformPreset {
  return (
    platformOptions.find((candidate) => candidate === platform) ??
    "TikTok / Reels"
  );
}

export function NewProjectFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBrandId, setSelectedBrandId] = useState(customBrand.id);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideoSummary | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [platformPreset, setPlatformPreset] =
    useState<ExportPlatformPreset>("TikTok / Reels");
  const [captionPreset, setCaptionPreset] =
    useState<CaptionPresetOption>("Momentum Clean");
  const brandOptions = useMemo(
    () => [
      customBrand,
      ...loadStoredBrandPresets(),
      ...brandPresets.filter((brand) => brand.id !== "custom"),
    ],
    [],
  );
  const selectedBrand =
    brandOptions.find((brand) => brand.id === selectedBrandId) ?? customBrand;
  const selectedExportPreset =
    exportPresets.find((preset) => preset.platform === platformPreset) ??
    exportPresets[0];
  const selectedCaptionStyle = {
    ...captionPresetToStyle(captionPreset),
    highlightColor:
      selectedBrand.id === customBrand.id
        ? captionPresetToStyle(captionPreset).highlightColor
        : selectedBrand.highlightColor,
  };

  function handleVideoFile(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!isAcceptedVideo(file)) {
      setUploadError("Upload an MP4, MOV, or M4V video file.");
      return;
    }

    setUploadError(null);
    setUploadedVideo({
      filename: file.name,
      filesize: formatFileSize(file.size),
      orientation: getPlatformOrientation(platformPreset),
    });

    if (!projectName.trim()) {
      setProjectName(file.name.replace(/\.[^.]+$/, ""));
    }
  }

  function handleOpenEditor() {
    const id = createProjectId();
    const project: Project = {
      aspectRatio: selectedExportPreset.aspectRatio,
      audioDetected: "Detected placeholder",
      codec: "Codec unavailable",
      duration: "00:00",
      filename: projectName.trim() || uploadedVideo?.filename || "Untitled Project",
      filesize: uploadedVideo?.filesize ?? "0 KB",
      fps: "Unavailable",
      height: 0,
      id,
      objectUrl: "",
      orientation: uploadedVideo?.orientation ?? selectedExportPreset.expectedOrientation,
      status: "ready",
      thumbnail: "",
      width: 0,
    };
    const directorAnalysis = analyzeCreativeDirection({
      captionBlocks: [],
      project,
      transcript: null,
    });
    const savedProject = createSavedProject({
      appliedHighlightWordIds: [],
      captionBlocks: [],
      captionProject: null,
      currentProject: project,
      directorAnalysis,
      exportSettings: {
        outputFormat: "MP4",
        platform: platformPreset,
        presetId: selectedExportPreset.id,
      },
      selectedBrand,
      selectedStyle: selectedCaptionStyle,
      transcript: null,
    });

    const savedProjects = saveProjectToStorage(savedProject);

    if (!savedProjects.some((project) => project.id === id)) {
      setFlowError(
        "Project was created, but localStorage is unavailable. The editor will open without saved project recovery.",
      );
    }

    router.push(`/editor/${id}`);
  }

  return (
    <AppShell
      activePath="/projects"
      eyebrow="New Project"
      title="Create a Sidekik project"
    >
      <div className="mx-auto max-w-6xl space-y-5">
        <SurfaceCard>
          <div className="grid gap-3 md:grid-cols-3">
            {["Choose Brand", "Upload Video", "Project Setup"].map(
              (step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isComplete =
                  stepNumber === 1
                    ? Boolean(selectedBrand)
                    : stepNumber === 2
                      ? Boolean(uploadedVideo)
                      : Boolean(projectName.trim());

                return (
                  <button
                    className={`rounded-3xl border p-4 text-left transition ${
                      isActive
                        ? "border-sky-300/35 bg-sky-300/10"
                        : isComplete
                          ? "border-emerald-300/20 bg-emerald-300/10"
                          : "border-white/10 bg-white/[0.035]"
                    }`}
                    key={step}
                    onClick={() => setCurrentStep(stepNumber)}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid size-8 place-items-center rounded-full text-xs font-black ${
                          isComplete
                            ? "bg-emerald-300 text-zinc-950"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {isComplete ? <Check className="size-4" /> : stepNumber}
                      </span>
                      <span className="font-black text-zinc-100">{step}</span>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </SurfaceCard>

        {currentStep === 1 ? (
          <SurfaceCard>
            <div className="mb-5 flex flex-col gap-2">
              <h2 className="text-2xl font-black text-white">
                Step 1 — Choose Brand
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                Pick a saved brand or start with No Brand / Custom. Brand
                selection will apply caption styling and export preferences.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {brandOptions.map((brand) => {
                const isSelected = selectedBrand.id === brand.id;

                return (
                  <button
                    className={`rounded-3xl border p-4 text-left transition ${
                      isSelected
                        ? "border-sky-300/40 bg-sky-300/10"
                        : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06]"
                    }`}
                    key={brand.id}
                    onClick={() => {
                      setSelectedBrandId(brand.id);
                      setPlatformPreset(getSupportedPlatform(brand.exportPreference));
                      setCaptionPreset(
                        captionPresetOptions.find(
                          (option) => option === brand.captionStylePreset.name,
                        ) ?? "Momentum Clean",
                      );
                    }}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="grid size-12 place-items-center rounded-2xl text-sm font-black text-white"
                        style={{ backgroundColor: brand.primaryColor }}
                      >
                        {brand.logoPlaceholder}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-black text-white">
                          {brand.brandName}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {brand.exportPreference}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Selected Brand Summary
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div className="font-bold text-zinc-100">
                  {selectedBrand.brandName}
                </div>
                <div className="text-sm text-zinc-400">
                  Caption: {selectedBrand.captionStylePreset.name}
                </div>
                <div className="text-sm text-zinc-400">
                  Platform: {selectedBrand.exportPreference}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button onClick={() => setCurrentStep(2)} variant="primary">
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </SurfaceCard>
        ) : null}

        {currentStep === 2 ? (
          <SurfaceCard>
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">
                Step 2 — Upload Video
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Supported formats: MP4, MOV, M4V.
              </p>
            </div>
            <label
              className="grid min-h-[260px] cursor-pointer place-items-center rounded-[28px] border border-dashed border-sky-300/25 bg-sky-300/5 p-6 text-center transition hover:bg-sky-300/10"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleVideoFile(event.dataTransfer.files[0]);
              }}
            >
              <input
                accept=".mp4,.mov,.m4v,video/mp4,video/quicktime,video/x-m4v"
                className="hidden"
                onChange={(event) => handleVideoFile(event.target.files?.[0])}
                type="file"
              />
              <div>
                <div className="mx-auto grid size-14 place-items-center rounded-3xl border border-sky-300/20 bg-sky-300/10 text-sky-100">
                  <Upload className="size-6" />
                </div>
                <div className="mt-4 text-lg font-black text-white">
                  Drop your video here
                </div>
                <div className="mt-2 text-sm text-zinc-500">
                  Or click to choose a file.
                </div>
              </div>
            </label>
            {uploadError ? (
              <div className="mt-4 rounded-2xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm font-semibold text-red-100">
                {uploadError}
              </div>
            ) : null}
            {uploadedVideo ? (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <div className="text-xs text-zinc-500">File name</div>
                  <div className="mt-1 truncate font-bold text-zinc-100">
                    {uploadedVideo.filename}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <div className="text-xs text-zinc-500">File size</div>
                  <div className="mt-1 font-bold text-zinc-100">
                    {uploadedVideo.filesize}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <div className="text-xs text-zinc-500">
                    Detected orientation
                  </div>
                  <div className="mt-1 font-bold text-zinc-100">
                    {uploadedVideo.orientation} placeholder
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-5 flex justify-between gap-3">
              <Button onClick={() => setCurrentStep(1)} variant="ghost">
                Back
              </Button>
              <Button
                disabled={!uploadedVideo}
                onClick={() => setCurrentStep(3)}
                variant="primary"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </SurfaceCard>
        ) : null}

        {currentStep === 3 ? (
          <SurfaceCard>
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">
                Step 3 — Project Setup
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Confirm the project defaults before opening the editor.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-semibold text-zinc-400">
                  Project name
                </span>
                <Input
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="My first Sidekik project"
                  value={projectName}
                />
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold text-zinc-400">
                  Platform preset
                </span>
                <Select
                  onChange={(event) =>
                    setPlatformPreset(event.target.value as ExportPlatformPreset)
                  }
                  value={platformPreset}
                >
                  {platformOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold text-zinc-400">
                  Caption preset
                </span>
                <Select
                  onChange={(event) =>
                    setCaptionPreset(event.target.value as CaptionPresetOption)
                  }
                  value={captionPreset}
                >
                  {captionPresetOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </label>
              <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-zinc-900 text-zinc-500">
                    <ImagePlus className="size-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-100">
                      {selectedBrand.brandName}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Highlight {selectedBrand.highlightColor}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-between gap-3">
              <Button onClick={() => setCurrentStep(2)} variant="ghost">
                Back
              </Button>
              <Button
                disabled={!projectName.trim() || !uploadedVideo}
                onClick={handleOpenEditor}
                size="lg"
                variant="primary"
              >
                <FileVideo className="size-4" />
                Open Editor
              </Button>
            </div>
            {flowError ? (
              <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100">
                {flowError}
              </div>
            ) : null}
          </SurfaceCard>
        ) : null}
      </div>
    </AppShell>
  );
}
