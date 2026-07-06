export type DirectorMemoryEventType =
  | "caption_edit"
  | "highlight_change"
  | "timing_change"
  | "style_change"
  | "export_choice"
  | "brand_choice";

export type DirectorMemoryEventSource =
  | "transcript"
  | "timeline"
  | "style"
  | "director"
  | "export"
  | "workspace";

export type DirectorMemoryEvent = {
  id: string;
  type: DirectorMemoryEventType;
  source: DirectorMemoryEventSource;
  projectId: string | null;
  timestamp: string;
  summary: string;
  metadata: Record<string, string | number | boolean | null>;
};

export type DirectorMemoryState = {
  editHistory: DirectorMemoryEvent[];
};

export type DirectorMemoryEventInput = Omit<
  DirectorMemoryEvent,
  "id" | "timestamp"
>;
