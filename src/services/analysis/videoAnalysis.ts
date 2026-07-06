import type { Orientation } from "@/src/types/project";

const acceptedVideoTypes = ["video/mp4", "video/quicktime", "video/x-m4v"];
const acceptedExtensions = [".mp4", ".mov", ".m4v"];

export function isAcceptedVideo(file: File) {
  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();

  return (
    acceptedVideoTypes.includes(file.type) ||
    acceptedExtensions.includes(extension)
  );
}

export function detectOrientation(width: number, height: number): Orientation {
  const differenceRatio = Math.abs(width - height) / Math.max(width, height);

  if (differenceRatio <= 0.05) {
    return "Square";
  }

  return height > width ? "Vertical Reel" : "Landscape";
}

export function getAspectRatio(width: number, height: number) {
  const divisor = getGreatestCommonDivisor(width, height);

  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
}

export function formatDuration(duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) {
    return "00:00";
  }

  const totalSeconds = Math.round(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function createProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `project-${Date.now()}`;
}

export function createThumbnail(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", 0.78);
}

function getGreatestCommonDivisor(first: number, second: number): number {
  return second === 0 ? first : getGreatestCommonDivisor(second, first % second);
}
