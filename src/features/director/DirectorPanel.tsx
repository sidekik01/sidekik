"use client";

import {
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  History,
  Lightbulb,
  Sparkles,
  Wand2,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { analyzeCreativeDirection } from "@/src/features/director/directorEngine";
import {
  countMemoryEventsByType,
  getDirectorMemoryLabel,
  getRecentMemoryEvents,
} from "@/src/features/director/memory";
import { useProject } from "@/src/features/project/ProjectContext";
import { useAppContext } from "@/src/state/AppContext";
import type {
  DirectorCategoryResult,
  DirectorRecommendation,
} from "./types";

type RecommendationGroupId =
  | "High Priority"
  | "Recommended"
  | "Minor Improvements"
  | "Passed Checks";

const futureAnalysisModules = [
  "Hook Analysis",
  "Emotional Analysis",
  "Audience Retention",
  "Platform Optimization",
] as const;

function getScoreTone(score: number) {
  if (score >= 82) {
    return "text-emerald-100";
  }

  if (score >= 68) {
    return "text-sky-100";
  }

  return "text-amber-100";
}

function ScoreCard({
  category,
}: Readonly<{
  category: DirectorCategoryResult;
}>) {
  const statusClasses =
    category.status === "passed"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
      : category.status === "warning"
        ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
        : "border-sky-300/20 bg-sky-300/10 text-sky-100";

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          {category.category}
        </div>
        <div
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${statusClasses}`}
        >
          {category.status}
        </div>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className={`text-2xl font-semibold ${getScoreTone(category.score)}`}>
          {category.score}
        </div>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-300"
            style={{ width: `${category.score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation,
}: Readonly<{
  recommendation: DirectorRecommendation;
}>) {
  const isWarning = recommendation.severity === "warning";
  const isPassed = recommendation.severity === "passed";
  const toneClasses = isWarning
    ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
    : isPassed
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
      : "border-sky-300/20 bg-sky-300/10 text-sky-100";
  const Icon = isWarning ? TriangleAlert : isPassed ? CheckCircle2 : Lightbulb;

  return (
    <div className={`rounded-2xl border p-3 ${toneClasses}`}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold leading-5">
              {recommendation.title}
            </p>
            <span className="rounded-full border border-current/15 bg-black/10 px-2 py-0.5 text-[10px] font-semibold">
              {recommendation.category}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 opacity-80">
            {recommendation.description}
          </p>
          <div className="mt-3 rounded-xl border border-current/10 bg-black/10 px-3 py-2 text-xs leading-5 opacity-95">
            {recommendation.suggestedFix}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            {recommendation.autoFixAvailable ? (
              <span className="inline-flex rounded-full border border-current/15 bg-black/10 px-2 py-1 text-[10px] font-semibold">
                Auto-fix available later
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                Review manually
              </span>
            )}
            <button
              className="rounded-xl border border-current/20 bg-black/10 px-3 py-1.5 text-[11px] font-semibold transition hover:bg-black/20"
              type="button"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationGroup({
  count,
  isOpen,
  onToggle,
  recommendations,
  title,
}: Readonly<{
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  recommendations: DirectorRecommendation[];
  title: RecommendationGroupId;
}>) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.035]">
      <button
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
        onClick={onToggle}
        type="button"
      >
        <div>
          <div className="text-xs font-semibold text-zinc-100">{title}</div>
          <div className="mt-0.5 text-[11px] text-zinc-500">
            {count} {count === 1 ? "item" : "items"}
          </div>
        </div>
        <ChevronDown
          className={`size-4 text-zinc-500 transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {isOpen ? (
        <div className="space-y-2 border-t border-white/8 p-3">
          {recommendations.length ? (
            recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))
          ) : (
            <div className="rounded-xl border border-white/8 bg-zinc-900/80 p-3 text-sm leading-6 text-zinc-500">
              Nothing to review in this group yet.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SummaryMetric({
  label,
  value,
}: Readonly<{
  label: string;
  value: string | number;
}>) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-zinc-100">
        {value}
      </div>
    </div>
  );
}

function groupRecommendations(recommendations: DirectorRecommendation[]) {
  return {
    "High Priority": recommendations.filter(
      (recommendation) => recommendation.severity === "warning",
    ),
    Recommended: recommendations.filter(
      (recommendation) =>
        recommendation.severity === "suggestion" &&
        recommendation.autoFixAvailable,
    ),
    "Minor Improvements": recommendations.filter(
      (recommendation) =>
        recommendation.severity === "suggestion" &&
        !recommendation.autoFixAvailable,
    ),
    "Passed Checks": recommendations.filter(
      (recommendation) => recommendation.severity === "passed",
    ),
  } satisfies Record<RecommendationGroupId, DirectorRecommendation[]>;
}

export function DirectorPanel() {
  const { state } = useAppContext();
  const {
    appliedHighlightWordIds,
    captionProject,
    currentProject,
    setAppliedHighlightWordIds,
    transcript,
  } = useProject();
  const analysis = useMemo(
    () =>
      analyzeCreativeDirection({
        captionBlocks: captionProject?.captionBlocks ?? [],
        project: currentProject,
        transcript,
      }),
    [captionProject?.captionBlocks, currentProject, transcript],
  );
  const recommendationGroups = groupRecommendations(analysis.recommendations);
  const [openGroups, setOpenGroups] = useState<
    Record<RecommendationGroupId, boolean>
  >({
    "High Priority": true,
    "Minor Improvements": false,
    "Passed Checks": false,
    Recommended: true,
  });
  const suggestedHighlights = captionProject?.highlightedWords ?? [];
  const strengths = analysis.recommendations.filter(
    (recommendation) => recommendation.severity === "passed",
  );
  const opportunities = analysis.recommendations.filter(
    (recommendation) => recommendation.severity === "suggestion",
  );
  const warnings = analysis.recommendations.filter(
    (recommendation) => recommendation.severity === "warning",
  );
  const autoFixes = analysis.recommendations.filter(
    (recommendation) => recommendation.autoFixAvailable,
  );
  const recentMemoryEvents = getRecentMemoryEvents(state.director.memory, 4);
  const memoryEventTypes = [
    "caption_edit",
    "highlight_change",
    "timing_change",
    "style_change",
    "export_choice",
    "brand_choice",
  ] as const;

  function toggleGroup(groupId: RecommendationGroupId) {
    setOpenGroups((currentGroups) => ({
      ...currentGroups,
      [groupId]: !currentGroups[groupId],
    }));
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-violet-300/15 bg-violet-300/10 p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-violet-300/15 text-violet-100">
            <Clapperboard className="size-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-semibold text-violet-50">
              Sidekik Review
            </div>
            <p className="mt-1 text-sm leading-6 text-violet-100/70">
              Creative score, strengths, warnings, and recommendations for
              improving the video before export.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Project Summary
            </div>
            <div className="mt-1 truncate text-sm font-semibold text-zinc-100">
              {currentProject?.filename ?? "No project loaded"}
            </div>
          </div>
          <div className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-semibold text-violet-100">
            {analysis.scores.overall} Score
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SummaryMetric
            label="Duration"
            value={currentProject?.duration ?? "Not ready"}
          />
          <SummaryMetric
            label="Orientation"
            value={currentProject?.orientation ?? "Not ready"}
          />
          <SummaryMetric label="Word Count" value={analysis.metrics.transcriptWords} />
          <SummaryMetric
            label="Reading Speed"
            value={`${analysis.metrics.wordsPerMinute} WPM`}
          />
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Overall Creative Score
        </div>
        <div className="mt-3 text-6xl font-semibold text-white">
          {analysis.scores.overall}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-300"
            style={{ width: `${analysis.scores.overall}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {analysis.categories.map((category) => (
          <ScoreCard category={category} key={category.category} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SummaryMetric label="Strengths" value={strengths.length} />
        <SummaryMetric label="Opportunities" value={opportunities.length} />
        <SummaryMetric label="Warnings" value={warnings.length} />
        <SummaryMetric label="Auto Fixes" value={autoFixes.length} />
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Director Recommendations
          </div>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Deterministic checks grouped by priority for quick creative review.
          </p>
        </div>
        <div className="space-y-2">
          {(
            [
              "High Priority",
              "Recommended",
              "Minor Improvements",
              "Passed Checks",
            ] as RecommendationGroupId[]
          ).map((groupId) => (
            <RecommendationGroup
              count={recommendationGroups[groupId].length}
              isOpen={openGroups[groupId]}
              key={groupId}
              onToggle={() => toggleGroup(groupId)}
              recommendations={recommendationGroups[groupId]}
              title={groupId}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Future AI Analysis
        </div>
        <div className="grid gap-2">
          {futureAnalysisModules.map((moduleName) => (
            <div
              className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-zinc-900/80 px-3 py-2"
              key={moduleName}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Wand2 className="size-3.5 shrink-0 text-zinc-500" />
                <span className="truncate text-xs font-semibold text-zinc-300">
                  {moduleName}
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                Planned
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3 flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-sky-100">
            <History className="size-4" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100">
              Learning From Your Edits
            </div>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Edit history is being captured locally so future recommendations
              can learn from approved creative decisions. No AI is active here
              yet.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {memoryEventTypes.map((eventType) => (
            <div
              className="rounded-xl border border-white/8 bg-zinc-900/80 p-3"
              key={eventType}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                {getDirectorMemoryLabel(eventType)}
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-100">
                {countMemoryEventsByType(state.director.memory, eventType)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {recentMemoryEvents.length ? (
            recentMemoryEvents.map((event) => (
              <div
                className="rounded-xl border border-white/8 bg-black/20 px-3 py-2"
                key={event.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-xs font-semibold text-zinc-200">
                    {event.summary}
                  </div>
                  <div className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    {getDirectorMemoryLabel(event.type)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-white/8 bg-zinc-900/80 p-3 text-sm leading-6 text-zinc-500">
              Edit memory will appear after captions, styles, highlights, brand,
              or export choices change.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Suggested Highlight Words
            </div>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Rule-based emphasis picks for short-form caption styling.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-semibold text-zinc-500">
            {appliedHighlightWordIds.length}/{suggestedHighlights.length}
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            className="rounded-xl border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-300/15 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!suggestedHighlights.length}
            onClick={() =>
              setAppliedHighlightWordIds(
                suggestedHighlights.map((highlight) => highlight.id),
              )
            }
            type="button"
          >
            Apply All
          </button>
          <button
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!appliedHighlightWordIds.length}
            onClick={() => setAppliedHighlightWordIds([])}
            type="button"
          >
            Clear All
          </button>
        </div>

        {suggestedHighlights.length ? (
          <div className="max-h-64 space-y-2 overflow-auto pr-1">
            {suggestedHighlights.map((highlight) => {
              const isApplied = appliedHighlightWordIds.includes(highlight.id);

              return (
                <div
                  className={`rounded-xl border px-3 py-2 ${
                    isApplied
                      ? "border-sky-300/25 bg-sky-300/10"
                      : "border-white/8 bg-zinc-900/80"
                  }`}
                  key={highlight.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-zinc-100">
                      {highlight.word}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {highlight.confidence}%
                    </span>
                  </div>
                  <div className="mt-1 text-xs leading-5 text-zinc-500">
                    {highlight.reasons.join(" · ")}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-white/8 bg-zinc-900/80 p-3 text-sm leading-6 text-zinc-500">
            Generate captions to see highlight suggestions.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-sky-300/15 bg-sky-300/10 p-3">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-sky-100">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-sky-50">
              Ask Sidekik
            </div>
            <p className="mt-1 text-xs leading-5 text-sky-100/70">
              Chat-style creative guidance will appear here later. Sidekik will
              already know the project, transcript, caption blocks, brand,
              style, platform, and review score.
            </p>
            <div className="mt-3 rounded-xl border border-sky-300/15 bg-black/15 px-3 py-2 text-xs font-medium text-sky-100/60">
              Ask Sidekik is not connected yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
