import type { SavedProject } from "./types";

const storageKey = "sidekik.saved-projects";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function loadSavedProjects(): SavedProject[] {
  if (!canUseStorage()) {
    return [];
  }

  let rawProjects: string | null = null;

  try {
    rawProjects = window.localStorage.getItem(storageKey);
  } catch {
    return [];
  }

  if (!rawProjects) {
    return [];
  }

  try {
    return JSON.parse(rawProjects) as SavedProject[];
  } catch {
    return [];
  }
}

export function saveProjectToStorage(savedProject: SavedProject) {
  if (!canUseStorage()) {
    return [];
  }

  const savedProjects = loadSavedProjects();
  const nextProjects = [
    savedProject,
    ...savedProjects.filter((project) => project.id !== savedProject.id),
  ].slice(0, 8);

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(nextProjects));
  } catch {
    return savedProjects;
  }

  return nextProjects;
}
