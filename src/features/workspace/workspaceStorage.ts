import type { WorkspaceSelection } from "@/src/features/workspace/workspaceTypes";

const workspaceSelectionKey = "sidekik.workspace-selection";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadWorkspaceSelection(): WorkspaceSelection | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const storedSelection = window.localStorage.getItem(workspaceSelectionKey);

    if (!storedSelection) {
      return null;
    }

    return JSON.parse(storedSelection) as WorkspaceSelection;
  } catch {
    return null;
  }
}

export function saveWorkspaceSelection(selection: WorkspaceSelection) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(workspaceSelectionKey, JSON.stringify(selection));
  } catch {
    return;
  }
}
