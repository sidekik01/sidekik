"use client";

import {
  AlertTriangle,
  CornerDownRight,
  GitMerge,
  RefreshCw,
  RotateCcw,
  Save,
  Scissors,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { generateCaptionProject } from "@/src/features/caption-engine/captionEngine";
import { useProject } from "@/src/features/project/ProjectContext";
import type {
  ProjectStage,
  TranscriptionErrorCode,
  TranscriptionMode,
  TranscriptionStep,
} from "@/src/types/project";
import type { CaptionBlock, TranscriptWord } from "@/src/types/transcript";

function formatTimestamp(value: number) {
  return `${value.toFixed(2)}s`;
}

function getWordDuration(entry: TranscriptWord) {
  return Math.max(entry.end - entry.start, 0);
}

function getCaptionDuration(entry: CaptionBlock) {
  return Math.max(entry.end - entry.start, 0);
}

function getWordsPerMinute(wordCount: number, duration: number) {
  if (!duration) {
    return 0;
  }

  return Math.round(wordCount / (duration / 60));
}

function getCaptionText(words: TranscriptWord[]) {
  return words.map((entry) => entry.word).join(" ");
}

function createCaptionBlockFromWords(
  id: string,
  words: TranscriptWord[],
): CaptionBlock {
  const firstWord = words[0];
  const lastWord = words.at(-1);

  return {
    end: lastWord?.end ?? 0,
    id,
    start: firstWord?.start ?? 0,
    text: getCaptionText(words),
    words,
  };
}

function getAverageCaptionTextLength(captionBlocks: CaptionBlock[]) {
  if (!captionBlocks.length) {
    return 0;
  }

  return (
    captionBlocks.reduce(
      (total, block) =>
        total + block.text.trim().split(/\s+/).filter(Boolean).length,
      0,
    ) / captionBlocks.length
  );
}

function getAverageCaptionDuration(captionBlocks: CaptionBlock[]) {
  if (!captionBlocks.length) {
    return 0;
  }

  return (
    captionBlocks.reduce(
      (totalDuration, block) => totalDuration + getCaptionDuration(block),
      0,
    ) / captionBlocks.length
  );
}

function getReadabilityLabel({
  averageCaptionDuration,
  averageWordsPerCaption,
  wordsPerMinute,
}: {
  averageCaptionDuration: number;
  averageWordsPerCaption: number;
  wordsPerMinute: number;
}) {
  if (
    wordsPerMinute >= 205 ||
    averageWordsPerCaption >= 8 ||
    (averageWordsPerCaption >= 6 && averageCaptionDuration < 1.2)
  ) {
    return "Too Dense";
  }

  if (wordsPerMinute >= 175 || averageWordsPerCaption >= 6.5) {
    return "Fast";
  }

  if (wordsPerMinute >= 120 || averageWordsPerCaption >= 4) {
    return "Good";
  }

  return "Easy";
}

function getTranscriptionErrorTitle(code: TranscriptionErrorCode | null) {
  switch (code) {
    case "missing_api_key":
      return "Missing OpenAI API key";
    case "unsupported_file_type":
      return "Unsupported file type";
    case "file_too_large":
      return "File too large";
    case "no_speech_detected":
      return "No speech detected";
    case "transcription_failed":
    default:
      return "Transcription failed";
  }
}

function TranscriptStateCard({
  children,
  eyebrow,
  tone = "neutral",
}: Readonly<{
  children: ReactNode;
  eyebrow: string;
  tone?: "neutral" | "active";
}>) {
  const toneClasses =
    tone === "active"
      ? "border-sky-300/20 bg-sky-300/10 text-sky-100"
      : "border-white/8 bg-white/[0.035] text-zinc-400";

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
        {eyebrow}
      </div>
      <div className="mt-3 text-sm leading-6">{children}</div>
    </div>
  );
}

export function TranscriptPanel({
  activeTranscriptionStep,
  onRetryTranscription,
  onUseMockTranscript,
  projectStage,
  transcriptionErrorCode,
  transcriptionMode,
  transcriptionNotice,
}: Readonly<{
  activeTranscriptionStep: TranscriptionStep;
  onRetryTranscription: () => void;
  onUseMockTranscript: () => void;
  projectStage: ProjectStage;
  transcriptionErrorCode: TranscriptionErrorCode | null;
  transcriptionMode: TranscriptionMode;
  transcriptionNotice: string | null;
}>) {
  const {
    captionBlocks,
    captionStatistics,
    currentProject,
    selectedCaptionId,
    setCaptionBlocks,
    setCaptionProject,
    setCaptionStatistics,
    setSelectedCaptionId,
    transcript,
    videoElementRef,
    setVideoCurrentTime,
  } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<TranscriptWord | null>(null);
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const [captionWarning, setCaptionWarning] = useState<string | null>(null);
  const transcriptWords = transcript?.words ?? [];
  const filteredWords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return transcriptWords;
    }

    return transcriptWords.filter((entry) =>
      entry.word.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery, transcriptWords]);
  const estimatedDuration = transcript?.duration ?? 0;
  const totalWords = transcriptWords.length;
  const wordsPerMinute =
    captionStatistics?.averageReadingSpeed ??
    getWordsPerMinute(totalWords, estimatedDuration);
  const averageCaptionLength = captionStatistics?.averageCaptionLength ?? 0;
  const averageCaptionDuration = getAverageCaptionDuration(captionBlocks);
  const averageWordsPerCaption = captionBlocks.length
    ? totalWords / captionBlocks.length
    : 0;
  const readability = getReadabilityLabel({
    averageCaptionDuration,
    averageWordsPerCaption,
    wordsPerMinute,
  });
  const transcriptionModeLabel =
    transcriptionMode === "real"
      ? "Real AI"
      : transcriptionMode === "mock"
        ? "Mock Demo"
        : "Not ready";
  const selectedCaption = captionBlocks.find(
    (entry) => entry.id === selectedCaptionId,
  );

  function handleRegenerateCaptionBlocks() {
    if (!currentProject || !transcript) {
      return;
    }

    const captionProject = generateCaptionProject({
      project: currentProject,
      transcript,
    });

    setCaptionBlocks(captionProject.captionBlocks);
    setCaptionProject(captionProject);
    setCaptionStatistics(captionProject.statistics);
    setSelectedCaptionId(null);
    setCaptionWarning(null);
  }

  function handleSelectCaption(captionBlock: CaptionBlock) {
    setSelectedCaptionId(captionBlock.id);
    setCaptionWarning(null);
    setVideoCurrentTime(captionBlock.start);

    if (videoElementRef.current) {
      videoElementRef.current.currentTime = captionBlock.start;
    }
  }

  function handleStartEditing(captionBlock: CaptionBlock) {
    handleSelectCaption(captionBlock);
    setEditingCaptionId(captionBlock.id);
    setCaptionDraft(captionBlock.text);
  }

  function handleCancelEditing() {
    setEditingCaptionId(null);
    setCaptionDraft("");
  }

  function handleSaveCaption(captionBlock: CaptionBlock) {
    const nextText = captionDraft.trim();

    if (!nextText) {
      return;
    }

    const nextCaptionBlocks = captionBlocks.map((block) =>
      block.id === captionBlock.id ? { ...block, text: nextText } : block,
    );
    applyCaptionBlocks(nextCaptionBlocks);
    setEditingCaptionId(null);
    setCaptionDraft("");
  }

  function applyCaptionBlocks(nextCaptionBlocks: CaptionBlock[]) {
    const nextAverageCaptionLength =
      getAverageCaptionTextLength(nextCaptionBlocks);
    const longestCaption = nextCaptionBlocks.reduce<CaptionBlock | null>(
      (longest, block) =>
        !longest || block.words.length > longest.words.length ? block : longest,
      null,
    );
    const shortestCaption = nextCaptionBlocks.reduce<CaptionBlock | null>(
      (shortest, block) =>
        !shortest || block.words.length < shortest.words.length
          ? block
          : shortest,
      null,
    );

    setCaptionBlocks(nextCaptionBlocks);
    setCaptionProject((captionProject) =>
      captionProject
        ? {
            ...captionProject,
            captionBlocks: nextCaptionBlocks,
            statistics: {
              ...captionProject.statistics,
              averageCaptionLength: nextAverageCaptionLength,
              longestCaption,
              shortestCaption,
            },
          }
        : captionProject,
    );
    setCaptionStatistics((statistics) =>
      statistics
        ? {
            ...statistics,
            averageCaptionLength: nextAverageCaptionLength,
            longestCaption,
            shortestCaption,
          }
        : statistics,
    );
  }

  function handleSplitCaption(captionBlock: CaptionBlock) {
    if (captionBlock.words.length < 2) {
      setCaptionWarning("Captions need at least 2 words before splitting.");
      return;
    }

    const blockIndex = captionBlocks.findIndex(
      (block) => block.id === captionBlock.id,
    );

    if (blockIndex < 0) {
      return;
    }

    const splitIndex = Math.ceil(captionBlock.words.length / 2);
    const firstWords = captionBlock.words.slice(0, splitIndex);
    const secondWords = captionBlock.words.slice(splitIndex);
    const firstBlock = createCaptionBlockFromWords(
      `${captionBlock.id}-a-${firstWords[0]?.start ?? 0}`,
      firstWords,
    );
    const secondBlock = createCaptionBlockFromWords(
      `${captionBlock.id}-b-${secondWords[0]?.start ?? 0}`,
      secondWords,
    );
    const nextCaptionBlocks = [
      ...captionBlocks.slice(0, blockIndex),
      firstBlock,
      secondBlock,
      ...captionBlocks.slice(blockIndex + 1),
    ];

    applyCaptionBlocks(nextCaptionBlocks);
    setSelectedCaptionId(firstBlock.id);
    setEditingCaptionId(null);
    setCaptionDraft("");
    setCaptionWarning(null);
  }

  function handleMergeWithNext(captionBlock: CaptionBlock) {
    const blockIndex = captionBlocks.findIndex(
      (block) => block.id === captionBlock.id,
    );
    const nextBlock = captionBlocks[blockIndex + 1];

    if (blockIndex < 0 || !nextBlock) {
      setCaptionWarning("There is no next caption to merge.");
      return;
    }

    const mergedWords = [...captionBlock.words, ...nextBlock.words];
    const mergedBlock = createCaptionBlockFromWords(
      captionBlock.id,
      mergedWords,
    );
    const nextCaptionBlocks = [
      ...captionBlocks.slice(0, blockIndex),
      mergedBlock,
      ...captionBlocks.slice(blockIndex + 2),
    ];

    applyCaptionBlocks(nextCaptionBlocks);
    setSelectedCaptionId(mergedBlock.id);
    setEditingCaptionId(null);
    setCaptionDraft("");
    setCaptionWarning(
      mergedWords.length > 8 ? "Merged caption may be harder to read." : null,
    );
  }

  function handleResetCaption(captionBlock: CaptionBlock) {
    const nextCaptionBlocks = captionBlocks.map((block) =>
      block.id === captionBlock.id
        ? { ...block, text: getCaptionText(block.words) }
        : block,
    );

    applyCaptionBlocks(nextCaptionBlocks);
    setEditingCaptionId(null);
    setCaptionDraft("");
    setCaptionWarning(null);
  }

  function isDraftLongerThanOriginal(captionBlock: CaptionBlock) {
    const draftWordCount = captionDraft.trim().split(/\s+/).filter(Boolean).length;

    return (
      editingCaptionId === captionBlock.id &&
      draftWordCount > captionBlock.words.length + 3
    );
  }

  if (projectStage === "transcribing") {
    return (
      <TranscriptStateCard eyebrow="Transcribing" tone="active">
        <p className="text-sky-100/85">{activeTranscriptionStep}</p>
      </TranscriptStateCard>
    );
  }

  if (!transcript || !transcriptWords.length) {
    if (transcriptionMode === "failed") {
      return (
        <div className="space-y-3">
          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-5">
            <div className="flex items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-rose-200/20 bg-rose-200/10">
                <AlertTriangle className="size-4 text-rose-100" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-100/70">
                  {getTranscriptionErrorTitle(transcriptionErrorCode)}
                </div>
                <p className="mt-2 text-sm leading-6 text-rose-50/85">
                  {transcriptionNotice ??
                    "Real AI transcription could not be completed."}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-white/[0.08]"
                onClick={onRetryTranscription}
                type="button"
              >
                Retry Transcription
              </button>
              <button
                className="rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/15"
                onClick={onUseMockTranscript}
                type="button"
              >
                Use Mock Transcript
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <TranscriptStateCard eyebrow="No captions yet">
        Generate captions after project analysis to view word-level timing.
      </TranscriptStateCard>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100/70">
          Captions Ready
        </div>
        <p className="mt-2 text-sm leading-6 text-emerald-50/85">
          Word-level timing is available for review and caption timing prep.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Caption Quality
            </div>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Production checks for caption pacing and transcript readiness.
            </p>
          </div>
          <div
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              transcriptionMode === "real"
                ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                : "border-amber-300/20 bg-amber-300/10 text-amber-100"
            }`}
          >
            {transcriptionModeLabel}
          </div>
        </div>

        {transcriptionMode === "mock" ? (
          <div className="mb-3 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-medium leading-5 text-amber-100">
            Demo transcript is being used. Real video speech has not been
            analyzed.
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          {[
            ["Word Count", totalWords.toString()],
            ["Caption Blocks", captionBlocks.length.toString()],
            ["Avg Words / Caption", averageWordsPerCaption.toFixed(1)],
            ["Avg Caption Duration", formatTimestamp(averageCaptionDuration)],
            ["Words / Minute", `${wordsPerMinute} WPM`],
            ["Readability", readability],
          ].map(([label, value]) => (
            <div
              className="rounded-xl border border-white/8 bg-black/20 p-3"
              key={label}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                {label}
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-100">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-white/[0.08]"
            onClick={onRetryTranscription}
            type="button"
          >
            Retry Transcription
          </button>
          <button
            className="rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/15"
            onClick={onUseMockTranscript}
            type="button"
          >
            Use Mock Transcript
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Full Transcript
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-100">
          {transcript.transcript}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Total Words
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-100">
            {totalWords}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Est. Duration
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-100">
            {formatTimestamp(estimatedDuration)}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Avg Reading Speed
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-100">
            {wordsPerMinute} WPM
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Avg Caption Length
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-100">
            {averageCaptionLength.toFixed(1)} words
          </div>
        </div>
      </div>

      {selectedWord ? (
        <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-100/70">
                Selected Word
              </div>
              <div className="mt-2 text-lg font-semibold text-sky-50">
                {selectedWord.word}
              </div>
            </div>
            <button
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200/20 bg-sky-200/10 px-3 py-2 text-[11px] font-semibold text-sky-50 transition hover:bg-sky-200/15"
              type="button"
            >
              <CornerDownRight className="size-3.5" />
              Jump to word
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-sky-100/10 bg-black/20 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-100/55">
                Start
              </div>
              <div className="mt-1 font-mono text-sky-50">
                {formatTimestamp(selectedWord.start)}
              </div>
            </div>
            <div className="rounded-xl border border-sky-100/10 bg-black/20 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-100/55">
                End
              </div>
              <div className="mt-1 font-mono text-sky-50">
                {formatTimestamp(selectedWord.end)}
              </div>
            </div>
            <div className="rounded-xl border border-sky-100/10 bg-black/20 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-sky-100/55">
                Duration
              </div>
              <div className="mt-1 font-mono text-sky-50">
                {formatTimestamp(getWordDuration(selectedWord))}
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-sky-100/10 bg-black/20 px-3 py-2 text-xs text-sky-100/65">
            Edit word controls will appear here in the caption timing workflow.
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Word Timings
          </div>
          <div className="text-[11px] text-zinc-500">
            {filteredWords.length} shown
          </div>
        </div>
        <label className="mb-3 flex items-center gap-2 rounded-xl border border-white/8 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-400">
          <Search className="size-3.5 text-zinc-500" />
          <input
            className="min-w-0 flex-1 bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search words"
            type="search"
            value={searchQuery}
          />
        </label>
        <div className="max-h-80 space-y-1 overflow-auto pr-1">
          {filteredWords.map((entry, index) => {
            const isSelected =
              selectedWord?.word === entry.word &&
              selectedWord.start === entry.start &&
              selectedWord.end === entry.end;

            return (
              <button
                className={`grid w-full grid-cols-[minmax(0,1.2fr)_0.7fr_0.7fr_0.8fr_auto] items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${
                  isSelected
                    ? "border-sky-300/30 bg-sky-300/10 text-sky-50"
                    : "border-transparent bg-zinc-900 text-zinc-300 hover:border-white/10 hover:bg-zinc-800/80"
                }`}
                key={`${entry.word}-${entry.start}-${index}`}
                onClick={() => setSelectedWord(entry)}
                type="button"
              >
                <span className="truncate font-medium">{entry.word}</span>
                <span className="font-mono text-zinc-500">
                  {formatTimestamp(entry.start)}
                </span>
                <span className="font-mono text-zinc-500">
                  {formatTimestamp(entry.end)}
                </span>
                <span className="font-mono text-zinc-500">
                  {formatTimestamp(getWordDuration(entry))}
                </span>
                <span className="rounded-lg border border-white/8 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-zinc-400">
                  Jump
                </span>
              </button>
            );
          })}
          {!filteredWords.length ? (
            <div className="rounded-xl border border-white/8 bg-zinc-950/70 p-4 text-sm text-zinc-500">
              No words match that search.
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Caption Blocks
            </div>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Auto-grouped from word timings for future caption rendering.
            </p>
          </div>
          <button
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-zinc-300 transition hover:bg-white/[0.07]"
            onClick={handleRegenerateCaptionBlocks}
            type="button"
          >
            <RefreshCw className="size-3.5" />
            Regenerate Blocks
          </button>
        </div>

        {selectedCaption ? (
          <div className="mb-3 rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-100/70">
              Selected Caption
            </div>
            <p className="mt-2 text-sm font-medium leading-6 text-violet-50">
              {selectedCaption.text}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl border border-violet-100/10 bg-black/20 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-100/55">
                  Start
                </div>
                <div className="mt-1 font-mono text-violet-50">
                  {formatTimestamp(selectedCaption.start)}
                </div>
              </div>
              <div className="rounded-xl border border-violet-100/10 bg-black/20 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-100/55">
                  End
                </div>
                <div className="mt-1 font-mono text-violet-50">
                  {formatTimestamp(selectedCaption.end)}
                </div>
              </div>
              <div className="rounded-xl border border-violet-100/10 bg-black/20 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-100/55">
                  Words
                </div>
                <div className="mt-1 font-mono text-violet-50">
                  {selectedCaption.words.length}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {captionWarning ? (
          <div className="mb-3 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-medium text-amber-100">
            {captionWarning}
          </div>
        ) : null}

        <div className="max-h-96 space-y-2 overflow-auto pr-1">
          {captionBlocks.map((entry, index) => {
            const isSelected = entry.id === selectedCaptionId;
            const isEditing = entry.id === editingCaptionId;
            const showLongCaptionWarning = isDraftLongerThanOriginal(entry);

            return (
              <div
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  isSelected
                    ? "border-violet-300/35 bg-violet-300/10"
                    : "border-white/8 bg-zinc-900/80 hover:border-white/14 hover:bg-zinc-800/80"
                }`}
                key={entry.id}
                onClick={() => handleSelectCaption(entry)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelectCaption(entry);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Caption {index + 1}
                    </div>
                    {isEditing ? (
                      <div
                        className="mt-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <textarea
                          className="min-h-20 w-full resize-none rounded-xl border border-violet-200/20 bg-black/30 px-3 py-2 text-sm font-medium leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-200/45"
                          onChange={(event) =>
                            setCaptionDraft(event.target.value)
                          }
                          value={captionDraft}
                        />
                        {showLongCaptionWarning ? (
                          <div className="mt-2 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-medium text-amber-100">
                            Long captions may be harder to read.
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm font-medium leading-6 text-zinc-100">
                        {entry.text}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-zinc-400">
                    {entry.words.length} words
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-black/20 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                      Start
                    </div>
                    <div className="mt-1 font-mono text-zinc-300">
                      {formatTimestamp(entry.start)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/20 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                      End
                    </div>
                    <div className="mt-1 font-mono text-zinc-300">
                      {formatTimestamp(entry.end)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/20 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                      Duration
                    </div>
                    <div className="mt-1 font-mono text-zinc-300">
                      {formatTimestamp(getCaptionDuration(entry))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <button
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-[11px] font-semibold text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!captionDraft.trim()}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSaveCaption(entry);
                        }}
                        type="button"
                      >
                        <Save className="size-3.5" />
                        Save
                      </button>
                      <button
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-zinc-300 transition hover:bg-white/[0.07]"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCancelEditing();
                        }}
                        type="button"
                      >
                        <X className="size-3.5" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="inline-flex items-center gap-1.5 rounded-xl border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-[11px] font-semibold text-violet-100 transition hover:bg-violet-300/15"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleStartEditing(entry);
                      }}
                      type="button"
                    >
                      Edit Caption
                    </button>
                  )}
                  <button
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-zinc-300 transition hover:bg-white/[0.07]"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSplitCaption(entry);
                    }}
                    type="button"
                  >
                    <Scissors className="size-3.5" />
                    Split Caption
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-zinc-300 transition hover:bg-white/[0.07]"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleMergeWithNext(entry);
                    }}
                    type="button"
                  >
                    <GitMerge className="size-3.5" />
                    Merge With Next
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-zinc-300 transition hover:bg-white/[0.07]"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleResetCaption(entry);
                    }}
                    type="button"
                  >
                    <RotateCcw className="size-3.5" />
                    Reset Caption
                  </button>
                </div>
              </div>
            );
          })}
          {!captionBlocks.length ? (
            <div className="rounded-xl border border-white/8 bg-zinc-950/70 p-4 text-sm text-zinc-500">
              Caption blocks will be generated from transcript words.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
