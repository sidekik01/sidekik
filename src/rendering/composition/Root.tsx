import { Composition, registerRoot } from "remotion";
import { defaultCaptionStyle } from "@/src/features/style/captionStyles";
import { SidekikVideoComposition } from "./SidekikVideoComposition";
import { createRenderSettings } from "../export/renderSettings";
import type { SidekikRenderCompositionProps } from "../types/types";

const defaultRenderSettings = createRenderSettings({
  outputFormat: "MP4",
  platform: "TikTok / Reels",
  presetId: "tiktok-reels",
});

const defaultProps: SidekikRenderCompositionProps = {
  appliedHighlightWordIds: [],
  captionBlocks: [],
  captionStyle: defaultCaptionStyle,
  renderSettings: defaultRenderSettings,
  videoMetadata: {
    aspectRatio: "9:16",
    codec: "unknown",
    duration: "0:00",
    durationSeconds: 1,
    filename: "sidekik-render.mp4",
    filesize: "0 MB",
    fps: "30",
    height: defaultRenderSettings.outputHeight,
    orientation: "Vertical Reel",
    width: defaultRenderSettings.outputWidth,
  },
  videoUrl: "",
};

function RemotionRoot() {
  return (
    <Composition
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.max(
          1,
          Math.ceil(props.videoMetadata.durationSeconds * props.renderSettings.fps),
        ),
        fps: props.renderSettings.fps,
        height: props.renderSettings.outputHeight,
        width: props.renderSettings.outputWidth,
      })}
      component={SidekikVideoComposition}
      defaultProps={defaultProps}
      durationInFrames={30}
      fps={30}
      height={defaultRenderSettings.outputHeight}
      id="SidekikRenderedVideo"
      width={defaultRenderSettings.outputWidth}
    />
  );
}

registerRoot(RemotionRoot);
