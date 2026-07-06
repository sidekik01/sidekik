"use client";

import { createContext, useContext } from "react";
import type { Dispatch, RefObject } from "react";
import type { AppAction, AppState } from "@/src/state/types";

export type AppContextValue = {
  dispatch: Dispatch<AppAction>;
  state: AppState;
  videoElementRef: RefObject<HTMLVideoElement | null>;
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
