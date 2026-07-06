import type { CSSProperties } from "react";
import type { CaptionStyle } from "@/src/features/style/types";
import type { RemotionRenderSettings } from "../types/types";

function getTextShadow(style: CaptionStyle) {
  const blur = Math.max(3, style.shadowIntensity * 8);

  return `0 ${Math.round(blur / 2)}px ${blur}px rgba(0,0,0,0.88), 0 0 2px rgba(0,0,0,0.95)`;
}

export function getCaptionContainerStyle({
  renderSettings,
  style,
}: {
  renderSettings: RemotionRenderSettings;
  style: CaptionStyle;
}): CSSProperties {
  const safeZone = renderSettings.safeZonePadding;
  const horizontalPadding =
    renderSettings.outputWidth * Math.max(safeZone.left, safeZone.right);
  const verticalPadding =
    renderSettings.outputHeight *
    (style.position === "top" ? safeZone.top : safeZone.bottom);

  return {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    left: horizontalPadding,
    position: "absolute",
    right: horizontalPadding,
    textAlign: "center",
    ...(style.position === "top"
      ? { top: verticalPadding }
      : style.position === "center"
        ? { top: "50%", transform: "translateY(-50%)" }
        : { bottom: verticalPadding }),
  };
}

export function getCaptionTextStyle(style: CaptionStyle): CSSProperties {
  return {
    background: style.backgroundBox ? "rgba(0,0,0,0.58)" : "transparent",
    borderRadius: style.backgroundBox ? 18 : 0,
    color: style.textColor,
    display: "inline-flex",
    flexWrap: "wrap",
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: 900,
    gap: "0.32em",
    justifyContent: "center",
    lineHeight: 1.05,
    maxWidth: "100%",
    padding: style.backgroundBox ? "0.22em 0.38em" : 0,
    textShadow: getTextShadow(style),
    textTransform: style.textTransform,
  };
}

export function getWordStyle({
  isActive,
  isSuggested,
  style,
}: {
  isActive: boolean;
  isSuggested: boolean;
  style: CaptionStyle;
}): CSSProperties {
  const shouldHighlight = isActive || isSuggested;
  const usesPill =
    style.activeWordHighlightMode === "background-pill" || isSuggested;

  return {
    background: shouldHighlight && usesPill ? style.highlightColor : undefined,
    borderRadius: shouldHighlight && usesPill ? "0.32em" : undefined,
    color: shouldHighlight && !usesPill ? style.highlightColor : style.textColor,
    display: "inline-block",
    padding: shouldHighlight && usesPill ? "0.02em 0.18em" : 0,
    transform:
      isActive && style.activeWordHighlightMode === "scale-pop"
        ? "scale(1.08)"
        : "scale(1)",
  };
}
