import type {
  DirectorMemoryEventType,
  DirectorMemoryState,
} from "@/src/features/director/memory/types";

export function countMemoryEventsByType(
  memory: DirectorMemoryState,
  type: DirectorMemoryEventType,
) {
  return memory.editHistory.filter((event) => event.type === type).length;
}

export function getRecentMemoryEvents(
  memory: DirectorMemoryState,
  limit = 5,
) {
  return memory.editHistory.slice(0, limit);
}
