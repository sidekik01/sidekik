export const tabs = [
  "Analyze",
  "Captions",
  "Style",
  "Review",
  "Export",
] as const;

export const analysisSteps = [
  "Reading Metadata",
  "Detecting Orientation",
  "Measuring Duration",
  "Preparing Preview",
  "Ready",
] as const;

export const transcriptionSteps = [
  "Transcribing...",
  "Reading Audio...",
  "Sending to AI...",
  "Receiving Transcript...",
  "Ready",
] as const;

export type ActiveTab = (typeof tabs)[number];
export type AnalysisStep = (typeof analysisSteps)[number];
export type TranscriptionStep = (typeof transcriptionSteps)[number];
export type TranscriptionMode = "idle" | "real" | "mock" | "failed";
export type TranscriptionErrorCode =
  | "missing_api_key"
  | "unsupported_file_type"
  | "file_too_large"
  | "transcription_failed"
  | "no_speech_detected";
export type Orientation = "Vertical Reel" | "Square" | "Landscape";
export type ProjectStatus =
  | "empty"
  | "analyzing"
  | "ready"
  | "transcribing"
  | "transcript_ready";
export type ProjectStage = ProjectStatus;

export type Project = {
  id: string;
  filename: string;
  filesize: string;
  duration: string;
  width: number;
  height: number;
  aspectRatio: string;
  orientation: Orientation;
  fps: string;
  codec: string;
  audioDetected: string;
  thumbnail: string;
  status: Exclude<ProjectStatus, "empty">;
  objectUrl: string;
};
