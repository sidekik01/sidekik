import { useCurrentFrame, useVideoConfig } from "remotion";
import { getActiveCaptionBlock, getActiveWord } from "./timing";
import {
  getCaptionContainerStyle,
  getCaptionTextStyle,
  getWordStyle,
} from "../styles/captionStyle";
import type { SidekikRenderCompositionProps } from "../types/types";

export function CaptionOverlay({
  appliedHighlightWordIds,
  captionBlocks,
  captionStyle,
  renderSettings,
}: Pick<
  SidekikRenderCompositionProps,
  "appliedHighlightWordIds" | "captionBlocks" | "captionStyle" | "renderSettings"
>) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;
  const activeCaption = getActiveCaptionBlock(captionBlocks, currentTime);
  const activeWord = activeCaption
    ? getActiveWord(activeCaption.words, currentTime)
    : null;

  if (!activeCaption) {
    return null;
  }

  return (
    <div
      style={getCaptionContainerStyle({
        renderSettings,
        style: captionStyle,
      })}
    >
      <div style={getCaptionTextStyle(captionStyle)}>
        {activeCaption.words.map((word, index) => {
          const wordId = `${activeCaption.id}-word-${index + 1}`;
          const isActive =
            captionStyle.activeWordHighlight &&
            Boolean(activeWord) &&
            activeWord?.start === word.start &&
            activeWord?.end === word.end;
          const isSuggested = appliedHighlightWordIds.includes(wordId);

          return (
            <span
              key={`${word.word}-${word.start}-${index}`}
              style={getWordStyle({
                isActive,
                isSuggested,
                style: captionStyle,
              })}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
