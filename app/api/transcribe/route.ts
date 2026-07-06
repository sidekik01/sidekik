import { transcribeVideoFile } from "@/src/services/transcription/transcribe";

export const runtime = "nodejs";

const acceptedMimeTypes = new Set([
  "video/mp4",
  "video/quicktime",
  "video/x-m4v",
]);
const acceptedExtensions = [".mp4", ".mov", ".m4v"];
const maxUploadBytes = 25 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const video = formData.get("video");

    if (!(video instanceof File)) {
      return Response.json(
        {
          code: "transcription_failed",
          error: "Missing video file in form field `video`.",
        },
        { status: 400 },
      );
    }

    if (!video.size) {
      return Response.json(
        {
          code: "transcription_failed",
          error: "The uploaded file is empty. Choose a valid video file.",
        },
        { status: 400 },
      );
    }

    if (!isAcceptedVideoFile(video)) {
      return Response.json(
        {
          code: "unsupported_file_type",
          error: "Unsupported file type. Upload an MP4, MOV, or M4V file.",
        },
        { status: 415 },
      );
    }

    if (video.size > maxUploadBytes) {
      return Response.json(
        {
          code: "file_too_large",
          error: "File is too large for transcription. Upload a file under 25 MB.",
        },
        { status: 413 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          code: "missing_api_key",
          error: "OpenAI API key is missing. Add it to .env.local.",
        },
        { status: 500 },
      );
    }

    const fileBuffer = Buffer.from(await video.arrayBuffer());
    const result = await transcribeVideoFile({
      apiKey,
      fileBuffer,
      filename: video.name,
    });

    if (!result.transcript.trim() || !result.words.length) {
      return Response.json(
        {
          code: "no_speech_detected",
          error: "No speech detected yet. Try another video or use the mock demo transcript.",
        },
        { status: 422 },
      );
    }

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to transcribe video.";

    return Response.json(
      { code: "transcription_failed", error: message },
      { status: 500 },
    );
  }
}

function isAcceptedVideoFile(file: File) {
  const filename = file.name.toLowerCase();
  const hasAcceptedExtension = acceptedExtensions.some((extension) =>
    filename.endsWith(extension),
  );

  return acceptedMimeTypes.has(file.type) || hasAcceptedExtension;
}
