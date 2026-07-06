import type { TranscriptResult } from "@/src/types/transcript";
import type { TranscriptionErrorCode } from "@/src/types/project";

export class TranscriptionRequestError extends Error {
  code: TranscriptionErrorCode;

  constructor(message: string, code: TranscriptionErrorCode) {
    super(message);
    this.name = "TranscriptionRequestError";
    this.code = code;
  }
}

export async function requestTranscription(
  videoFile: File,
): Promise<TranscriptResult> {
  const formData = new FormData();
  formData.append("video", videoFile);

  const response = await fetch("/api/transcribe", {
    body: formData,
    method: "POST",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      code?: TranscriptionErrorCode;
      error?: string;
    } | null;
    throw new TranscriptionRequestError(
      body?.error ?? "Unable to generate transcript.",
      body?.code ?? "transcription_failed",
    );
  }

  return response.json() as Promise<TranscriptResult>;
}
