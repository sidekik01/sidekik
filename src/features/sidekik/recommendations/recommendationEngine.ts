import type {
  SidekikAction,
  SidekikBrandNote,
  SidekikCreativeSettings,
  SidekikInsight,
  SidekikPlatformNote,
} from "../types/types";
import type { SidekikVideoAnalysis } from "../analysis/videoAnalyzer";
import type { ExportPreset, ExportSettings } from "@/src/features/export/types";
import type { BrandPreset } from "@/src/features/style/types";
import type { Project } from "@/src/types/project";

function createInsight(
  id: string,
  title: string,
  description: string,
  severity: SidekikInsight["severity"],
  source: SidekikInsight["source"],
): SidekikInsight {
  return { description, id, severity, source, title };
}

export function getSidekikInsights({
  creativeSettings,
  videoAnalysis,
}: {
  creativeSettings: SidekikCreativeSettings;
  videoAnalysis: SidekikVideoAnalysis;
}) {
  const strengths: SidekikInsight[] = [];
  const opportunities: SidekikInsight[] = [];
  const warnings: SidekikInsight[] = [];

  if (videoAnalysis.hasProject) {
    strengths.push(
      createInsight(
        "project-loaded",
        "Project metadata is ready",
        "Sidekik has video orientation, resolution, and duration available for downstream analysis.",
        "strength",
        "project",
      ),
    );
  } else {
    warnings.push(
      createInsight(
        "project-missing",
        "Video is required",
        "Upload a video before Sidekik can prepare creative guidance.",
        "warning",
        "project",
      ),
    );
  }

  if (videoAnalysis.hasTranscript) {
    strengths.push(
      createInsight(
        "transcript-ready",
        "Transcript is available",
        "Word-level transcript data can power caption timing, highlights, and creative review.",
        "strength",
        "transcript",
      ),
    );
  } else {
    opportunities.push(
      createInsight(
        "transcript-needed",
        "Generate a transcript",
        "Transcript data unlocks Sidekik recommendations for pacing, captions, and spoken hooks.",
        "opportunity",
        "transcript",
      ),
    );
  }

  if (videoAnalysis.hasCaptions && videoAnalysis.averageCaptionLength <= 5) {
    strengths.push(
      createInsight(
        "captions-readable",
        "Captions are easy to scan",
        "Average caption length is within the short-form readability range.",
        "strength",
        "captions",
      ),
    );
  }

  if (videoAnalysis.averageCaptionLength > 6) {
    warnings.push(
      createInsight(
        "captions-dense",
        "Captions may be dense",
        "Average caption length is above the recommended mobile viewing range.",
        "warning",
        "captions",
      ),
    );
  }

  if (!creativeSettings.activeWordHighlightEnabled && videoAnalysis.hasCaptions) {
    opportunities.push(
      createInsight(
        "highlight-opportunity",
        "Active word highlighting is off",
        "Turning it on can improve scan speed without changing the transcript.",
        "opportunity",
        "captions",
      ),
    );
  }

  return { opportunities, strengths, warnings };
}

export function getRecommendedActions({
  creativeSettings,
  videoAnalysis,
}: {
  creativeSettings: SidekikCreativeSettings;
  videoAnalysis: SidekikVideoAnalysis;
}): SidekikAction[] {
  const actions: SidekikAction[] = [];

  if (!videoAnalysis.hasTranscript) {
    actions.push({
      autoFixAvailable: false,
      category: "workflow",
      description: "Generate transcript data so Sidekik can analyze spoken pacing and caption structure.",
      id: "generate-transcript",
      priority: "high",
      title: "Generate transcript",
    });
  }

  if (videoAnalysis.averageCaptionLength > 6) {
    actions.push({
      autoFixAvailable: true,
      category: "captions",
      description: "Rebuild captions into shorter blocks for mobile readability.",
      id: "shorten-caption-blocks",
      priority: "medium",
      title: "Shorten caption blocks",
    });
  }

  if (!creativeSettings.captionStyle) {
    actions.push({
      autoFixAvailable: false,
      category: "style",
      description: "Choose a caption style before export so previews and platform checks are complete.",
      id: "select-caption-style",
      priority: "medium",
      title: "Select caption style",
    });
  }

  return actions;
}

export function getPlatformNotes({
  exportTarget,
  project,
}: {
  exportTarget: ExportSettings | ExportPreset | null;
  project: Project | null;
}): SidekikPlatformNote[] {
  if (!exportTarget) {
    return [
      {
        id: "platform-missing",
        note: "Choose an export target before platform guidance is available.",
        platform: "Not selected",
        status: "missing",
      },
    ];
  }

  const platform = "platform" in exportTarget ? exportTarget.platform : "Selected export";
  const expectedOrientation =
    "expectedOrientation" in exportTarget ? exportTarget.expectedOrientation : null;
  const orientationMismatch =
    Boolean(expectedOrientation && project && project.orientation !== expectedOrientation);

  return [
    {
      id: "platform-orientation",
      note: orientationMismatch
        ? "The selected platform may require cropping or resizing for best results."
        : "The current project format is aligned with the selected export target.",
      platform,
      status: orientationMismatch ? "review" : "aligned",
    },
  ];
}

export function getBrandNotes({
  brand,
  creativeSettings,
}: {
  brand: BrandPreset | null;
  creativeSettings: SidekikCreativeSettings;
}): SidekikBrandNote[] {
  if (!brand) {
    return [
      {
        brandName: "No brand selected",
        id: "brand-missing",
        note: "Select a brand preset before brand checks are available.",
        status: "missing",
      },
    ];
  }

  const styleAligned =
    creativeSettings.captionStyle?.id === brand.captionStylePreset.id ||
    creativeSettings.captionStyle?.highlightColor === brand.highlightColor;

  return [
    {
      brandName: brand.brandName,
      id: "brand-style-alignment",
      note: styleAligned
        ? "Caption style is aligned with the selected brand preset."
        : "Caption style differs from the selected brand preset.",
      status: styleAligned ? "aligned" : "review",
    },
  ];
}
