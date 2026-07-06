import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { SidekikRenderCompositionProps } from "../types/types";

export type RenderVideoProgress = {
  progress: number;
  phase: "Preparing" | "Rendering" | "Encoding" | "Finished";
};

export type RenderVideoInput = {
  compositionProps: SidekikRenderCompositionProps;
  outputPath: string;
  onProgress?: (progress: RenderVideoProgress) => void;
};

export async function renderSidekikVideo({
  compositionProps,
  onProgress,
  outputPath,
}: RenderVideoInput) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  onProgress?.({ phase: "Preparing", progress: 0.05 });

  const entryPoint = path.join(
    process.cwd(),
    "src/rendering/composition/Root.tsx",
  );
  const serveUrl = await bundle({
    entryPoint,
    onProgress: (progress) =>
      onProgress?.({ phase: "Preparing", progress: progress * 0.2 }),
  });

  const composition = await selectComposition({
    id: "SidekikRenderedVideo",
    inputProps: compositionProps,
    serveUrl,
  });

  onProgress?.({ phase: "Rendering", progress: 0.25 });

  await renderMedia({
    codec: "h264",
    composition,
    enforceAudioTrack: false,
    inputProps: compositionProps,
    onProgress: (progress) => {
      onProgress?.({
        phase: progress.stitchStage === "encoding" ? "Encoding" : "Rendering",
        progress: 0.25 + progress.progress * 0.7,
      });
    },
    outputLocation: outputPath,
    overwrite: true,
    serveUrl,
  });

  onProgress?.({ phase: "Finished", progress: 1 });

  return {
    outputPath,
  };
}
