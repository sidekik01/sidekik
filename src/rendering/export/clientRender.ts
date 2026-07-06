import type {
  RenderApiError,
  RenderApiSuccess,
  RenderPreparationInput,
} from "../types/types";

export async function requestRenderedVideo({
  appliedHighlightWordIds,
  captionBlocks,
  exportSettings,
  selectedCaptionStyle,
  videoDuration,
  videoFile,
  videoMetadata,
}: RenderPreparationInput): Promise<RenderApiSuccess> {
  const formData = new FormData();

  if (videoFile) {
    formData.append("video", videoFile);
  }

  formData.append(
    "payload",
    JSON.stringify({
      appliedHighlightWordIds,
      captionBlocks,
      exportSettings,
      selectedCaptionStyle,
      videoDuration,
      videoMetadata,
    }),
  );

  const response = await fetch("/api/render", {
    body: formData,
    method: "POST",
  });
  const result = (await response.json()) as RenderApiSuccess | RenderApiError;

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result ? result.error : "Rendering failed. Try again.",
    );
  }

  return result;
}
