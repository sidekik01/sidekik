"use client";

import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useState } from "react";

import { useProject } from "@/src/features/project/ProjectContext";
import type { CaptionBlock } from "@/src/types/transcript";

const zoomLevels = [1, 1.5, 2.25, 3.5] as const;

function formatTimelineTime(value: number) {
  const safeValue = Math.max(value, 0);
  const minutes = Math.floor(safeValue / 60);
  const seconds = Math.floor(safeValue % 60);
  const tenths = Math.floor((safeValue % 1) * 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}.${tenths}`;
}

function getTimelineDuration(
  captionBlocks: CaptionBlock[],
  videoDuration: number,
) {
  const lastCaptionEnd = captionBlocks.at(-1)?.end ?? 30;

  return Math.max(videoDuration || 0, lastCaptionEnd, 1);
}

function getBlockStyle(captionBlock: CaptionBlock, timelineDuration: number) {
  const left = Math.max((captionBlock.start / timelineDuration) * 100, 0);
  const width = Math.max(
    ((captionBlock.end - captionBlock.start) / timelineDuration) * 100,
    2.5,
  );

  return {
    left: `${Math.min(left, 99)}%`,
    width: `${Math.min(width, 100 - left)}%`,
  };
}

function createRulerTicks(timelineDuration: number, zoomLevel: number) {
  const tickCount = Math.max(Math.round(8 * zoomLevel), 8);

  return Array.from({ length: tickCount + 1 }, (_, index) => {
    const time = (timelineDuration / tickCount) * index;

    return {
      id: `${index}-${time.toFixed(2)}`,
      left: `${(index / tickCount) * 100}%`,
      time,
    };
  });
}

export function Timeline() {
  const {
    captionBlocks,
    selectedCaptionId,
    setSelectedCaptionId,
    setVideoCurrentTime,
    videoCurrentTime,
    videoDuration,
    videoElementRef,
    videoIsPlaying,
  } = useProject();
  const [zoomIndex, setZoomIndex] = useState(0);
  const zoomLevel = zoomLevels[zoomIndex];
  const timelineDuration = getTimelineDuration(captionBlocks, videoDuration);
  const rulerTicks = useMemo(
    () => createRulerTicks(timelineDuration, zoomLevel),
    [timelineDuration, zoomLevel],
  );
  const hasCaptionBlocks = captionBlocks.length > 0;
  const activeCaptionId = captionBlocks.find(
    (captionBlock) =>
      videoCurrentTime >= captionBlock.start &&
      videoCurrentTime <= captionBlock.end,
  )?.id;
  const playheadPosition = Math.min(
    Math.max((videoCurrentTime / timelineDuration) * 100, 0),
    100,
  );

  function handleSelectCaption(captionBlock: CaptionBlock) {
    setSelectedCaptionId(captionBlock.id);
    setVideoCurrentTime(captionBlock.start);

    if (videoElementRef.current) {
      videoElementRef.current.currentTime = captionBlock.start;
    }
  }

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(24,24,27,0.88)_34%,rgba(9,10,13,0.94))] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-black text-zinc-100">
            Caption Timeline
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500">
            <span>{formatTimelineTime(videoCurrentTime)}</span>
            <span className="text-zinc-700">/</span>
            <span>{formatTimelineTime(timelineDuration)}</span>
            <span
              className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider ${
                videoIsPlaying
                  ? "bg-emerald-300/10 text-emerald-200"
                  : "bg-white/[0.04] text-zinc-500"
              }`}
            >
              {videoIsPlaying ? "Playing" : "Paused"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.07] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={zoomIndex === 0}
            onClick={() => setZoomIndex((index) => Math.max(index - 1, 0))}
            type="button"
          >
            <ZoomOut className="size-3.5" />
            Zoom Out
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.07]"
            onClick={() => setZoomIndex(0)}
            type="button"
          >
            <Maximize2 className="size-3.5" />
            Fit to Video
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.07] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={zoomIndex === zoomLevels.length - 1}
            onClick={() =>
              setZoomIndex((index) =>
                Math.min(index + 1, zoomLevels.length - 1),
              )
            }
            type="button"
          >
            <ZoomIn className="size-3.5" />
            Zoom In
          </button>
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-zinc-500">
            {Math.round(zoomLevel * 100)}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-white/10 bg-zinc-950 shadow-inner shadow-black/40">
        <div
          className="relative min-h-32"
          style={{ minWidth: `${zoomLevel * 100}%` }}
        >
          <div className="relative h-9 border-b border-white/8 bg-white/[0.035]">
            {rulerTicks.map((tick) => (
              <div
                className="absolute top-0 h-full border-l border-white/8"
                key={tick.id}
                style={{ left: tick.left }}
              >
                <span className="ml-2 mt-2 block font-mono text-[10px] font-medium text-zinc-600">
                  {formatTimelineTime(tick.time)}
                </span>
              </div>
            ))}
          </div>

          <div className="relative h-24 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(24,24,27,0.82))]">
            <div
              className="absolute top-0 z-30 h-full w-px bg-sky-200 shadow-[0_0_16px_rgba(125,211,252,0.75)]"
              style={{ left: `${playheadPosition}%` }}
            >
              <span className="absolute -left-1 top-0 size-2 rounded-full bg-sky-200 shadow-[0_0_14px_rgba(125,211,252,0.75)]" />
            </div>

            {hasCaptionBlocks ? (
              captionBlocks.map((captionBlock, index) => {
                const isSelected = captionBlock.id === selectedCaptionId;
                const isActive =
                  videoIsPlaying && captionBlock.id === activeCaptionId;

                return (
                  <button
                    className={`absolute top-4 h-16 overflow-hidden rounded-xl px-3 py-2 text-left text-[11px] font-semibold leading-4 transition duration-200 hover:-translate-y-0.5 ${
                      isSelected
                        ? "bg-violet-300/35 text-violet-50 ring-2 ring-violet-200/70 shadow-lg shadow-violet-950/30"
                        : isActive
                          ? "bg-sky-300/35 text-sky-50 ring-2 ring-sky-200/60 shadow-lg shadow-sky-950/30"
                          : "bg-sky-400/18 text-sky-50/85 ring-1 ring-sky-300/20 hover:bg-sky-400/28"
                    }`}
                    key={captionBlock.id}
                    onClick={() => handleSelectCaption(captionBlock)}
                    style={getBlockStyle(captionBlock, timelineDuration)}
                    title={captionBlock.text}
                    type="button"
                  >
                    <span className="block truncate">Caption {index + 1}</span>
                    <span className="mt-1 block truncate font-normal text-white/60">
                      {captionBlock.text}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] font-medium text-white/40">
                      {formatTimelineTime(captionBlock.start)} -{" "}
                      {formatTimelineTime(captionBlock.end)}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="grid h-full place-items-center px-6 text-center text-sm text-zinc-500">
                <div>
                  <div className="font-bold text-zinc-300">Timeline is ready</div>
                  <div className="mt-1 text-xs">
                    Generate captions to populate editable timeline blocks.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
