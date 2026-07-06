import { writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRenderJob, prepareRenderPayload } from "@/src/services/rendering";
import { renderSidekikVideo } from "@/src/rendering/renderer/renderVideo";
import type { RenderPreparationInput } from "@/src/rendering/types/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const acceptedMimeTypes = new Set([
  "video/mp4",
  "video/quicktime",
  "video/x-m4v",
]);
const acceptedExtensions = [".mp4", ".mov", ".m4v"];
const maxUploadBytes = 750 * 1024 * 1024;

export async function POST(request: Request) {
  const jobId = `render-${crypto.randomUUID()}`;
  const tempDir = path.join("/tmp", "sidekik-renders", jobId);

  try {
    const formData = await request.formData();
    const video = formData.get("video");
    const payload = formData.get("payload");

    if (!(video instanceof File)) {
      return Response.json(
        { error: "Missing video file in form field `video`." },
        { status: 400 },
      );
    }

    if (!video.size) {
      return Response.json(
        { error: "The uploaded file is empty. Choose a valid video file." },
        { status: 400 },
      );
    }

    if (!isAcceptedVideoFile(video)) {
      return Response.json(
        { error: "Unsupported file type. Upload an MP4, MOV, or M4V file." },
        { status: 415 },
      );
    }

    if (video.size > maxUploadBytes) {
      return Response.json(
        { error: "File is too large for local rendering." },
        { status: 413 },
      );
    }

    if (typeof payload !== "string") {
      return Response.json(
        { error: "Missing render payload." },
        { status: 400 },
      );
    }

    const parsedPayload = JSON.parse(payload) as Omit<
      RenderPreparationInput,
      "videoFile"
    >;
    const inputPath = path.join(tempDir, sanitizeFilename(video.name));
    const outputFilename = `${jobId}.mp4`;
    const outputPath = path.join(
      process.cwd(),
      "public",
      "renders",
      outputFilename,
    );

    await mkdir(tempDir, { recursive: true });
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(inputPath, Buffer.from(await video.arrayBuffer()));

    const preparedRender = prepareRenderPayload({
      ...parsedPayload,
      videoFile: video,
    });
    const compositionProps = {
      ...preparedRender,
      videoUrl: pathToFileURL(inputPath).href,
    };
    const estimatedDuration =
      parsedPayload.videoDuration ||
      parsedPayload.videoMetadata?.durationSeconds ||
      1;

    await renderSidekikVideo({
      compositionProps,
      outputPath,
    });

    const job = {
      ...createRenderJob({
        captionBlocks: parsedPayload.captionBlocks,
        exportSettings: parsedPayload.exportSettings,
        videoDuration: estimatedDuration,
      }),
      downloadUrl: `/renders/${outputFilename}`,
      outputPath,
      phase: "Finished" as const,
      progress: 100,
      status: "complete" as const,
    };

    return Response.json({
      downloadUrl: job.downloadUrl,
      job,
      outputPath,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to render video.";

    return Response.json({ error: message }, { status: 500 });
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

function isAcceptedVideoFile(file: File) {
  const filename = file.name.toLowerCase();
  const hasAcceptedExtension = acceptedExtensions.some((extension) =>
    filename.endsWith(extension),
  );

  return acceptedMimeTypes.has(file.type) || hasAcceptedExtension;
}

function sanitizeFilename(filename: string) {
  const extension =
    acceptedExtensions.find((candidate) =>
      filename.toLowerCase().endsWith(candidate),
    ) ?? ".mp4";

  return `input${extension}`;
}
