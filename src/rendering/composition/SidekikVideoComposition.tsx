import { AbsoluteFill, OffthreadVideo } from "remotion";
import { CaptionOverlay } from "../captions/CaptionOverlay";
import { sidekikFontFallback } from "../fonts/fontConfig";
import type { SidekikRenderCompositionProps } from "../types/types";

export function SidekikVideoComposition({
  appliedHighlightWordIds,
  captionBlocks,
  captionStyle,
  renderSettings,
  videoUrl,
}: SidekikRenderCompositionProps) {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily: captionStyle.fontFamily || sidekikFontFallback,
        overflow: "hidden",
      }}
    >
      <OffthreadVideo
        src={videoUrl}
        style={{
          height: "100%",
          objectFit: "contain",
          width: "100%",
        }}
      />
      <CaptionOverlay
        appliedHighlightWordIds={appliedHighlightWordIds}
        captionBlocks={captionBlocks}
        captionStyle={captionStyle}
        renderSettings={renderSettings}
      />
    </AbsoluteFill>
  );
}
