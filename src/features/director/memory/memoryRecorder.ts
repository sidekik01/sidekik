import type {
  DirectorMemoryEvent,
  DirectorMemoryEventInput,
  DirectorMemoryEventType,
} from "@/src/features/director/memory/types";

const memoryLabels: Record<DirectorMemoryEventType, string> = {
  brand_choice: "Brand choice",
  caption_edit: "Caption edit",
  export_choice: "Export choice",
  highlight_change: "Highlight change",
  style_change: "Style change",
  timing_change: "Timing change",
};

export function createDirectorMemoryEvent(
  input: DirectorMemoryEventInput,
): DirectorMemoryEvent {
  return {
    ...input,
    id: `memory-${input.type}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`,
    timestamp: new Date().toISOString(),
  };
}

export function getDirectorMemoryLabel(type: DirectorMemoryEventType) {
  return memoryLabels[type];
}
