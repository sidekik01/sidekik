import type {
  DirectorCategory,
  DirectorCategoryResult,
  DirectorMetrics,
  DirectorRecommendation,
  DirectorStatus,
} from "./types";

function getStatus(score: number): DirectorStatus {
  if (score >= 82) {
    return "passed";
  }

  if (score >= 68) {
    return "suggestion";
  }

  return "warning";
}

function createRecommendation({
  autoFixAvailable = false,
  category,
  description,
  id,
  severity,
  suggestedFix,
  title,
}: DirectorRecommendation): DirectorRecommendation {
  return {
    autoFixAvailable,
    category,
    description,
    id,
    severity,
    suggestedFix,
    title,
  };
}

function createCategoryResult({
  category,
  recommendations,
  score,
}: {
  category: DirectorCategory;
  recommendations: DirectorRecommendation[];
  score: number;
}): DirectorCategoryResult {
  return {
    category,
    recommendations,
    score,
    status: getStatus(score),
  };
}

export function evaluateHook(metrics: DirectorMetrics): DirectorCategoryResult {
  const score = Math.max(0, Math.min(100, 92 - Math.max(metrics.firstCaptionWords - 5, 0) * 9));
  const recommendations: DirectorRecommendation[] =
    metrics.firstCaptionWords > 6
      ? [
          createRecommendation({
            autoFixAvailable: false,
            category: "Hook",
            description:
              "The first caption is carrying too many words for a fast opening beat.",
            id: "hook-first-caption-long",
            severity: "warning",
            suggestedFix:
              "Split the first caption or trim it to one clear idea in the opening second.",
            title: "Shorten the opening caption",
          }),
        ]
      : [
          createRecommendation({
            autoFixAvailable: false,
            category: "Hook",
            description:
              "The opening caption is short enough to scan quickly.",
            id: "hook-opening-clear",
            severity: "passed",
            suggestedFix: "Keep the first caption direct and benefit-led.",
            title: "Opening caption is readable",
          }),
        ];

  return createCategoryResult({
    category: "Hook",
    recommendations,
    score,
  });
}

export function evaluateReadability(
  metrics: DirectorMetrics,
): DirectorCategoryResult {
  const score = Math.max(
    0,
    Math.min(100, 96 - Math.max(metrics.averageCaptionLength - 4.5, 0) * 13),
  );
  const recommendations: DirectorRecommendation[] =
    metrics.averageCaptionLength > 6
      ? [
          createRecommendation({
            autoFixAvailable: true,
            category: "Readability",
            description:
              "Average caption length is high for mobile-first scanning.",
            id: "readability-average-length",
            severity: "suggestion",
            suggestedFix:
              "Regenerate or split captions toward 3 to 5 words per block.",
            title: "Reduce words per caption",
          }),
        ]
      : [
          createRecommendation({
            autoFixAvailable: false,
            category: "Readability",
            description: "Captions are easy to read at the current grouping.",
            id: "readability-clean",
            severity: "passed",
            suggestedFix: "Keep this caption density for the first edit pass.",
            title: "Captions are easy to read",
          }),
        ];

  return createCategoryResult({
    category: "Readability",
    recommendations,
    score,
  });
}

export function evaluatePacing(metrics: DirectorMetrics): DirectorCategoryResult {
  const score = Math.max(
    0,
    Math.min(100, 94 - Math.max(metrics.wordsPerMinute - 165, 0) * 0.85),
  );
  const recommendations: DirectorRecommendation[] =
    metrics.wordsPerMinute > 180
      ? [
          createRecommendation({
            autoFixAvailable: false,
            category: "Pacing",
            description:
              "Speaking speed is high, which can make captions feel rushed on mobile.",
            id: "pacing-speaking-speed",
            severity: "warning",
            suggestedFix:
              "Use shorter caption blocks and consider cutting pauses around key moments.",
            title: "Reading speed is high",
          }),
        ]
      : [
          createRecommendation({
            autoFixAvailable: false,
            category: "Pacing",
            description: "The transcript pacing is comfortable for review.",
            id: "pacing-balanced",
            severity: "passed",
            suggestedFix: "Keep captions aligned tightly with speech beats.",
            title: "Pacing looks balanced",
          }),
        ];

  return createCategoryResult({
    category: "Pacing",
    recommendations,
    score,
  });
}

export function evaluateCaptions(
  metrics: DirectorMetrics,
): DirectorCategoryResult {
  const longPenalty = Math.max(metrics.averageCaptionDuration - 2.5, 0) * 18;
  const shortPenalty = Math.max(0.55 - metrics.shortestCaptionDuration, 0) * 20;
  const score = Math.max(0, Math.min(100, 95 - longPenalty - shortPenalty));
  const recommendations: DirectorRecommendation[] = [];

  if (metrics.averageCaptionDuration > 2.5) {
    recommendations.push(
      createRecommendation({
        autoFixAvailable: true,
        category: "Captions",
        description:
          "Some captions are staying on screen longer than ideal for short-form pacing.",
        id: "captions-average-hold-long",
        severity: "suggestion",
        suggestedFix: "Split longer captions or regenerate blocks.",
        title: "Caption holds are long",
      }),
    );
  }

  if (metrics.shortestCaptionDuration > 0 && metrics.shortestCaptionDuration < 0.5) {
    recommendations.push(
      createRecommendation({
        autoFixAvailable: true,
        category: "Captions",
        description:
          "At least one caption may flash too quickly for comfortable reading.",
        id: "captions-short-flash",
        severity: "warning",
        suggestedFix: "Merge the shortest caption with the next caption.",
        title: "One caption is very short",
      }),
    );
  }

  if (!recommendations.length) {
    recommendations.push(
      createRecommendation({
        autoFixAvailable: false,
        category: "Captions",
        description: "Caption timing is within the expected short-form range.",
        id: "captions-timing-healthy",
        severity: "passed",
        suggestedFix: "Review selected moments for emphasis and brand tone.",
        title: "Caption timing is healthy",
      }),
    );
  }

  return createCategoryResult({
    category: "Captions",
    recommendations,
    score,
  });
}

export function evaluateCta(transcriptText: string): DirectorCategoryResult {
  const hasCta = /\b(comment|follow|subscribe|download|book|buy|shop|call|visit|learn|try|start|join|save|share)\b/i.test(
    transcriptText,
  );
  const score = hasCta ? 84 : 58;
  const recommendations = [
    createRecommendation({
      autoFixAvailable: false,
      category: "CTA",
      description: hasCta
        ? "The transcript includes language that points viewers toward a next step."
        : "No clear call to action was detected in the transcript.",
      id: hasCta ? "cta-detected" : "cta-missing",
      severity: hasCta ? "passed" : "suggestion",
      suggestedFix: hasCta
        ? "Make sure the CTA appears near the final caption or offer moment."
        : "Add a simple next step near the end, such as follow, book, buy, or learn more.",
      title: hasCta ? "CTA language detected" : "Consider adding a CTA",
    }),
  ];

  return createCategoryResult({
    category: "CTA",
    recommendations,
    score,
  });
}

export function evaluateAccessibility(
  metrics: DirectorMetrics,
): DirectorCategoryResult {
  const hasEnoughCaptions = metrics.captionCount > 0;
  const score = hasEnoughCaptions
    ? Math.max(0, Math.min(100, 88 - Math.max(metrics.longestCaptionWords - 8, 0) * 7))
    : 0;
  const recommendations: DirectorRecommendation[] = hasEnoughCaptions
    ? [
        createRecommendation({
          autoFixAvailable: false,
          category: "Accessibility",
          description:
            "Word-level captions are available, making the project more accessible without audio.",
          id: "accessibility-captions-present",
          severity: "passed",
          suggestedFix:
            "Keep contrast high and avoid placing captions under platform UI.",
          title: "Captions support silent viewing",
        }),
      ]
    : [
        createRecommendation({
          autoFixAvailable: false,
          category: "Accessibility",
          description:
            "Captions are not available yet, so silent viewing cannot be reviewed.",
          id: "accessibility-no-captions",
          severity: "warning",
          suggestedFix: "Generate a transcript and caption blocks first.",
          title: "Captions are required",
        }),
      ];

  if (metrics.longestCaptionWords > 8) {
    recommendations.push(
      createRecommendation({
        autoFixAvailable: true,
        category: "Accessibility",
        description:
          "The longest caption may be difficult for viewers with slower reading speed.",
        id: "accessibility-long-caption",
        severity: "suggestion",
        suggestedFix: "Split the longest caption into two shorter blocks.",
        title: "Long caption may reduce accessibility",
      }),
    );
  }

  return createCategoryResult({
    category: "Accessibility",
    recommendations,
    score,
  });
}

export function runDirectorRules({
  metrics,
  transcriptText,
}: {
  metrics: DirectorMetrics;
  transcriptText: string;
}): DirectorCategoryResult[] {
  return [
    evaluateHook(metrics),
    evaluateReadability(metrics),
    evaluatePacing(metrics),
    evaluateCaptions(metrics),
    evaluateCta(transcriptText),
    evaluateAccessibility(metrics),
  ];
}
