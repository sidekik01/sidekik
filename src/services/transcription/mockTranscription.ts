import type { TranscriptResult, TranscriptWord } from "@/src/types/transcript";

const DEMO_TRANSCRIPT =
  "Welcome to sidekik, where creators turn raw video into polished social captions in minutes. Today we are shaping a short product clip, checking the pacing, and preparing clean caption blocks for every important moment. The goal is simple: keep the story moving, make every word readable, and give editors a faster path from upload to publish.";

function createTimedWords(transcriptText: string): TranscriptWord[] {
  let cursor = 0;

  return transcriptText.split(" ").map((word, index) => {
    const cleanWordLength = word.replace(/[^a-z0-9]/gi, "").length;
    const duration = Math.min(0.62, Math.max(0.22, cleanWordLength * 0.055));
    const pause = /[.!?]$/.test(word) ? 0.24 : /[,;:]$/.test(word) ? 0.12 : 0.05;
    const start = Number(cursor.toFixed(2));
    const end = Number((cursor + duration).toFixed(2));

    cursor = end + pause + (index % 7 === 0 ? 0.03 : 0);

    return {
      end,
      start,
      word,
    };
  });
}

export async function generateMockTranscript(): Promise<TranscriptResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 900));

  const words = createTimedWords(DEMO_TRANSCRIPT);
  const duration = words.at(-1)?.end ?? 0;

  return {
    duration,
    transcript: DEMO_TRANSCRIPT,
    words,
  };
}
